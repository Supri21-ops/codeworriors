import { prisma } from '../../config/prisma';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

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

export class BomService {
  async getAllBoms() {
    try {
      const boms = await prisma.bom.findMany({
        include: {
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
        orderBy: {
          createdAt: 'desc'
        }
      });

      return boms;
    } catch (error) {
      logger.error('Get all BOMs service error:', error);
      throw new AppError('Failed to fetch BOMs', 500);
    }
  }

  async getBomById(id: string) {
    try {
      const bom = await prisma.bom.findUnique({
        where: { id },
        include: {
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
            }
          }
        }
      });

      if (!bom) {
        throw new AppError('BOM not found', 404);
      }

      return bom;
    } catch (error) {
      logger.error('Get BOM by ID service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch BOM', 500);
    }
  }

  async createBom(data: CreateBomData) {
    try {
      // Validate that all referenced products exist
      const productIds = data.items.map(item => item.productId);
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds }
        }
      });

      if (products.length !== productIds.length) {
        throw new AppError('One or more referenced products not found', 400);
      }

      const bom = await prisma.bom.create({
        data: {
          name: data.name,
          description: data.description,
          version: data.version || '1.0',
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unit: item.unit || 'pcs'
            }))
          }
        },
        include: {
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
        }
      });

      logger.info(`BOM created: ${bom.id} - ${bom.name}`);
      return bom;
    } catch (error) {
      logger.error('Create BOM service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create BOM', 500);
    }
  }

  async updateBom(id: string, data: UpdateBomData) {
    try {
      // Check if BOM exists
      const existingBom = await prisma.bom.findUnique({
        where: { id }
      });

      if (!existingBom) {
        throw new AppError('BOM not found', 404);
      }

      // If items are being updated, validate products exist
      if (data.items && data.items.length > 0) {
        const productIds = data.items.map(item => item.productId);
        const products = await prisma.product.findMany({
          where: {
            id: { in: productIds }
          }
        });

        if (products.length !== productIds.length) {
          throw new AppError('One or more referenced products not found', 400);
        }
      }

      const updateData: any = {};
      
      if (data.name) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.version) updateData.version = data.version;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      // Update BOM and items in a transaction
      const bom = await prisma.$transaction(async (tx: any) => {
        // Update the BOM
        const updatedBom = await tx.bom.update({
          where: { id },
          data: updateData
        });

        // If items are provided, replace all items
        if (data.items) {
          // Delete existing items
          await tx.bomItem.deleteMany({
            where: { bomId: id }
          });

          // Create new items
          await tx.bomItem.createMany({
            data: data.items.map(item => ({
              bomId: id,
              productId: item.productId,
              quantity: item.quantity,
              unit: item.unit || 'pcs'
            }))
          });
        }

        return updatedBom;
      });

      // Fetch the complete updated BOM with items
      const completeBom = await prisma.bom.findUnique({
        where: { id },
        include: {
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
        }
      });

      logger.info(`BOM updated: ${id} - ${data.name || existingBom.name}`);
      return completeBom;
    } catch (error) {
      logger.error('Update BOM service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update BOM', 500);
    }
  }

  async deleteBom(id: string) {
    try {
      // Check if BOM exists
      const existingBom = await prisma.bom.findUnique({
        where: { id }
      });

      if (!existingBom) {
        throw new AppError('BOM not found', 404);
      }

      // Check if BOM is being used in any manufacturing orders
      // TODO: Add this check when manufacturing order service is created
      
      await prisma.bom.delete({
        where: { id }
      });

      logger.info(`BOM deleted: ${id} - ${existingBom.name}`);
    } catch (error) {
      logger.error('Delete BOM service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete BOM', 500);
    }
  }
}