import { Request, Response } from 'express';
import { WorkCenterService } from './workcenter.service';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export class WorkCenterController {
  private workCenterService: WorkCenterService;

  constructor() {
    this.workCenterService = new WorkCenterService();
  }

  // Get all work centers
  getWorkCenters = async (req: Request, res: Response) => {
    try {
      const workCenters = await this.workCenterService.getAllWorkCenters();
      
      res.json({
        success: true,
        data: workCenters
      });
    } catch (error) {
      logger.error('Get work centers controller error:', error);
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

  // Get work center by ID
  getWorkCenterById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workCenter = await this.workCenterService.getWorkCenterById(id);
      
      res.json({
        success: true,
        data: workCenter
      });
    } catch (error) {
      logger.error('Get work center by ID controller error:', error);
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

  // Create work center
  createWorkCenter = async (req: Request, res: Response) => {
    try {
      const workCenterData = req.body;
      const workCenter = await this.workCenterService.createWorkCenter(workCenterData);
      
      res.status(201).json({
        success: true,
        message: 'Work center created successfully',
        data: workCenter
      });
    } catch (error) {
      logger.error('Create work center controller error:', error);
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

  // Update work center
  updateWorkCenter = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workCenterData = req.body;
      const workCenter = await this.workCenterService.updateWorkCenter(id, workCenterData);
      
      res.json({
        success: true,
        message: 'Work center updated successfully',
        data: workCenter
      });
    } catch (error) {
      logger.error('Update work center controller error:', error);
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

  // Delete work center
  deleteWorkCenter = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.workCenterService.deleteWorkCenter(id);
      
      res.json({
        success: true,
        message: 'Work center deleted successfully'
      });
    } catch (error) {
      logger.error('Delete work center controller error:', error);
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

  // Get work center capacity
  getWorkCenterCapacity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const capacity = await this.workCenterService.getWorkCenterCapacity(id);
      
      res.json({
        success: true,
        data: capacity
      });
    } catch (error) {
      logger.error('Get work center capacity controller error:', error);
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

  // Update work center capacity
  updateWorkCenterCapacity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const capacityData = req.body;
      const workCenter = await this.workCenterService.updateWorkCenterCapacity(id, capacityData);
      
      res.json({
        success: true,
        message: 'Work center capacity updated successfully',
        data: workCenter
      });
    } catch (error) {
      logger.error('Update work center capacity controller error:', error);
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