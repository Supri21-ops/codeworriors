"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BomService = void 0;
const database_service_1 = require("../../services/database.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
const prisma_1 = require("../../config/prisma");
class BomService extends database_service_1.DatabaseService {
    constructor() {
        super('boms');
    }
    async getAllBoms() {
        return this.findAll({ orderBy: 'created_at DESC' });
    }
    async getBomById(id) {
        const bom = await this.findById(id);
        if (!bom) {
            throw new errors_1.AppError('BOM not found', 404);
        }
        const itemsResult = await prisma_1.db.query('SELECT bi.*, p.name as product_name FROM bom_items bi LEFT JOIN products p ON bi.product_id = p.id WHERE bi.bom_id = $1', [id]);
        return {
            ...bom,
            items: itemsResult.rows
        };
    }
    async createBom(data) {
        try {
            const bomId = require('crypto').randomUUID();
            const bomData = {
                id: bomId,
                name: data.name,
                description: data.description || '',
                version: data.version || '1.0',
                is_active: true
            };
            const bom = await this.create(bomData);
            if (data.items && data.items.length > 0) {
                for (const item of data.items) {
                    await prisma_1.db.query('INSERT INTO bom_items (id, bom_id, product_id, quantity, unit, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())', [require('crypto').randomUUID(), bomId, item.productId, item.quantity, item.unit || 'pcs']);
                }
            }
            return await this.getBomById(bomId);
        }
        catch (error) {
            logger_1.logger.error('Error creating BOM:', error);
            throw new errors_1.AppError('Failed to create BOM', 500);
        }
    }
    async updateBom(id, data) {
        try {
            const updateData = {};
            if (data.name)
                updateData.name = data.name;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.version)
                updateData.version = data.version;
            if (data.isActive !== undefined)
                updateData.is_active = data.isActive;
            const bom = await this.update(id, updateData);
            if (data.items) {
                await prisma_1.db.query('DELETE FROM bom_items WHERE bom_id = $1', [id]);
                for (const item of data.items) {
                    await prisma_1.db.query('INSERT INTO bom_items (id, bom_id, product_id, quantity, unit, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())', [require('crypto').randomUUID(), id, item.productId, item.quantity, item.unit || 'pcs']);
                }
            }
            return await this.getBomById(id);
        }
        catch (error) {
            logger_1.logger.error('Error updating BOM:', error);
            if (error instanceof errors_1.AppError)
                throw error;
            throw new errors_1.AppError('Failed to update BOM', 500);
        }
    }
    async deleteBom(id) {
        try {
            await prisma_1.db.query('DELETE FROM bom_items WHERE bom_id = $1', [id]);
            const deleted = await this.delete(id);
            if (!deleted) {
                throw new errors_1.AppError('BOM not found', 404);
            }
            return true;
        }
        catch (error) {
            logger_1.logger.error('Error deleting BOM:', error);
            if (error instanceof errors_1.AppError)
                throw error;
            throw new errors_1.AppError('Failed to delete BOM', 500);
        }
    }
}
exports.BomService = BomService;
//# sourceMappingURL=bom.service.js.map