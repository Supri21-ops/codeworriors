import { Request, Response } from 'express';
import { vectorService } from '../../services/vector.service';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';

export class SearchController {
  async searchManufacturingOrders(req: Request, res: Response) {
    try {
      const { query, filters = {} } = req.body;
      const userId = (req as any).user?.id;

      if (!query) {
        throw new AppError('Search query is required', 400);
      }

      const results = await vectorService.searchManufacturingOrders(query, filters);

      // Log search analytics
      await vectorService.publishVectorSearchEvent('SEARCH_PERFORMED', {
        query,
        resultsCount: results.length,
        userId,
        type: 'manufacturing_orders'
      });

      res.json({
        success: true,
        data: results,
        total: results.length
      });
    } catch (error) {
      logger.error('Search manufacturing orders error:', error);
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
  }

  async searchProducts(req: Request, res: Response) {
    try {
      const { query, filters = {} } = req.body;
      const userId = (req as any).user?.id;

      if (!query) {
        throw new AppError('Search query is required', 400);
      }

      const results = await vectorService.searchProducts(query, filters);

      // Log search analytics
      await vectorService.publishVectorSearchEvent('SEARCH_PERFORMED', {
        query,
        resultsCount: results.length,
        userId,
        type: 'products'
      });

      res.json({
        success: true,
        data: results,
        total: results.length
      });
    } catch (error) {
      logger.error('Search products error:', error);
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
  }

  async getRecommendations(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { type = 'similar_orders' } = req.query;

      const recommendations = await vectorService.getRecommendations(
        orderId, 
        type as 'similar_orders' | 'recommended_products'
      );

      res.json({
        success: true,
        data: recommendations,
        total: recommendations.length
      });
    } catch (error) {
      logger.error('Get recommendations error:', error);
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
  }

  async getSearchAnalytics(req: Request, res: Response) {
    try {
      const { timeRange = 'week' } = req.query;

      const analytics = await vectorService.getCollectionStats('manufacturing-orders');
      const productAnalytics = await vectorService.getCollectionStats('products');

      res.json({
        success: true,
        data: {
          manufacturingOrders: analytics,
          products: productAnalytics,
          timeRange
        }
      });
    } catch (error) {
      logger.error('Get search analytics error:', error);
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
  }
}
