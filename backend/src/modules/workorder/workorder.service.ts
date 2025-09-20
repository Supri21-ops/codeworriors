import { prisma } from '../../config/prisma';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

// Define work order status types
type WorkOrderStatus = 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
type WorkOrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface CreateWorkOrderData {
  orderNumber: string;
  manufacturingOrderId: string;
  workCenterId: string;
  priority?: WorkOrderPriority;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  assignedUserId?: string;
  notes?: string;
  estimatedDuration?: number;
  items?: {
    productId: string;
    quantity: number;
    unit?: string;
  }[];
}

export interface UpdateWorkOrderData {
  orderNumber?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  assignedUserId?: string;
  notes?: string;
  estimatedDuration?: number;
}

export interface WorkOrderFilters {
  status?: string;
  workCenterId?: string;
  assignedUserId?: string;
}

export class WorkOrderService {
  async getAllWorkOrders(filters: WorkOrderFilters = {}) {
    try {
      const where: any = {};

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.workCenterId) {
        where.workCenterId = filters.workCenterId;
      }

      if (filters.assignedUserId) {
        where.assignedUserId = filters.assignedUserId;
      }

      const workOrders = await prisma.workOrder.findMany({
        where,
        include: {
          manufacturingOrder: {
            select: {
              id: true,
              orderNumber: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true
                }
              },
              quantity: true,
              priority: true,
              status: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  unit: true
                }
              }
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { plannedStartDate: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      return workOrders;
    } catch (error) {
      logger.error('Get all work orders service error:', error);
      throw new AppError('Failed to fetch work orders', 500);
    }
  }

  async getWorkOrderById(id: string) {
    try {
      const workOrder = await prisma.workOrder.findUnique({
        where: { id },
        include: {
          manufacturingOrder: {
            select: {
              id: true,
              orderNumber: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  description: true
                }
              },
              quantity: true,
              priority: true,
              status: true,
              dueDate: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
              capacity: true,
              currentWorkload: true
            }
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  unit: true,
                  description: true
                }
              }
            },
            orderBy: {
              product: {
                name: 'asc'
              }
            }
          },
          qualityChecks: {
            include: {
              checkedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              checkedAt: 'desc'
            }
          }
        }
      });

      if (!workOrder) {
        throw new AppError('Work order not found', 404);
      }

      // Calculate actual duration if work order is completed
      let actualDuration = workOrder.actualDuration;
      if (workOrder.actualStartDate && workOrder.actualEndDate) {
        actualDuration = (workOrder.actualEndDate.getTime() - workOrder.actualStartDate.getTime()) / (1000 * 60 * 60); // in hours
      }

      return {
        ...workOrder,
        actualDuration
      };
    } catch (error) {
      logger.error('Get work order by ID service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch work order', 500);
    }
  }

  async createWorkOrder(data: CreateWorkOrderData) {
    try {
      // Validate manufacturing order exists
      const manufacturingOrder = await prisma.manufacturingOrder.findUnique({
        where: { id: data.manufacturingOrderId }
      });

      if (!manufacturingOrder) {
        throw new AppError('Manufacturing order not found', 404);
      }

      // Validate work center exists
      const workCenter = await prisma.workCenter.findUnique({
        where: { id: data.workCenterId }
      });

      if (!workCenter) {
        throw new AppError('Work center not found', 404);
      }

      // Validate assigned user if provided
      if (data.assignedUserId) {
        const user = await prisma.user.findUnique({
          where: { id: data.assignedUserId }
        });

        if (!user) {
          throw new AppError('Assigned user not found', 404);
        }
      }

      // Check if order number is unique
      const existingWorkOrder = await prisma.workOrder.findUnique({
        where: { orderNumber: data.orderNumber }
      });

      if (existingWorkOrder) {
        throw new AppError('Work order with this order number already exists', 400);
      }

      // Create work order in a transaction
      const workOrder = await prisma.$transaction(async (tx: any) => {
        const newWorkOrder = await tx.workOrder.create({
          data: {
            orderNumber: data.orderNumber,
            manufacturingOrderId: data.manufacturingOrderId,
            workCenterId: data.workCenterId,
            status: 'PLANNED',
            priority: data.priority || 'NORMAL',
            plannedStartDate: data.plannedStartDate,
            plannedEndDate: data.plannedEndDate,
            assignedUserId: data.assignedUserId,
            notes: data.notes,
            estimatedDuration: data.estimatedDuration
          }
        });

        // Create work order items if provided
        if (data.items && data.items.length > 0) {
          await tx.workOrderItem.createMany({
            data: data.items.map(item => ({
              workOrderId: newWorkOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              unit: item.unit || 'pcs'
            }))
          });
        }

        return newWorkOrder;
      });

      // Fetch complete work order with relations
      const completeWorkOrder = await this.getWorkOrderById(workOrder.id);

      logger.info(`Work order created: ${workOrder.id} - ${data.orderNumber}`);
      return completeWorkOrder;
    } catch (error) {
      logger.error('Create work order service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create work order', 500);
    }
  }

  async updateWorkOrder(id: string, data: UpdateWorkOrderData) {
    try {
      // Check if work order exists
      const existingWorkOrder = await prisma.workOrder.findUnique({
        where: { id }
      });

      if (!existingWorkOrder) {
        throw new AppError('Work order not found', 404);
      }

      // Validate assigned user if provided
      if (data.assignedUserId) {
        const user = await prisma.user.findUnique({
          where: { id: data.assignedUserId }
        });

        if (!user) {
          throw new AppError('Assigned user not found', 404);
        }
      }

      // Check order number uniqueness if updating
      if (data.orderNumber && data.orderNumber !== existingWorkOrder.orderNumber) {
        const orderNumberExists = await prisma.workOrder.findFirst({
          where: {
            orderNumber: data.orderNumber,
            id: { not: id }
          }
        });

        if (orderNumberExists) {
          throw new AppError('Work order with this order number already exists', 400);
        }
      }

      const workOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          orderNumber: data.orderNumber,
          status: data.status,
          priority: data.priority,
          plannedStartDate: data.plannedStartDate,
          plannedEndDate: data.plannedEndDate,
          assignedUserId: data.assignedUserId,
          notes: data.notes,
          estimatedDuration: data.estimatedDuration
        }
      });

      // Fetch complete work order with relations
      const completeWorkOrder = await this.getWorkOrderById(id);

      logger.info(`Work order updated: ${id} - ${data.orderNumber || existingWorkOrder.orderNumber}`);
      return completeWorkOrder;
    } catch (error) {
      logger.error('Update work order service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update work order', 500);
    }
  }

  async deleteWorkOrder(id: string) {
    try {
      const existingWorkOrder = await prisma.workOrder.findUnique({
        where: { id }
      });

      if (!existingWorkOrder) {
        throw new AppError('Work order not found', 404);
      }

      // Check if work order can be deleted (not in progress)
      if (existingWorkOrder.status === 'IN_PROGRESS') {
        throw new AppError('Cannot delete work order that is in progress', 400);
      }

      await prisma.workOrder.delete({
        where: { id }
      });

      logger.info(`Work order deleted: ${id} - ${existingWorkOrder.orderNumber}`);
    } catch (error) {
      logger.error('Delete work order service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete work order', 500);
    }
  }

  async startWorkOrder(id: string, userId: string) {
    try {
      const workOrder = await prisma.workOrder.findUnique({
        where: { id }
      });

      if (!workOrder) {
        throw new AppError('Work order not found', 404);
      }

      if (workOrder.status !== 'PLANNED' && workOrder.status !== 'RELEASED') {
        throw new AppError('Work order cannot be started from current status', 400);
      }

      const updatedWorkOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          status: 'IN_PROGRESS',
          actualStartDate: new Date(),
          assignedUserId: workOrder.assignedUserId || userId
        }
      });

      logger.info(`Work order started: ${id} by user ${userId}`);
      return this.getWorkOrderById(id);
    } catch (error) {
      logger.error('Start work order service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to start work order', 500);
    }
  }

  async pauseWorkOrder(id: string, userId: string) {
    try {
      const workOrder = await prisma.workOrder.findUnique({
        where: { id }
      });

      if (!workOrder) {
        throw new AppError('Work order not found', 404);
      }

      if (workOrder.status !== 'IN_PROGRESS') {
        throw new AppError('Only in-progress work orders can be paused', 400);
      }

      const updatedWorkOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          status: 'ON_HOLD'
        }
      });

      logger.info(`Work order paused: ${id} by user ${userId}`);
      return this.getWorkOrderById(id);
    } catch (error) {
      logger.error('Pause work order service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to pause work order', 500);
    }
  }

  async completeWorkOrder(id: string, userId: string) {
    try {
      const workOrder = await prisma.workOrder.findUnique({
        where: { id }
      });

      if (!workOrder) {
        throw new AppError('Work order not found', 404);
      }

      if (workOrder.status !== 'IN_PROGRESS') {
        throw new AppError('Only in-progress work orders can be completed', 400);
      }

      const endDate = new Date();
      let actualDuration = 0;

      if (workOrder.actualStartDate) {
        actualDuration = (endDate.getTime() - workOrder.actualStartDate.getTime()) / (1000 * 60 * 60); // in hours
      }

      const updatedWorkOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          actualEndDate: endDate,
          actualDuration: actualDuration
        }
      });

      logger.info(`Work order completed: ${id} by user ${userId} in ${actualDuration.toFixed(2)} hours`);
      return this.getWorkOrderById(id);
    } catch (error) {
      logger.error('Complete work order service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to complete work order', 500);
    }
  }

  async cancelWorkOrder(id: string, userId: string, reason?: string) {
    try {
      const workOrder = await prisma.workOrder.findUnique({
        where: { id }
      });

      if (!workOrder) {
        throw new AppError('Work order not found', 404);
      }

      if (workOrder.status === 'COMPLETED' || workOrder.status === 'CANCELLED') {
        throw new AppError('Cannot cancel work order in current status', 400);
      }

      const updatedWorkOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason ? `${workOrder.notes || ''}\nCancelled: ${reason}`.trim() : workOrder.notes
        }
      });

      logger.info(`Work order cancelled: ${id} by user ${userId}${reason ? ` - Reason: ${reason}` : ''}`);
      return this.getWorkOrderById(id);
    } catch (error) {
      logger.error('Cancel work order service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to cancel work order', 500);
    }
  }
}