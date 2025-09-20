import { Request, Response } from 'express';
import { priorityService } from '../../services/priority.service';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';

export class PriorityController {
  async getPriorityQueue(req: Request, res: Response) {
    try {
      const { workCenterId, limit = 50 } = req.query;

      const queue = await priorityService.getPriorityQueue(
        workCenterId as string,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: queue,
        total: queue.length
      });
    } catch (error) {
      logger.error('Get priority queue error:', error);
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

  async optimizeSchedule(req: Request, res: Response) {
    try {
      const { workCenterId } = req.params;

      const optimized = await priorityService.optimizeSchedule(workCenterId);

      res.json({
        success: true,
        data: optimized,
        message: 'Schedule optimized successfully'
      });
    } catch (error) {
      logger.error('Optimize schedule error:', error);
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

  async getPriorityAnalytics(req: Request, res: Response) {
    try {
      const { timeRange = 'week' } = req.query;

      const analytics = await priorityService.getPriorityAnalytics(
        timeRange as 'day' | 'week' | 'month'
      );

      res.json({
        success: true,
        data: analytics,
        timeRange
      });
    } catch (error) {
      logger.error('Get priority analytics error:', error);
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

  async changePriority(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { newPriority, reason } = req.body;
      const userId = (req as any).user?.id;

      if (!newPriority || !reason) {
        throw new AppError('New priority and reason are required', 400);
      }

      await priorityService.handlePriorityChange(orderId, newPriority, reason);

      res.json({
        success: true,
        message: 'Priority changed successfully'
      });
    } catch (error) {
      logger.error('Change priority error:', error);
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

  async calculatePriorityScore(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { type } = req.query;

      if (!type || !['MANUFACTURING_ORDER', 'WORK_ORDER'].includes(type as string)) {
        throw new AppError('Valid type is required (MANUFACTURING_ORDER or WORK_ORDER)', 400);
      }

      const score = await priorityService.calculatePriorityScore(
        orderId,
        type as 'MANUFACTURING_ORDER' | 'WORK_ORDER'
      );

      res.json({
        success: true,
        data: score
      });
    } catch (error) {
      logger.error('Calculate priority score error:', error);
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
