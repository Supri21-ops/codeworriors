import { Router } from 'express';
import { SearchController } from './search.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import Joi from 'joi';

const router = Router();
const searchController = new SearchController();

// All routes require authentication
router.use(authMiddleware);

// Search manufacturing orders
router.post('/manufacturing-orders', 
  validateRequest(Joi.object({
    query: Joi.string().required().min(1).max(500),
    filters: Joi.object().optional()
  })),
  searchController.searchManufacturingOrders
);

// Search products
router.post('/products',
  validateRequest(Joi.object({
    query: Joi.string().required().min(1).max(500),
    filters: Joi.object().optional()
  })),
  searchController.searchProducts
);

// Get recommendations
router.get('/recommendations/:orderId', searchController.getRecommendations);

// Get search analytics
router.get('/analytics', searchController.getSearchAnalytics);

export default router;
