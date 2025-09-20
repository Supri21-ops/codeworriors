import { prisma } from '../../config/prisma';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';
// Import the enum type from Prisma (will be generated after schema compilation)
type StockMovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';

export interface CreateStockItemData {
  productId: string;
  workCenterId?: string;
  quantity: number;
  minQty?: number;
  maxQty?: number;
}

export interface UpdateStockItemData {
  quantity?: number;
  reservedQty?: number;
  minQty?: number;
  maxQty?: number;
}

export interface CreateStockMovementData {
  productId: string;
  workCenterId?: string;
  quantity: number;
  type: StockMovementType;
  reason: string;
  reference?: string;
}

export class StockService {
  async getAllStockItems() {
    try {
      const stockItems = await prisma.stockItem.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true,
              category: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        },
        orderBy: {
          product: {
            name: 'asc'
          }
        }
      });

      return stockItems;
    } catch (error) {
      logger.error('Get all stock items service error:', error);
      throw new AppError('Failed to fetch stock items', 500);
    }
  }

  async getStockItemById(id: string) {
    try {
      const stockItem = await prisma.stockItem.findUnique({
        where: { id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true,
              category: true,
              description: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true
            }
          }
        }
      });

      if (!stockItem) {
        throw new AppError('Stock item not found', 404);
      }

      return stockItem;
    } catch (error) {
      logger.error('Get stock item by ID service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch stock item', 500);
    }
  }

  async createStockItem(data: CreateStockItemData) {
    try {
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: data.productId }
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Check if work center exists (if provided)
      if (data.workCenterId) {
        const workCenter = await prisma.workCenter.findUnique({
          where: { id: data.workCenterId }
        });

        if (!workCenter) {
          throw new AppError('Work center not found', 404);
        }
      }

      // Check if stock item already exists for this product and work center
      const existingStockItem = await prisma.stockItem.findFirst({
        where: {
          productId: data.productId,
          workCenterId: data.workCenterId || null
        }
      });

      if (existingStockItem) {
        throw new AppError('Stock item already exists for this product and work center', 400);
      }

      const stockItem = await prisma.stockItem.create({
        data: {
          productId: data.productId,
          workCenterId: data.workCenterId,
          quantity: data.quantity,
          minQty: data.minQty || 0,
          maxQty: data.maxQty || 0
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true,
              category: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        }
      });

      logger.info(`Stock item created: ${stockItem.id} for product ${product.name}`);
      return stockItem;
    } catch (error) {
      logger.error('Create stock item service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create stock item', 500);
    }
  }

  async updateStockItem(id: string, data: UpdateStockItemData) {
    try {
      // Check if stock item exists
      const existingStockItem = await prisma.stockItem.findUnique({
        where: { id }
      });

      if (!existingStockItem) {
        throw new AppError('Stock item not found', 404);
      }

      const stockItem = await prisma.stockItem.update({
        where: { id },
        data: {
          quantity: data.quantity,
          reservedQty: data.reservedQty,
          minQty: data.minQty,
          maxQty: data.maxQty
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true,
              category: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        }
      });

      logger.info(`Stock item updated: ${id}`);
      return stockItem;
    } catch (error) {
      logger.error('Update stock item service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update stock item', 500);
    }
  }

  async deleteStockItem(id: string) {
    try {
      const existingStockItem = await prisma.stockItem.findUnique({
        where: { id }
      });

      if (!existingStockItem) {
        throw new AppError('Stock item not found', 404);
      }

      await prisma.stockItem.delete({
        where: { id }
      });

      logger.info(`Stock item deleted: ${id}`);
    } catch (error) {
      logger.error('Delete stock item service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete stock item', 500);
    }
  }

  async getStockMovements() {
    try {
      const movements = await prisma.stockMovement.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return movements;
    } catch (error) {
      logger.error('Get stock movements service error:', error);
      throw new AppError('Failed to fetch stock movements', 500);
    }
  }

  async createStockMovement(data: CreateStockMovementData, userId: string) {
    try {
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: data.productId }
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Check if work center exists (if provided)
      if (data.workCenterId) {
        const workCenter = await prisma.workCenter.findUnique({
          where: { id: data.workCenterId }
        });

        if (!workCenter) {
          throw new AppError('Work center not found', 404);
        }
      }

      // Create movement and update stock in a transaction
      const result = await prisma.$transaction(async (tx: any) => {
        // Create the movement record
        const movement = await tx.stockMovement.create({
          data: {
            productId: data.productId,
            workCenterId: data.workCenterId,
            quantity: data.quantity,
            type: data.type,
            reason: data.reason,
            reference: data.reference,
            userId: userId
          }
        });

        // Find or create stock item
        let stockItem = await tx.stockItem.findFirst({
          where: {
            productId: data.productId,
            workCenterId: data.workCenterId || null
          }
        });

        if (!stockItem) {
          stockItem = await tx.stockItem.create({
            data: {
              productId: data.productId,
              workCenterId: data.workCenterId,
              quantity: 0,
              reservedQty: 0,
              minQty: 0,
              maxQty: 0
            }
          });
        }

        // Update stock quantity based on movement type
        let newQuantity = stockItem.quantity;
        
        if (data.type === 'IN') {
          newQuantity += data.quantity;
        } else if (data.type === 'OUT') {
          newQuantity -= data.quantity;
          if (newQuantity < 0) {
            throw new AppError('Insufficient stock for this movement', 400);
          }
        } else if (data.type === 'ADJUSTMENT') {
          newQuantity = data.quantity; // For adjustments, set to absolute value
        }

        // Update stock item
        await tx.stockItem.update({
          where: { id: stockItem.id },
          data: { quantity: newQuantity }
        });

        return movement;
      });

      // Fetch complete movement with relations
      const completeMovement = await prisma.stockMovement.findUnique({
        where: { id: result.id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      logger.info(`Stock movement created: ${result.id} - ${data.type} ${data.quantity} of ${product.name}`);
      return completeMovement;
    } catch (error) {
      logger.error('Create stock movement service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create stock movement', 500);
    }
  }

  async getStockSummary() {
    try {
      const totalProducts = await prisma.product.count();
      const totalStockItems = await prisma.stockItem.count();
      
      const lowStockCount = await prisma.stockItem.count({
        where: {
          quantity: {
            lte: prisma.stockItem.fields.minQty
          },
          minQty: {
            gt: 0
          }
        }
      });

      const outOfStockCount = await prisma.stockItem.count({
        where: {
          quantity: {
            lte: 0
          }
        }
      });

      const totalValue = await prisma.stockItem.aggregate({
        _sum: {
          quantity: true
        }
      });

      return {
        totalProducts,
        totalStockItems,
        lowStockCount,
        outOfStockCount,
        totalQuantity: totalValue._sum.quantity || 0
      };
    } catch (error) {
      logger.error('Get stock summary service error:', error);
      throw new AppError('Failed to fetch stock summary', 500);
    }
  }

  async getLowStockItems() {
    try {
      const lowStockItems = await prisma.stockItem.findMany({
        where: {
          quantity: {
            lte: prisma.stockItem.fields.minQty
          },
          minQty: {
            gt: 0
          }
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true,
              category: true
            }
          },
          workCenter: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        },
        orderBy: [
          {
            quantity: 'asc'
          },
          {
            product: {
              name: 'asc'
            }
          }
        ]
      });

      return lowStockItems;
    } catch (error) {
      logger.error('Get low stock items service error:', error);
      throw new AppError('Failed to fetch low stock items', 500);
    }
  }
}