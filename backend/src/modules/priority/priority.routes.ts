import { Router } from 'express';
import { PriorityController } from './priority.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import Joi from 'joi';

const router = Router();
const priorityController = new PriorityController();

// All routes require authentication
router.use(authMiddleware);

// Get priority queue
router.get('/queue', priorityController.getPriorityQueue);

// Get priority analytics
router.get('/analytics', priorityController.getPriorityAnalytics);

// Calculate priority score for specific order
router.get('/calculate/:orderId', priorityController.calculatePriorityScore);

// Change priority (requires manager or admin role)
router.put('/change/:orderId',
  requireRole(['MANAGER', 'ADMIN']),
  validateRequest(Joi.object({
    newPriority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').required(),
    reason: Joi.string().required().min(10).max(500)
  })),
  priorityController.changePriority
);

// Optimize schedule (requires manager or admin role)
router.post('/optimize/:workCenterId',
  requireRole(['MANAGER', 'ADMIN']),
  priorityController.optimizeSchedule
);

export default router;
