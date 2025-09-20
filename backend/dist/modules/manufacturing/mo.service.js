"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturingOrderService = void 0;
const logger_1 = require("../../config/logger");
const errors_1 = require("../../libs/errors");
const kafka_1 = require("../../config/kafka");
const vector_service_1 = require("../../services/vector.service");
const priority_service_1 = require("../../services/priority.service");
class ManufacturingOrderService {
    async createManufacturingOrder(data, userId) {
        try {
            const orderNumber = await this.generateOrderNumber();
            const product = await prisma.product.findUnique({
                where: { id: data.productId }
            });
            if (!product) {
                throw new errors_1.AppError('Product not found', 404);
            }
            const manufacturingOrder = await prisma.manufacturingOrder.create({
                data: {
                    orderNumber,
                    productId: data.productId,
                    quantity: data.quantity,
                    priority: data.priority || 'NORMAL',
                    dueDate: new Date(data.dueDate),
                    notes: data.notes,
                    createdById: userId
                },
                include: {
                    product: true,
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });
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
            const skip = (page - 1) * limit;
            const where = {};
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.priority) {
                where.priority = filters.priority;
            }
            if (filters.productId) {
                where.productId = filters.productId;
            }
            const [orders, total] = await Promise.all([
                prisma.manufacturingOrder.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        product: true,
                        createdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        workOrders: {
                            include: {
                                workCenter: true,
                                assignedUser: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.manufacturingOrder.count({ where })
            ]);
            return {
                orders,
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
            const order = await prisma.manufacturingOrder.findUnique({
                where: { id },
                include: {
                    product: true,
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    workOrders: {
                        include: {
                            workCenter: true,
                            assignedUser: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            },
                            items: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    }
                }
            });
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
            const existingOrder = await prisma.manufacturingOrder.findUnique({
                where: { id }
            });
            if (!existingOrder) {
                throw new errors_1.AppError('Manufacturing order not found', 404);
            }
            const updateData = {};
            if (data.quantity !== undefined)
                updateData.quantity = data.quantity;
            if (data.priority)
                updateData.priority = data.priority;
            if (data.status)
                updateData.status = data.status;
            if (data.startDate)
                updateData.startDate = new Date(data.startDate);
            if (data.endDate)
                updateData.endDate = new Date(data.endDate);
            if (data.dueDate)
                updateData.dueDate = new Date(data.dueDate);
            if (data.notes !== undefined)
                updateData.notes = data.notes;
            const updatedOrder = await prisma.manufacturingOrder.update({
                where: { id },
                data: updateData,
                include: {
                    product: true,
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });
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
            const existingOrder = await prisma.manufacturingOrder.findUnique({
                where: { id }
            });
            if (!existingOrder) {
                throw new errors_1.AppError('Manufacturing order not found', 404);
            }
            const workOrders = await prisma.workOrder.findMany({
                where: { manufacturingOrderId: id }
            });
            if (workOrders.length > 0) {
                throw new errors_1.AppError('Cannot delete manufacturing order with existing work orders', 400);
            }
            await prisma.manufacturingOrder.delete({
                where: { id }
            });
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
            const [total, planned, inProgress, completed, cancelled, urgent] = await Promise.all([
                prisma.manufacturingOrder.count(),
                prisma.manufacturingOrder.count({ where: { status: 'PLANNED' } }),
                prisma.manufacturingOrder.count({ where: { status: 'IN_PROGRESS' } }),
                prisma.manufacturingOrder.count({ where: { status: 'COMPLETED' } }),
                prisma.manufacturingOrder.count({ where: { status: 'CANCELLED' } }),
                prisma.manufacturingOrder.count({ where: { priority: 'URGENT' } })
            ]);
            return {
                total,
                planned,
                inProgress,
                completed,
                cancelled,
                urgent
            };
        }
        catch (error) {
            logger_1.logger.error('Get manufacturing order stats error:', error);
            throw error;
        }
    }
    async generateOrderNumber() {
        const count = await prisma.manufacturingOrder.count();
        const orderNumber = `MO-${String(count + 1).padStart(4, '0')}`;
        return orderNumber;
    }
    async createEvent(type, data, userId) {
        try {
            await prisma.event.create({
                data: {
                    type: type,
                    title: `Manufacturing Order ${type.split('_').join(' ').toLowerCase()}`,
                    message: `Manufacturing order ${data.orderNumber} has been ${type.split('_')[2]?.toLowerCase()}`,
                    data,
                    userId
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Create event error:', error);
        }
    }
}
exports.ManufacturingOrderService = ManufacturingOrderService;
//# sourceMappingURL=mo.service.js.map