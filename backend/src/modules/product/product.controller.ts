import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Get all products
  getProducts = async (req: Request, res: Response) => {
    try {
      const { category, isActive } = req.query;
      
      const filters = {
        category: category as string,
        isActive: isActive ? isActive === 'true' : undefined
      };

      const products = await this.productService.getAllProducts(filters);
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Get products controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  // Get product by ID
  getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Get product by ID controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  // Create product
  createProduct = async (req: Request, res: Response) => {
    try {
      const productData = req.body;
      const product = await this.productService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      logger.error('Create product controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  // Update product
  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await this.productService.updateProduct(id, productData);
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      logger.error('Update product controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  // Delete product
  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);
      
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      logger.error('Delete product controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };
}