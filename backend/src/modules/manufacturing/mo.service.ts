import { pool } from '../../config/prisma';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';
import { CreateManufacturingOrderDto, UpdateManufacturingOrderDto } from './dto';
import { kafkaService } from '../../config/kafka';
import { vectorService } from '../../services/vector.service';
import { priorityService } from '../../services/priority.service';

export class ManufacturingOrderService {
  async createManufacturingOrder(data: CreateManufacturingOrderDto, userId: string) {
    try {
      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: data.productId }
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Create manufacturing order
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

      // Publish Kafka event
      await kafkaService.publishManufacturingOrderEvent('MANUFACTURING_ORDER_CREATED', {
        orderId: manufacturingOrder.id,
        orderNumber: manufacturingOrder.orderNumber,
        productName: product.name,
        quantity: manufacturingOrder.quantity,
        userId
      });

      // Index for vector search
      const content = `${product.name} ${product.description || ''} ${manufacturingOrder.notes || ''}`;
      await vectorService.indexDocument(
        manufacturingOrder.id,
        content,
        {
          type: 'manufacturing_order',
          productId: manufacturingOrder.productId,
          quantity: manufacturingOrder.quantity,
          priority: manufacturingOrder.priority,
          status: manufacturingOrder.status
        },
        'manufacturing-orders'
      );

      // Calculate priority score
      await priorityService.calculatePriorityScore(manufacturingOrder.id, 'MANUFACTURING_ORDER');

      logger.info(`Manufacturing order created: ${orderNumber}`);

      return manufacturingOrder;
    } catch (error) {
      logger.error('Create manufacturing order error:', error);
      throw error;
    }
  }

  async getManufacturingOrders(page = 1, limit = 10, filters: any = {}) {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = {};
      
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
    } catch (error) {
      logger.error('Get manufacturing orders error:', error);
      throw error;
    }
  }

  async getManufacturingOrderById(id: string) {
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
        throw new AppError('Manufacturing order not found', 404);
      }

      return order;
    } catch (error) {
      logger.error('Get manufacturing order by ID error:', error);
      throw error;
    }
  }

  async updateManufacturingOrder(id: string, data: UpdateManufacturingOrderDto, userId: string) {
    try {
      const existingOrder = await prisma.manufacturingOrder.findUnique({
        where: { id }
      });

      if (!existingOrder) {
        throw new AppError('Manufacturing order not found', 404);
      }

      const updateData: any = {};
      
      if (data.quantity !== undefined) updateData.quantity = data.quantity;
      if (data.priority) updateData.priority = data.priority;
      if (data.status) updateData.status = data.status;
      if (data.startDate) updateData.startDate = new Date(data.startDate);
      if (data.endDate) updateData.endDate = new Date(data.endDate);
      if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
      if (data.notes !== undefined) updateData.notes = data.notes;

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

      // Create event
      await this.createEvent('MANUFACTURING_ORDER_UPDATED', {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        changes: data
      }, userId);

      logger.info(`Manufacturing order updated: ${updatedOrder.orderNumber}`);

      return updatedOrder;
    } catch (error) {
      logger.error('Update manufacturing order error:', error);
      throw error;
    }
  }

  async deleteManufacturingOrder(id: string, userId: string) {
    try {
      const existingOrder = await prisma.manufacturingOrder.findUnique({
        where: { id }
      });

      if (!existingOrder) {
        throw new AppError('Manufacturing order not found', 404);
      }

      // Check if order has work orders
      const workOrders = await prisma.workOrder.findMany({
        where: { manufacturingOrderId: id }
      });

      if (workOrders.length > 0) {
        throw new AppError('Cannot delete manufacturing order with existing work orders', 400);
      }

      await prisma.manufacturingOrder.delete({
        where: { id }
      });

      logger.info(`Manufacturing order deleted: ${existingOrder.orderNumber}`);

      return { message: 'Manufacturing order deleted successfully' };
    } catch (error) {
      logger.error('Delete manufacturing order error:', error);
      throw error;
    }
  }

  async getManufacturingOrderStats() {
    try {
      const [
        total,
        planned,
        inProgress,
        completed,
        cancelled,
        urgent
      ] = await Promise.all([
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
    } catch (error) {
      logger.error('Get manufacturing order stats error:', error);
      throw error;
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const count = await prisma.manufacturingOrder.count();
    const orderNumber = `MO-${String(count + 1).padStart(4, '0')}`;
    return orderNumber;
  }

  private async createEvent(type: string, data: any, userId: string) {
    try {
      await prisma.event.create({
        data: {
          type: type as any,
          title: `Manufacturing Order ${type.split('_').join(' ').toLowerCase()}`,
          message: `Manufacturing order ${data.orderNumber} has been ${type.split('_')[2]?.toLowerCase()}`,
          data,
          userId
        }
      });
    } catch (error) {
      logger.error('Create event error:', error);
      // Don't throw error for event creation failure
    }
  }
}