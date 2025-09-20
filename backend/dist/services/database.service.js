"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = require("../config/logger");
const errors_1 = require("../libs/errors");
class DatabaseService {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async findAll(options) {
        try {
            let query = `SELECT * FROM ${this.tableName}`;
            const params = [];
            let paramCount = 0;
            if (options?.where) {
                const whereConditions = [];
                Object.entries(options.where).forEach(([key, value]) => {
                    paramCount++;
                    whereConditions.push(`${key} = $${paramCount}`);
                    params.push(value);
                });
                if (whereConditions.length > 0) {
                    query += ` WHERE ${whereConditions.join(' AND ')}`;
                }
            }
            if (options?.orderBy) {
                query += ` ORDER BY ${options.orderBy}`;
            }
            if (options?.limit) {
                paramCount++;
                query += ` LIMIT $${paramCount}`;
                params.push(options.limit);
            }
            if (options?.offset) {
                paramCount++;
                query += ` OFFSET $${paramCount}`;
                params.push(options.offset);
            }
            const result = await prisma_1.db.query(query, params);
            return result.rows;
        }
        catch (error) {
            logger_1.logger.error(`Error finding all from ${this.tableName}:`, error);
            throw new errors_1.AppError(`Failed to retrieve ${this.tableName}`, 500);
        }
    }
    async findById(id) {
        try {
            const result = await prisma_1.db.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            logger_1.logger.error(`Error finding ${this.tableName} by id:`, error);
            throw new errors_1.AppError(`Failed to find ${this.tableName}`, 500);
        }
    }
    async create(data) {
        try {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
            const columns = keys.join(', ');
            const query = `
        INSERT INTO ${this.tableName} (${columns}, created_at, updated_at) 
        VALUES (${placeholders}, NOW(), NOW()) 
        RETURNING *
      `;
            const result = await prisma_1.db.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            logger_1.logger.error(`Error creating ${this.tableName}:`, error);
            throw new errors_1.AppError(`Failed to create ${this.tableName}`, 500);
        }
    }
    async update(id, data) {
        try {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
            const query = `
        UPDATE ${this.tableName} 
        SET ${setClause}, updated_at = NOW() 
        WHERE id = $1 
        RETURNING *
      `;
            const result = await prisma_1.db.query(query, [id, ...values]);
            return result.rows[0];
        }
        catch (error) {
            logger_1.logger.error(`Error updating ${this.tableName}:`, error);
            throw new errors_1.AppError(`Failed to update ${this.tableName}`, 500);
        }
    }
    async delete(id) {
        try {
            const result = await prisma_1.db.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
            return (result.rowCount || 0) > 0;
        }
        catch (error) {
            logger_1.logger.error(`Error deleting ${this.tableName}:`, error);
            throw new errors_1.AppError(`Failed to delete ${this.tableName}`, 500);
        }
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map