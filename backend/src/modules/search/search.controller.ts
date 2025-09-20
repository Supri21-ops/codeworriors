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
        return res.status(400).json({ success: false, message: 'Search query is required' });
      }
      const results = await vectorService.searchManufacturingOrders(query, filters);
      res.json({ success: true, data: results, total: results.length });
    } catch (error) {
      logger.error('Search manufacturing orders error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async searchWorkOrders(req: Request, res: Response) {
    try {
      const { query, filters = {} } = req.body;
      const userId = (req as any).user?.id;
      if (!query) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
      }
  // No searchWorkOrders in vectorService, fallback to manufacturingOrders or products
  const results = await vectorService.searchManufacturingOrders(query, { ...filters, type: 'work_order' });
      res.json({ success: true, data: results, total: results.length });
    } catch (error) {
      logger.error('Search work orders error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getRecommendations(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
  const type = req.query.type === 'recommended_products' ? 'recommended_products' : 'similar_orders';
  const recommendations = await vectorService.getRecommendations(orderId, type);
      res.json({ success: true, data: recommendations });
    } catch (error) {
      logger.error('Get recommendations error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getSearchAnalytics(req: Request, res: Response) {
    try {
  const analytics = await vectorService.getCollectionStats('manufacturing-orders');
  const productAnalytics = await vectorService.getCollectionStats('products');
  res.json({ success: true, manufacturingOrders: analytics, products: productAnalytics });
    } catch (error) {
      logger.error('Get search analytics error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export const searchController = new SearchController();
// End of file
