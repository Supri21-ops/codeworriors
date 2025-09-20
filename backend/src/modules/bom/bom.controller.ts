import { Request, Response } from 'express';
import { BomService } from './bom.service';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export class BomController {
  private bomService: BomService;

  constructor() {
    this.bomService = new BomService();
  }

  // Get all BOMs
  getBoms = async (req: Request, res: Response) => {
    try {
      const boms = await this.bomService.getAllBoms();
      
      res.json({
        success: true,
        data: boms
      });
    } catch (error) {
      logger.error('Get BOMs controller error:', error);
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

  // Get BOM by ID
  getBomById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const bom = await this.bomService.getBomById(id);
      
      res.json({
        success: true,
        data: bom
      });
    } catch (error) {
      logger.error('Get BOM by ID controller error:', error);
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

  // Create BOM
  createBom = async (req: Request, res: Response) => {
    try {
      const bomData = req.body;
      const bom = await this.bomService.createBom(bomData);
      
      res.status(201).json({
        success: true,
        message: 'BOM created successfully',
        data: bom
      });
    } catch (error) {
      logger.error('Create BOM controller error:', error);
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

  // Update BOM
  updateBom = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const bomData = req.body;
      const bom = await this.bomService.updateBom(id, bomData);
      
      res.json({
        success: true,
        message: 'BOM updated successfully',
        data: bom
      });
    } catch (error) {
      logger.error('Update BOM controller error:', error);
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

  // Delete BOM
  deleteBom = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.bomService.deleteBom(id);
      
      res.json({
        success: true,
        message: 'BOM deleted successfully'
      });
    } catch (error) {
      logger.error('Delete BOM controller error:', error);
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