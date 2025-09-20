"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturingOrderService = void 0;
const prisma_1 = require("../../config/prisma");
const logger_1 = require("../../config/logger");
const errors_1 = require("../../libs/errors");
const kafka_1 = require("../../config/kafka");
const vector_service_1 = require("../../services/vector.service");
const priority_service_1 = require("../../services/priority.service");
class ManufacturingOrderService {
    async createManufacturingOrder(data, userId) {
        try {
            const orderNumber = await this.generateOrderNumber();
            const productRes = await prisma_1.pool.query('SELECT * FROM products WHERE id = $1', [data.productId]);
            const product = productRes.rows[0];
            if (!product) {
                throw new errors_1.AppError('Product not found', 404);
            }
            const insertRes = await prisma_1.pool.query(`INSERT INTO manufacturing_orders (orderNumber, productId, quantity, priority, dueDate, notes, createdById)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, [orderNumber, data.productId, data.quantity, data.priority || 'NORMAL', data.dueDate, data.notes, userId]);
            const manufacturingOrder = insertRes.rows[0];
            await kafka_1.kafkaService.publishManufacturingOrderEvent('MANUFACTURING_ORDER_CREATED', {
                orderId: manufacturingOrder.id,
                orderNumber: manufacturingOrder.orderNumber,
                productName: product.name,
                quantity: manufacturingOrder.quantity,
                userId
            });
            const content = `${product.name} ${product.description || ''} ${manufacturingOrder.notes || ''}`;
            await vector_service_1.vectorService.indexDocument(manufacturingOrder.id, content, {
                type: 'manufacturing_order',
                productId: manufacturingOrder.productId,
                quantity: manufacturingOrder.quantity,
                priority: manufacturingOrder.priority,
                status: manufacturingOrder.status
            }, 'manufacturing-orders');
            await priority_service_1.priorityService.calculatePriorityScore(manufacturingOrder.id, 'MANUFACTURING_ORDER');
            logger_1.logger.info(`Manufacturing order created: ${orderNumber}`);
            return manufacturingOrder;
        }
        catch (error) {
            logger_1.logger.error('Create manufacturing order error:', error);
            throw error;
        }
    }
    async getManufacturingOrders(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let whereClauses = [];
            let params = [];
            let paramIdx = 1;
            if (filters.status) {
                whereClauses.push(`status = $${paramIdx}`);
                params.push(filters.status);
                paramIdx++;
            }
            if (filters.priority) {
                whereClauses.push(`priority = $${paramIdx}`);
                params.push(filters.priority);
                paramIdx++;
            }
            if (filters.productId) {
                whereClauses.push(`productId = $${paramIdx}`);
                params.push(filters.productId);
                paramIdx++;
            }
            const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
            const ordersRes = await prisma_1.pool.query(`SELECT * FROM manufacturing_orders ${whereSQL} ORDER BY createdAt DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`, [...params, limit, offset]);
            const countRes = await prisma_1.pool.query(`SELECT COUNT(*) FROM manufacturing_orders ${whereSQL}`, params);
            const total = parseInt(countRes.rows[0].count, 10);
            return {
                orders: ordersRes.rows,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.logger.error('Get manufacturing orders error:', error);
            throw error;
        }
    }
    async getManufacturingOrderById(id) {
        try {
            const orderRes = await prisma_1.pool.query('SELECT * FROM manufacturing_orders WHERE id = $1', [id]);
            const order = orderRes.rows[0];
            if (!order) {
                throw new errors_1.AppError('Manufacturing order not found', 404);
            }
            return order;
        }
        catch (error) {
            logger_1.logger.error('Get manufacturing order by ID error:', error);
            throw error;
        }
    }
    async updateManufacturingOrder(id, data, userId) {
        try {
            const orderRes = await prisma_1.pool.query('SELECT * FROM manufacturing_orders WHERE id = $1', [id]);
            const existingOrder = orderRes.rows[0];
            if (!existingOrder) {
                throw new errors_1.AppError('Manufacturing order not found', 404);
            }
            let updateFields = [];
            let params = [];
            let paramIdx = 1;
            if (data.quantity !== undefined) {
                updateFields.push(`quantity = $${paramIdx}`);
                params.push(data.quantity);
                paramIdx++;
            }
            if (data.priority) {
                updateFields.push(`priority = $${paramIdx}`);
                params.push(data.priority);
                paramIdx++;
            }
            if (data.status) {
                updateFields.push(`status = $${paramIdx}`);
                params.push(data.status);
                paramIdx++;
            }
            if (data.startDate) {
                updateFields.push(`startDate = $${paramIdx}`);
                params.push(data.startDate);
                paramIdx++;
            }
            if (data.endDate) {
                updateFields.push(`endDate = $${paramIdx}`);
                params.push(data.endDate);
                paramIdx++;
            }
            if (data.dueDate) {
                updateFields.push(`dueDate = $${paramIdx}`);
                params.push(data.dueDate);
                paramIdx++;
            }
            if (data.notes !== undefined) {
                updateFields.push(`notes = $${paramIdx}`);
                params.push(data.notes);
                paramIdx++;
            }
            if (updateFields.length === 0) {
                throw new errors_1.AppError('No fields to update', 400);
            }
            params.push(id);
            const updateSQL = `UPDATE manufacturing_orders SET ${updateFields.join(', ')} WHERE id = $${paramIdx} RETURNING *`;
            const updateRes = await prisma_1.pool.query(updateSQL, params);
            const updatedOrder = updateRes.rows[0];
            await this.createEvent('MANUFACTURING_ORDER_UPDATED', {
                orderId: updatedOrder.id,
                orderNumber: updatedOrder.orderNumber,
                changes: data
            }, userId);
            logger_1.logger.info(`Manufacturing order updated: ${updatedOrder.orderNumber}`);
            return updatedOrder;
        }
        catch (error) {
            logger_1.logger.error('Update manufacturing order error:', error);
            throw error;
        }
    }
    async deleteManufacturingOrder(id, userId) {
        try {
            const orderRes = await prisma_1.pool.query('SELECT * FROM manufacturing_orders WHERE id = $1', [id]);
            const existingOrder = orderRes.rows[0];
            if (!existingOrder) {
                throw new errors_1.AppError('Manufacturing order not found', 404);
            }
            const workOrdersRes = await prisma_1.pool.query('SELECT * FROM work_orders WHERE manufacturingOrderId = $1', [id]);
            if (workOrdersRes.rows.length > 0) {
                throw new errors_1.AppError('Cannot delete manufacturing order with existing work orders', 400);
            }
            await prisma_1.pool.query('DELETE FROM manufacturing_orders WHERE id = $1', [id]);
            logger_1.logger.info(`Manufacturing order deleted: ${existingOrder.orderNumber}`);
            return { message: 'Manufacturing order deleted successfully' };
        }
        catch (error) {
            logger_1.logger.error('Delete manufacturing order error:', error);
            throw error;
        }
    }
    async getManufacturingOrderStats() {
        try {
            const totalRes = await prisma_1.pool.query('SELECT COUNT(*) FROM manufacturing_orders');
            const plannedRes = await prisma_1.pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'PLANNED'");
            const inProgressRes = await prisma_1.pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'IN_PROGRESS'");
            const completedRes = await prisma_1.pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'COMPLETED'");
            const cancelledRes = await prisma_1.pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'CANCELLED'");
            const urgentRes = await prisma_1.pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE priority = 'URGENT'");
            return {
                total: parseInt(totalRes.rows[0].count, 10),
                planned: parseInt(plannedRes.rows[0].count, 10),
                inProgress: parseInt(inProgressRes.rows[0].count, 10),
                completed: parseInt(completedRes.rows[0].count, 10),
                cancelled: parseInt(cancelledRes.rows[0].count, 10),
                urgent: parseInt(urgentRes.rows[0].count, 10)
            };
        }
        catch (error) {
            logger_1.logger.error('Get manufacturing order stats error:', error);
            throw error;
        }
    }
    async generateOrderNumber() {
        const countRes = await prisma_1.pool.query('SELECT COUNT(*) FROM manufacturing_orders');
        const count = parseInt(countRes.rows[0].count, 10);
        const orderNumber = `MO-${String(count + 1).padStart(4, '0')}`;
        return orderNumber;
    }
    async createEvent(type, data, userId) {
        try {
            await prisma_1.pool.query(`INSERT INTO events (type, title, message, data, userId)
         VALUES ($1, $2, $3, $4, $5)`, [
                type,
                `Manufacturing Order ${type.split('_').join(' ').toLowerCase()}`,
                `Manufacturing order ${data.orderNumber} has been ${type.split('_')[2]?.toLowerCase()}`,
                JSON.stringify(data),
                userId
            ]);
        }
        catch (error) {
            logger_1.logger.error('Create event error:', error);
        }
    }
}
exports.ManufacturingOrderService = ManufacturingOrderService;
//# sourceMappingURL=mo.service.js.map