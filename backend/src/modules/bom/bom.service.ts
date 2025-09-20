import { DatabaseService } from '../../services/database.service';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';
import { db } from '../../config/prisma';

export interface CreateBomData {
  name: string;
  description?: string;
  version?: string;
  items: {
    productId: string;
    quantity: number;
    unit?: string;
  }[];
}

export interface UpdateBomData {
  name?: string;
  description?: string;
  version?: string;
  isActive?: boolean;
  items?: {
    productId: string;
    quantity: number;
    unit?: string;
  }[];
}

export class BomService extends DatabaseService {
  constructor() {
    super('boms');
  }

  // Alias methods for controller compatibility
  async getAllBoms() {
    return this.findAll({ orderBy: 'created_at DESC' });
  }

  async getBomById(id: string) {
    const bom = await this.findById(id);
    if (!bom) {
      throw new AppError('BOM not found', 404);
    }
    
    // Get BOM items
    const itemsResult = await db.query(
      'SELECT bi.*, p.name as product_name FROM bom_items bi LEFT JOIN products p ON bi.product_id = p.id WHERE bi.bom_id = $1',
      [id]
    );
    
    return {
      ...bom,
      items: itemsResult.rows
    };
  }

  async createBom(data: CreateBomData) {
    try {
      // Generate UUID for the BOM
      const bomId = require('crypto').randomUUID();
      
      // Create the BOM
      const bomData = {
        id: bomId,
        name: data.name,
        description: data.description || '',
        version: data.version || '1.0',
        is_active: true
      };
      
      const bom = await this.create(bomData);
      
      // Create BOM items if provided
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await db.query(
            'INSERT INTO bom_items (id, bom_id, product_id, quantity, unit, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
            [require('crypto').randomUUID(), bomId, item.productId, item.quantity, item.unit || 'pcs']
          );
        }
      }
      
      return await this.getBomById(bomId);
    } catch (error) {
      logger.error('Error creating BOM:', error);
      throw new AppError('Failed to create BOM', 500);
    }
  }

  async updateBom(id: string, data: UpdateBomData) {
    try {
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.version) updateData.version = data.version;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;
      
      const bom = await this.update(id, updateData);
      
      // Update BOM items if provided
      if (data.items) {
        // Delete existing items
        await db.query('DELETE FROM bom_items WHERE bom_id = $1', [id]);
        
        // Create new items
        for (const item of data.items) {
          await db.query(
            'INSERT INTO bom_items (id, bom_id, product_id, quantity, unit, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
            [require('crypto').randomUUID(), id, item.productId, item.quantity, item.unit || 'pcs']
          );
        }
      }
      
      return await this.getBomById(id);
    } catch (error) {
      logger.error('Error updating BOM:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update BOM', 500);
    }
  }

  async deleteBom(id: string) {
    try {
      // Delete BOM items first
      await db.query('DELETE FROM bom_items WHERE bom_id = $1', [id]);
      
      // Delete the BOM
      const deleted = await this.delete(id);
      if (!deleted) {
        throw new AppError('BOM not found', 404);
      }
      
      return true;
    } catch (error) {
      logger.error('Error deleting BOM:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete BOM', 500);
    }
  }
}