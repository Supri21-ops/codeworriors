"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderController = void 0;
const workorder_service_1 = require("./workorder.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
class WorkOrderController {
    constructor() {
        this.getWorkOrders = async (req, res) => {
            try {
                const { status, workCenterId, assignedUserId } = req.query;
                const filters = {
                    status: status,
                    workCenterId: workCenterId,
                    assignedUserId: assignedUserId
                };
                const workOrders = await this.workOrderService.getAllWorkOrders(filters);
                res.json({
                    success: true,
                    data: workOrders
                });
            }
            catch (error) {
                logger_1.logger.error('Get work orders controller error:', error);
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
        this.getWorkOrderById = async (req, res) => {
            try {
                const { id } = req.params;
                const workOrder = await this.workOrderService.getWorkOrderById(id);
                res.json({
                    success: true,
                    data: workOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Get work order by ID controller error:', error);
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
        this.createWorkOrder = async (req, res) => {
            try {
                const workOrderData = req.body;
                const workOrder = await this.workOrderService.createWorkOrder(workOrderData);
                res.status(201).json({
                    success: true,
                    message: 'Work order created successfully',
                    data: workOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Create work order controller error:', error);
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
        this.updateWorkOrder = async (req, res) => {
            try {
                const { id } = req.params;
                const workOrderData = req.body;
                const workOrder = await this.workOrderService.updateWorkOrder(id, workOrderData);
                res.json({
                    success: true,
                    message: 'Work order updated successfully',
                    data: workOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Update work order controller error:', error);
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
        this.deleteWorkOrder = async (req, res) => {
            try {
                const { id } = req.params;
                await this.workOrderService.deleteWorkOrder(id);
                res.json({
                    success: true,
                    message: 'Work order deleted successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Delete work order controller error:', error);
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
        this.startWorkOrder = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const workOrder = await this.workOrderService.startWorkOrder(id, userId);
                res.json({
                    success: true,
                    message: 'Work order started successfully',
                    data: workOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Start work order controller error:', error);
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
        this.pauseWorkOrder = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const workOrder = await this.workOrderService.pauseWorkOrder(id, userId);
                res.json({
                    success: true,
                    message: 'Work order paused successfully',
                    data: workOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Pause work order controller error:', error);
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
        this.completeWorkOrder = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const workOrder = await this.workOrderService.completeWorkOrder(id, userId);
                res.json({
                    success: true,
                    message: 'Work order completed successfully',
                    data: workOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Complete work order controller error:', error);
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
        this.cancelWorkOrder = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id;
                const { reason } = req.body;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const workOrder = await this.workOrderService.cancelWorkOrder(id, userId, reason);
                res.json({
                    success: true,
                    message: 'Work order cancelled successfully',
                    data: workOrder
                });
            }
            catch (error) {
                logger_1.logger.error('Cancel work order controller error:', error);
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
        this.workOrderService = new workorder_service_1.WorkOrderService();
    }
}
exports.WorkOrderController = WorkOrderController;
//# sourceMappingURL=workorder.controller.js.map