import { db } from '../config/prisma';
import { logger } from '../config/logger';
import { AppError } from '../libs/errors';

export abstract class DatabaseService {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findAll(options?: { where?: Record<string, any>, orderBy?: string, limit?: number, offset?: number }) {
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      const params: any[] = [];
      let paramCount = 0;

      if (options?.where) {
        const whereConditions: string[] = [];
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

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error(`Error finding all from ${this.tableName}:`, error);
      throw new AppError(`Failed to retrieve ${this.tableName}`, 500);
    }
  }

  async findById(id: string) {
    try {
      const result = await db.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error finding ${this.tableName} by id:`, error);
      throw new AppError(`Failed to find ${this.tableName}`, 500);
    }
  }

  async create(data: Record<string, any>) {
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
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating ${this.tableName}:`, error);
      throw new AppError(`Failed to create ${this.tableName}`, 500);
    }
  }

  async update(id: string, data: Record<string, any>) {
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
      
      const result = await db.query(query, [id, ...values]);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error updating ${this.tableName}:`, error);
      throw new AppError(`Failed to update ${this.tableName}`, 500);
    }
  }

  async delete(id: string) {
    try {
      const result = await db.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      logger.error(`Error deleting ${this.tableName}:`, error);
      throw new AppError(`Failed to delete ${this.tableName}`, 500);
    }
  }
}