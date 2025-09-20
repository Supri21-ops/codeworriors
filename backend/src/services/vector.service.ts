import { prisma } from '../config/prisma';
import { logger } from '../config/logger';
import { AppError } from '../libs/errors';

interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: any;
}

interface SearchOptions {
  limit?: number;
  threshold?: number;
  filters?: Record<string, any>;
}

export class VectorService {
  private readonly EMBEDDING_DIMENSION = 1536; // OpenAI ada-002 dimension

  async createEmbedding(text: string): Promise<number[]> {
    try {
      // In production, you would call OpenAI API or another embedding service
      // For now, we'll create a mock embedding
      const mockEmbedding = Array.from({ length: this.EMBEDDING_DIMENSION }, () => Math.random());
      
      // Normalize the vector
      const magnitude = Math.sqrt(mockEmbedding.reduce((sum, val) => sum + val * val, 0));
      return mockEmbedding.map(val => val / magnitude);
    } catch (error) {
      logger.error('Error creating embedding:', error);
      throw new AppError('Failed to create embedding', 500);
    }
  }

  async indexDocument(
    id: string, 
    content: string, 
    metadata: any = {},
    collection: string = 'documents'
  ) {
    try {
      const embedding = await this.createEmbedding(content);
      
      // Store in vector database (using pgvector extension)
      await prisma.$executeRaw`
        INSERT INTO vector_documents (id, content, embedding, metadata, collection, created_at)
        VALUES (${id}, ${content}, ${JSON.stringify(embedding)}::vector, ${JSON.stringify(metadata)}, ${collection}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          content = EXCLUDED.content,
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `;

      logger.info(`Document indexed: ${id} in collection ${collection}`);
    } catch (error) {
      logger.error('Error indexing document:', error);
      throw new AppError('Failed to index document', 500);
    }
  }

  async searchSimilar(
    query: string, 
    collection: string = 'documents',
    options: SearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    try {
      const { limit = 10, threshold = 0.7, filters = {} } = options;
      const queryEmbedding = await this.createEmbedding(query);

      // Build filter conditions
      let filterConditions = `collection = '${collection}'`;
      if (Object.keys(filters).length > 0) {
        const filterClauses = Object.entries(filters).map(([key, value]) => 
          `metadata->>'${key}' = '${value}'`
        );
        filterConditions += ` AND ${filterClauses.join(' AND ')}`;
      }

      const results = await prisma.$queryRaw<VectorSearchResult[]>`
        SELECT 
          id,
          content,
          metadata,
          1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
        FROM vector_documents
        WHERE ${filterConditions}
        AND 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
        ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        LIMIT ${limit}
      `;

      return results;
    } catch (error) {
      logger.error('Error searching similar documents:', error);
      throw new AppError('Failed to search similar documents', 500);
    }
  }

  async searchManufacturingOrders(query: string, filters: any = {}) {
    try {
      const results = await this.searchSimilar(query, 'manufacturing-orders', {
        limit: 20,
        threshold: 0.6,
        filters
      });

      // Enrich with manufacturing order data
      const enrichedResults = await Promise.all(
        results.map(async (result) => {
          const order = await prisma.manufacturingOrder.findUnique({
            where: { id: result.id },
            include: {
              product: true,
              createdBy: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          });

          return {
            ...result,
            orderData: order
          };
        })
      );

      return enrichedResults;
    } catch (error) {
      logger.error('Error searching manufacturing orders:', error);
      throw new AppError('Failed to search manufacturing orders', 500);
    }
  }

  async searchProducts(query: string, filters: any = {}) {
    try {
      const results = await this.searchSimilar(query, 'products', {
        limit: 15,
        threshold: 0.7,
        filters
      });

      // Enrich with product data
      const enrichedResults = await Promise.all(
        results.map(async (result) => {
          const product = await prisma.product.findUnique({
            where: { id: result.id }
          });

          return {
            ...result,
            productData: product
          };
        })
      );

      return enrichedResults;
    } catch (error) {
      logger.error('Error searching products:', error);
      throw new AppError('Failed to search products', 500);
    }
  }

  async getRecommendations(orderId: string, type: 'similar_orders' | 'recommended_products' = 'similar_orders') {
    try {
      const order = await prisma.manufacturingOrder.findUnique({
        where: { id: orderId },
        include: { product: true }
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const searchQuery = `${order.product.name} ${order.product.description || ''} ${order.notes || ''}`;
      
      if (type === 'similar_orders') {
        return this.searchManufacturingOrders(searchQuery, {
          excludeId: orderId
        });
      } else {
        return this.searchProducts(searchQuery);
      }
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      throw new AppError('Failed to get recommendations', 500);
    }
  }

  async updateDocumentEmbedding(id: string, content: string, metadata: any = {}) {
    try {
      await this.indexDocument(id, content, metadata);
      logger.info(`Document embedding updated: ${id}`);
    } catch (error) {
      logger.error('Error updating document embedding:', error);
      throw new AppError('Failed to update document embedding', 500);
    }
  }

  async deleteDocument(id: string) {
    try {
      await prisma.$executeRaw`
        DELETE FROM vector_documents WHERE id = ${id}
      `;
      logger.info(`Document deleted from vector store: ${id}`);
    } catch (error) {
      logger.error('Error deleting document:', error);
      throw new AppError('Failed to delete document', 500);
    }
  }

  async getCollectionStats(collection: string) {
    try {
      const stats = await prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*) as count
        FROM vector_documents
        WHERE collection = ${collection}
      `;

      return {
        collection,
        documentCount: stats[0]?.count || 0
      };
    } catch (error) {
      logger.error('Error getting collection stats:', error);
      throw new AppError('Failed to get collection stats', 500);
    }
  }
}

export const vectorService = new VectorService();