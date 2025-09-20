import { Request, Response } from 'express';
import { ManufacturingOrderService } from './mo.service';
import { CreateManufacturingOrderDto, UpdateManufacturingOrderDto } from './dto';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';
import { PaginationHelper } from '../../libs/pagination';

export class ManufacturingOrderController {
  private manufacturingOrderService: ManufacturingOrderService;

  constructor() {
    this.manufacturingOrderService = new ManufacturingOrderService();
  }

  createManufacturingOrder = async (req: Request, res: Response) => {
    try {
      const data: CreateManufacturingOrderDto = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const manufacturingOrder = await this.manufacturingOrderService.createManufacturingOrder(data, userId);

      res.status(201).json({
        success: true,
        message: 'Manufacturing order created successfully',
        data: manufacturingOrder
      });
    } catch (error) {
      logger.error('Create manufacturing order controller error:', error);
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

  getManufacturingOrders = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        productId: req.query.productId as string
      };

      const pagination = PaginationHelper.validatePagination(page, limit);
      const result = await this.manufacturingOrderService.getManufacturingOrders(
        pagination.page,
        pagination.limit,
        filters
      );

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get manufacturing orders controller error:', error);
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

  getManufacturingOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const manufacturingOrder = await this.manufacturingOrderService.getManufacturingOrderById(id);

      res.json({
        success: true,
        data: manufacturingOrder
      });
    } catch (error) {
      logger.error('Get manufacturing order by ID controller error:', error);
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

  updateManufacturingOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data: UpdateManufacturingOrderDto = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const manufacturingOrder = await this.manufacturingOrderService.updateManufacturingOrder(id, data, userId);

      res.json({
        success: true,
        message: 'Manufacturing order updated successfully',
        data: manufacturingOrder
      });
    } catch (error) {
      logger.error('Update manufacturing order controller error:', error);
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

  deleteManufacturingOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const result = await this.manufacturingOrderService.deleteManufacturingOrder(id, userId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Delete manufacturing order controller error:', error);
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

  getManufacturingOrderStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.manufacturingOrderService.getManufacturingOrderStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Get manufacturing order stats controller error:', error);
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