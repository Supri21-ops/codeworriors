"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturingOrderController = void 0;
const mo_service_1 = require("./mo.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
const pagination_1 = require("../../libs/pagination");
class ManufacturingOrderController {
    constructor() {
        this.createManufacturingOrder = async (req, res) => {
            try {
                const data = req.body;
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const manufacturingOrder = await this.manufacturingOrderService.createManufacturingOrder(data, userId);
                res.status(201).json({
                    success: true,
                    message: 'Manufacturing order created successfully',
                    data: manufacturingOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Create manufacturing order controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.getManufacturingOrders = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    status: req.query.status,
                    priority: req.query.priority,
                    productId: req.query.productId
                };
                const pagination = pagination_1.PaginationHelper.validatePagination(page, limit);
                const result = await this.manufacturingOrderService.getManufacturingOrders(pagination.page, pagination.limit, filters);
                res.json({
                    success: true,
                    data: result.orders,
                    pagination: result.pagination
                });
            }
            catch (error) {
                logger_1.logger.error('Get manufacturing orders controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.getManufacturingOrderById = async (req, res) => {
            try {
                const { id } = req.params;
                const manufacturingOrder = await this.manufacturingOrderService.getManufacturingOrderById(id);
                res.json({
                    success: true,
                    data: manufacturingOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Get manufacturing order by ID controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.updateManufacturingOrder = async (req, res) => {
            try {
                const { id } = req.params;
                const data = req.body;
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const manufacturingOrder = await this.manufacturingOrderService.updateManufacturingOrder(id, data, userId);
                res.json({
                    success: true,
                    message: 'Manufacturing order updated successfully',
                    data: manufacturingOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Update manufacturing order controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.deleteManufacturingOrder = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const result = await this.manufacturingOrderService.deleteManufacturingOrder(id, userId);
                res.json({
                    success: true,
                    message: result.message
                });
            }
            catch (error) {
                logger_1.logger.error('Delete manufacturing order controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.getManufacturingOrderStats = async (req, res) => {
            try {
                const stats = await this.manufacturingOrderService.getManufacturingOrderStats();
                res.json({
                    success: true,
                    data: stats
                });
            }
            catch (error) {
                logger_1.logger.error('Get manufacturing order stats controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.manufacturingOrderService = new mo_service_1.ManufacturingOrderService();
    }
}
exports.ManufacturingOrderController = ManufacturingOrderController;
//# sourceMappingURL=mo.controller.js.map