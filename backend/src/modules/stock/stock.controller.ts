import { Request, Response } from 'express';
import { StockService } from './stock.service';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  // Get all stock items
  getStockItems = async (req: Request, res: Response) => {
    try {
      const stockItems = await this.stockService.getAllStockItems();
      
      res.json({
        success: true,
        data: stockItems
      });
    } catch (error) {
      logger.error('Get stock items controller error:', error);
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

  // Get stock item by ID
  getStockItemById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stockItem = await this.stockService.getStockItemById(id);
      
      res.json({
        success: true,
        data: stockItem
      });
    } catch (error) {
      logger.error('Get stock item by ID controller error:', error);
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

  // Create stock item
  createStockItem = async (req: Request, res: Response) => {
    try {
      const stockData = req.body;
      const stockItem = await this.stockService.createStockItem(stockData);
      
      res.status(201).json({
        success: true,
        message: 'Stock item created successfully',
        data: stockItem
      });
    } catch (error) {
      logger.error('Create stock item controller error:', error);
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

  // Update stock item
  updateStockItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stockData = req.body;
      const stockItem = await this.stockService.updateStockItem(id, stockData);
      
      res.json({
        success: true,
        message: 'Stock item updated successfully',
        data: stockItem
      });
    } catch (error) {
      logger.error('Update stock item controller error:', error);
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

  // Delete stock item
  deleteStockItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.stockService.deleteStockItem(id);
      
      res.json({
        success: true,
        message: 'Stock item deleted successfully'
      });
    } catch (error) {
      logger.error('Delete stock item controller error:', error);
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

  // Get stock movements
  getStockMovements = async (req: Request, res: Response) => {
    try {
      const movements = await this.stockService.getStockMovements();
      
      res.json({
        success: true,
        data: movements
      });
    } catch (error) {
      logger.error('Get stock movements controller error:', error);
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

  // Create stock movement
  createStockMovement = async (req: Request, res: Response) => {
    try {
      const movementData = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const movement = await this.stockService.createStockMovement(movementData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Stock movement created successfully',
        data: movement
      });
    } catch (error) {
      logger.error('Create stock movement controller error:', error);
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

  // Get stock summary
  getStockSummary = async (req: Request, res: Response) => {
    try {
      const summary = await this.stockService.getStockSummary();
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      logger.error('Get stock summary controller error:', error);
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

  // Get low stock items
  getLowStockItems = async (req: Request, res: Response) => {
    try {
      const lowStockItems = await this.stockService.getLowStockItems();
      
      res.json({
        success: true,
        data: lowStockItems
      });
    } catch (error) {
      logger.error('Get low stock items controller error:', error);
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