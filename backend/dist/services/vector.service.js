"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorService = exports.VectorService = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
const pool = new pg_1.Pool({ connectionString: env_1.config.DATABASE_URL });
const logger_1 = require("../config/logger");
const errors_1 = require("../libs/errors");
class VectorService {
    constructor() {
        this.EMBEDDING_DIMENSION = 1536;
    }
    async createEmbedding(text) {
        try {
            const mockEmbedding = Array.from({ length: this.EMBEDDING_DIMENSION }, () => Math.random());
            const magnitude = Math.sqrt(mockEmbedding.reduce((sum, val) => sum + val * val, 0));
            return mockEmbedding.map(val => val / magnitude);
        }
        catch (error) {
            logger_1.logger.error('Error creating embedding:', error);
            throw new errors_1.AppError('Failed to create embedding', 500);
        }
    }
    async indexDocument(id, content, metadata = {}, collection = 'documents') {
        try {
            const embedding = await this.createEmbedding(content);
            await pool.query(`INSERT INTO vector_documents (id, content, embedding, metadata, collection, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           content = EXCLUDED.content,
           embedding = EXCLUDED.embedding,
           metadata = EXCLUDED.metadata,
           updatedAt = NOW()`, [id, content, embedding, metadata, collection]);
            logger_1.logger.info(`Document indexed: ${id} in collection ${collection}`);
        }
        catch (error) {
            logger_1.logger.error('Error indexing document:', error);
            throw new errors_1.AppError('Failed to index document', 500);
        }
    }
    async searchSimilar(query, collection = 'documents', options = {}) {
        try {
            const { limit = 10, threshold = 0.7, filters = {} } = options;
            const queryEmbedding = await this.createEmbedding(query);
            let filterConditions = [`collection = $1`];
            let filterValues = [collection];
            let paramIndex = 2;
            for (const [key, value] of Object.entries(filters)) {
                filterConditions.push(`metadata->>$${paramIndex} = $${paramIndex + 1}`);
                filterValues.push(key, value);
                paramIndex += 2;
            }
            filterConditions.push(`1 - (embedding <=> $${paramIndex}::vector) > $${paramIndex + 1}`);
            filterValues.push(queryEmbedding, threshold);
            const sql = `SELECT id, content, metadata, 1 - (embedding <=> $${paramIndex}::vector) as similarity
                   FROM vector_documents
                   WHERE ${filterConditions.join(' AND ')}
                   ORDER BY embedding <=> $${paramIndex}::vector
                   LIMIT $${paramIndex + 2}`;
            filterValues.push(limit);
            const { rows } = await pool.query(sql, filterValues);
            return rows;
        }
        catch (error) {
            logger_1.logger.error('Error searching similar documents:', error);
            throw new errors_1.AppError('Failed to search similar documents', 500);
        }
    }
    async searchManufacturingOrders(query, filters = {}) {
        try {
            const results = await this.searchSimilar(query, 'manufacturing-orders', {
                limit: 20,
                threshold: 0.6,
                filters
            });
            const enrichedResults = await Promise.all(results.map(async (result) => {
                const { rows: orderRows } = await pool.query(`SELECT mo.*, p.*, u.firstName, u.lastName, u.email
             FROM manufacturing_orders mo
             JOIN products p ON mo.productId = p.id
             JOIN users u ON mo.createdById = u.id
             WHERE mo.id = $1`, [result.id]);
                return {
                    ...result,
                    orderData: orderRows[0] || null
                };
            }));
            return enrichedResults;
        }
        catch (error) {
            logger_1.logger.error('Error searching manufacturing orders:', error);
            throw new errors_1.AppError('Failed to search manufacturing orders', 500);
        }
    }
    async searchProducts(query, filters = {}) {
        try {
            const results = await this.searchSimilar(query, 'products', {
                limit: 15,
                threshold: 0.7,
                filters
            });
            const enrichedResults = await Promise.all(results.map(async (result) => {
                const { rows: productRows } = await pool.query(`SELECT * FROM products WHERE id = $1`, [result.id]);
                return {
                    ...result,
                    productData: productRows[0] || null
                };
            }));
            return enrichedResults;
        }
        catch (error) {
            logger_1.logger.error('Error searching products:', error);
            throw new errors_1.AppError('Failed to search products', 500);
        }
    }
    async getRecommendations(orderId, type = 'similar_orders') {
        try {
            const { rows: orderRows } = await pool.query(`SELECT mo.*, p.*
         FROM manufacturing_orders mo
         JOIN products p ON mo.productId = p.id
         WHERE mo.id = $1`, [orderId]);
            const order = orderRows[0];
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
            }
            const searchQuery = `${order.name} ${order.description || ''} ${order.notes || ''}`;
            if (type === 'similar_orders') {
                return this.searchManufacturingOrders(searchQuery, { excludeId: orderId });
            }
            else {
                return this.searchProducts(searchQuery);
            }
        }
        catch (error) {
            logger_1.logger.error('Error getting recommendations:', error);
            throw new errors_1.AppError('Failed to get recommendations', 500);
        }
    }
    async updateDocumentEmbedding(id, content, metadata = {}) {
        try {
            await this.indexDocument(id, content, metadata);
            logger_1.logger.info(`Document embedding updated: ${id}`);
        }
        catch (error) {
            logger_1.logger.error('Error updating document embedding:', error);
            throw new errors_1.AppError('Failed to update document embedding', 500);
        }
    }
    async deleteDocument(id) {
        try {
            await pool.query(`DELETE FROM vector_documents WHERE id = $1`, [id]);
            logger_1.logger.info(`Document deleted from vector store: ${id}`);
        }
        catch (error) {
            logger_1.logger.error('Error deleting document:', error);
            throw new errors_1.AppError('Failed to delete document', 500);
        }
    }
    async getCollectionStats(collection) {
        try {
            const { rows } = await pool.query(`SELECT COUNT(*) as count FROM vector_documents WHERE collection = $1`, [collection]);
            return {
                collection,
                documentCount: rows[0]?.count || 0
            };
        }
        catch (error) {
            logger_1.logger.error('Error getting collection stats:', error);
            throw new errors_1.AppError('Failed to get collection stats', 500);
        }
    }
}
exports.VectorService = VectorService;
exports.vectorService = new VectorService();
//# sourceMappingURL=vector.service.js.map