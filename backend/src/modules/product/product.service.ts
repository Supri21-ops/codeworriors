import { prisma } from '../../config/prisma';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  category: string;
  unit?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  sku?: string;
  category?: string;
  unit?: string;
  isActive?: boolean;
}

export interface ProductFilters {
  category?: string;
  isActive?: boolean;
}

export class ProductService {
  async getAllProducts(filters: ProductFilters = {}) {
    try {
      const where: any = {};

      if (filters.category) {
        where.category = filters.category;
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          _count: {
            select: {
              bomItems: true,
              stockItems: true,
              stockMovements: true,
              workOrderItems: true,
              manufacturingOrders: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return products;
    } catch (error) {
      logger.error('Get all products service error:', error);
      throw new AppError('Failed to fetch products', 500);
    }
  }

  async getProductById(id: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          bomItems: {
            include: {
              bom: {
                select: {
                  id: true,
                  name: true,
                  version: true
                }
              }
            }
          },
          stockItems: {
            include: {
              workCenter: {
                select: {
                  id: true,
                  name: true,
                  code: true
                }
              }
            }
          },
          stockMovements: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
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
              createdAt: 'desc'
            },
            take: 10 // Limit to recent movements
          },
          _count: {
            select: {
              bomItems: true,
              stockItems: true,
              stockMovements: true,
              workOrderItems: true,
              manufacturingOrders: true
            }
          }
        }
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      return product;
    } catch (error) {
      logger.error('Get product by ID service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch product', 500);
    }
  }

  async createProduct(data: CreateProductData) {
    try {
      // Check if SKU is unique
      const existingProduct = await prisma.product.findUnique({
        where: { sku: data.sku }
      });

      if (existingProduct) {
        throw new AppError('Product with this SKU already exists', 400);
      }

      const product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          sku: data.sku,
          category: data.category,
          unit: data.unit || 'pcs'
        }
      });

      logger.info(`Product created: ${product.id} - ${product.name} (${product.sku})`);
      return product;
    } catch (error) {
      logger.error('Create product service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create product', 500);
    }
  }

  async updateProduct(id: string, data: UpdateProductData) {
    try {
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        throw new AppError('Product not found', 404);
      }

      // Check SKU uniqueness if updating
      if (data.sku && data.sku !== existingProduct.sku) {
        const skuExists = await prisma.product.findFirst({
          where: {
            sku: data.sku,
            id: { not: id }
          }
        });

        if (skuExists) {
          throw new AppError('Product with this SKU already exists', 400);
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          sku: data.sku,
          category: data.category,
          unit: data.unit,
          isActive: data.isActive
        }
      });

      logger.info(`Product updated: ${id} - ${data.name || existingProduct.name}`);
      return product;
    } catch (error) {
      logger.error('Update product service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update product', 500);
    }
  }

  async deleteProduct(id: string) {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        throw new AppError('Product not found', 404);
      }

      // Check if product is being used in BOMs
      const bomUsage = await prisma.bomItem.count({
        where: { productId: id }
      });

      if (bomUsage > 0) {
        throw new AppError('Cannot delete product that is used in Bills of Materials', 400);
      }

      // Check if product has stock movements
      const stockMovements = await prisma.stockMovement.count({
        where: { productId: id }
      });

      if (stockMovements > 0) {
        throw new AppError('Cannot delete product that has stock movements', 400);
      }

      // Check if product has active manufacturing orders
      const activeOrders = await prisma.manufacturingOrder.count({
        where: {
          productId: id,
          status: {
            in: ['PLANNED', 'RELEASED', 'IN_PROGRESS']
          }
        }
      });

      if (activeOrders > 0) {
        throw new AppError('Cannot delete product that has active manufacturing orders', 400);
      }

      await prisma.product.delete({
        where: { id }
      });

      logger.info(`Product deleted: ${id} - ${existingProduct.name}`);
    } catch (error) {
      logger.error('Delete product service error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete product', 500);
    }
  }
}