import { prisma } from '../../config/prisma';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export interface CreateWorkCenterData {
  name: string;
  description?: string;
  code: string;
  capacity?: number;
  managerId?: string;
}

export interface UpdateWorkCenterData {
  name?: string;
  description?: string;
  code?: string;
  capacity?: number;
  currentWorkload?: number;
  isActive?: boolean;
  managerId?: string;
}

export interface UpdateCapacityData {
  capacity: number;
  currentWorkload?: number;
}

export class WorkCenterService {
  async getAllWorkCenters() {
    try {
      const workCenters = await prisma.workCenter.findMany({
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          stockItems: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  sku: true
                }
              }
            }
          },
          _count: {
            select: {
              workOrders: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return workCenters;
    } catch (error) {
      logger.error('Get all work centers service error:', error);
      throw new AppError('Failed to fetch work centers', 500);
    }
  }

  async getWorkCenterById(id: string) {
    try {
      const workCenter = await prisma.workCenter.findUnique({
        where: { id },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          stockItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  unit: true,
                  category: true
                }
              }
            }
          },
          workOrders: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              priority: true,
              plannedStartDate: true,
              plannedEndDate: true,
              actualStartDate: true,
              actualEndDate: true,
              assignedUser: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 10 // Limit to recent work orders
          },
          _count: {
            select: {
              workOrders: true
            }
          }
        }
      });

      if (!workCenter) {
        throw new AppError('Work center not found', 404);
      }

      return workCenter;
    } catch (error) {
      logger.error('Get work center by ID service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch work center', 500);
    }
  }

  async createWorkCenter(data: CreateWorkCenterData) {
    try {
      // Check if code is unique
      const existingWorkCenter = await prisma.workCenter.findUnique({
        where: { code: data.code }
      });

      if (existingWorkCenter) {
        throw new AppError('Work center with this code already exists', 400);
      }

      // Validate manager if provided
      if (data.managerId) {
        const manager = await prisma.user.findUnique({
          where: { id: data.managerId }
        });

        if (!manager) {
          throw new AppError('Manager not found', 404);
        }
      }

      const workCenter = await prisma.workCenter.create({
        data: {
          name: data.name,
          description: data.description,
          code: data.code,
          capacity: data.capacity || 1,
          currentWorkload: 0,
          managerId: data.managerId
        },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      logger.info(`Work center created: ${workCenter.id} - ${workCenter.name} (${workCenter.code})`);
      return workCenter;
    } catch (error) {
      logger.error('Create work center service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create work center', 500);
    }
  }

  async updateWorkCenter(id: string, data: UpdateWorkCenterData) {
    try {
      // Check if work center exists
      const existingWorkCenter = await prisma.workCenter.findUnique({
        where: { id }
      });

      if (!existingWorkCenter) {
        throw new AppError('Work center not found', 404);
      }

      // Check code uniqueness if updating
      if (data.code && data.code !== existingWorkCenter.code) {
        const codeExists = await prisma.workCenter.findFirst({
          where: {
            code: data.code,
            id: { not: id }
          }
        });

        if (codeExists) {
          throw new AppError('Work center with this code already exists', 400);
        }
      }

      // Validate manager if provided
      if (data.managerId) {
        const manager = await prisma.user.findUnique({
          where: { id: data.managerId }
        });

        if (!manager) {
          throw new AppError('Manager not found', 404);
        }
      }

      const workCenter = await prisma.workCenter.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          code: data.code,
          capacity: data.capacity,
          currentWorkload: data.currentWorkload,
          isActive: data.isActive,
          managerId: data.managerId
        },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      logger.info(`Work center updated: ${id} - ${data.name || existingWorkCenter.name}`);
      return workCenter;
    } catch (error) {
      logger.error('Update work center service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update work center', 500);
    }
  }

  async deleteWorkCenter(id: string) {
    try {
      // Check if work center exists
      const existingWorkCenter = await prisma.workCenter.findUnique({
        where: { id }
      });

      if (!existingWorkCenter) {
        throw new AppError('Work center not found', 404);
      }

      // Check if work center has active work orders
      const activeWorkOrders = await prisma.workOrder.count({
        where: {
          workCenterId: id,
          status: {
            in: ['PLANNED', 'RELEASED', 'IN_PROGRESS']
          }
        }
      });

      if (activeWorkOrders > 0) {
        throw new AppError('Cannot delete work center with active work orders', 400);
      }

      await prisma.workCenter.delete({
        where: { id }
      });

      logger.info(`Work center deleted: ${id} - ${existingWorkCenter.name}`);
    } catch (error) {
      logger.error('Delete work center service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete work center', 500);
    }
  }

  async getWorkCenterCapacity(id: string) {
    try {
      const workCenter = await prisma.workCenter.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          code: true,
          capacity: true,
          currentWorkload: true,
          _count: {
            select: {
              workOrders: {
                where: {
                  status: {
                    in: ['PLANNED', 'RELEASED', 'IN_PROGRESS']
                  }
                }
              }
            }
          }
        }
      });

      if (!workCenter) {
        throw new AppError('Work center not found', 404);
      }

      // Calculate utilization percentage
      const utilizationPercent = workCenter.capacity > 0 
        ? (workCenter.currentWorkload / workCenter.capacity) * 100 
        : 0;

      return {
        ...workCenter,
        utilizationPercent: Math.round(utilizationPercent * 100) / 100,
        activeWorkOrders: workCenter._count.workOrders,
        availableCapacity: Math.max(0, workCenter.capacity - workCenter.currentWorkload)
      };
    } catch (error) {
      logger.error('Get work center capacity service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch work center capacity', 500);
    }
  }

  async updateWorkCenterCapacity(id: string, data: UpdateCapacityData) {
    try {
      // Check if work center exists
      const existingWorkCenter = await prisma.workCenter.findUnique({
        where: { id }
      });

      if (!existingWorkCenter) {
        throw new AppError('Work center not found', 404);
      }

      // Validate capacity
      if (data.capacity < 0) {
        throw new AppError('Capacity cannot be negative', 400);
      }

      if (data.currentWorkload !== undefined && data.currentWorkload < 0) {
        throw new AppError('Current workload cannot be negative', 400);
      }

      const workCenter = await prisma.workCenter.update({
        where: { id },
        data: {
          capacity: data.capacity,
          currentWorkload: data.currentWorkload !== undefined 
            ? data.currentWorkload 
            : existingWorkCenter.currentWorkload
        },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      logger.info(`Work center capacity updated: ${id} - capacity: ${data.capacity}`);
      return workCenter;
    } catch (error) {
      logger.error('Update work center capacity service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update work center capacity', 500);
    }
  }
}