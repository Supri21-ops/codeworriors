"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkCenterController = void 0;
const workcenter_service_1 = require("./workcenter.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
class WorkCenterController {
    constructor() {
        this.getWorkCenters = async (req, res) => {
            try {
                const workCenters = await this.workCenterService.getAllWorkCenters();
                res.json({
                    success: true,
                    data: workCenters
                });
            }
            catch (error) {
                logger_1.logger.error('Get work centers controller error:', error);
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
        this.getWorkCenterById = async (req, res) => {
            try {
                const { id } = req.params;
                const workCenter = await this.workCenterService.getWorkCenterById(id);
                res.json({
                    success: true,
                    data: workCenter
                });
            }
            catch (error) {
                logger_1.logger.error('Get work center by ID controller error:', error);
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
        this.createWorkCenter = async (req, res) => {
            try {
                const workCenterData = req.body;
                const workCenter = await this.workCenterService.createWorkCenter(workCenterData);
                res.status(201).json({
                    success: true,
                    message: 'Work center created successfully',
                    data: workCenter
                });
            }
            catch (error) {
                logger_1.logger.error('Create work center controller error:', error);
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
        this.updateWorkCenter = async (req, res) => {
            try {
                const { id } = req.params;
                const workCenterData = req.body;
                const workCenter = await this.workCenterService.updateWorkCenter(id, workCenterData);
                res.json({
                    success: true,
                    message: 'Work center updated successfully',
                    data: workCenter
                });
            }
            catch (error) {
                logger_1.logger.error('Update work center controller error:', error);
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
        this.deleteWorkCenter = async (req, res) => {
            try {
                const { id } = req.params;
                await this.workCenterService.deleteWorkCenter(id);
                res.json({
                    success: true,
                    message: 'Work center deleted successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Delete work center controller error:', error);
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
        this.getWorkCenterCapacity = async (req, res) => {
            try {
                const { id } = req.params;
                const capacity = await this.workCenterService.getWorkCenterCapacity(id);
                res.json({
                    success: true,
                    data: capacity
                });
            }
            catch (error) {
                logger_1.logger.error('Get work center capacity controller error:', error);
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
        this.updateWorkCenterCapacity = async (req, res) => {
            try {
                const { id } = req.params;
                const capacityData = req.body;
                const workCenter = await this.workCenterService.updateWorkCenterCapacity(id, capacityData);
                res.json({
                    success: true,
                    message: 'Work center capacity updated successfully',
                    data: workCenter
                });
            }
            catch (error) {
                logger_1.logger.error('Update work center capacity controller error:', error);
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
        this.workCenterService = new workcenter_service_1.WorkCenterService();
    }
}
exports.WorkCenterController = WorkCenterController;
//# sourceMappingURL=workcenter.controller.js.map