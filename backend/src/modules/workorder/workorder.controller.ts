import { Request, Response } from 'express';
import { WorkOrderService } from './workorder.service';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export class WorkOrderController {
  private workOrderService: WorkOrderService;

  constructor() {
    this.workOrderService = new WorkOrderService();
  }

  // Get all work orders
  getWorkOrders = async (req: Request, res: Response) => {
    try {
      const { status, workCenterId, assignedUserId } = req.query;
      
      const filters = {
        status: status as string,
        workCenterId: workCenterId as string,
        assignedUserId: assignedUserId as string
      };

      const workOrders = await this.workOrderService.getAllWorkOrders(filters);
      
      res.json({
        success: true,
        data: workOrders
      });
    } catch (error) {
      logger.error('Get work orders controller error:', error);
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

  // Get work order by ID
  getWorkOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workOrder = await this.workOrderService.getWorkOrderById(id);
      
      res.json({
        success: true,
        data: workOrder
      });
    } catch (error) {
      logger.error('Get work order by ID controller error:', error);
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

  // Create work order
  createWorkOrder = async (req: Request, res: Response) => {
    try {
      const workOrderData = req.body;
      const workOrder = await this.workOrderService.createWorkOrder(workOrderData);
      
      res.status(201).json({
        success: true,
        message: 'Work order created successfully',
        data: workOrder
      });
    } catch (error) {
      logger.error('Create work order controller error:', error);
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

  // Update work order
  updateWorkOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workOrderData = req.body;
      const workOrder = await this.workOrderService.updateWorkOrder(id, workOrderData);
      
      res.json({
        success: true,
        message: 'Work order updated successfully',
        data: workOrder
      });
    } catch (error) {
      logger.error('Update work order controller error:', error);
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

  // Delete work order
  deleteWorkOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.workOrderService.deleteWorkOrder(id);
      
      res.json({
        success: true,
        message: 'Work order deleted successfully'
      });
    } catch (error) {
      logger.error('Delete work order controller error:', error);
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

  // Start work order
  startWorkOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const workOrder = await this.workOrderService.startWorkOrder(id, userId);
      
      res.json({
        success: true,
        message: 'Work order started successfully',
        data: workOrder
      });
    } catch (error) {
      logger.error('Start work order controller error:', error);
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

  // Pause work order
  pauseWorkOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const workOrder = await this.workOrderService.pauseWorkOrder(id, userId);
      
      res.json({
        success: true,
        message: 'Work order paused successfully',
        data: workOrder
      });
    } catch (error) {
      logger.error('Pause work order controller error:', error);
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

  // Complete work order
  completeWorkOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const workOrder = await this.workOrderService.completeWorkOrder(id, userId);
      
      res.json({
        success: true,
        message: 'Work order completed successfully',
        data: workOrder
      });
    } catch (error) {
      logger.error('Complete work order controller error:', error);
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

  // Cancel work order
  cancelWorkOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const { reason } = req.body;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const workOrder = await this.workOrderService.cancelWorkOrder(id, userId, reason);
      
      res.json({
        success: true,
        message: 'Work order cancelled successfully',
        data: workOrder
      });
    } catch (error) {
      logger.error('Cancel work order controller error:', error);
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