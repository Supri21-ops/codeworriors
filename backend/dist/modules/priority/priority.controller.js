"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityController = void 0;
const priority_service_1 = require("../../services/priority.service");
const logger_1 = require("../../config/logger");
const errors_1 = require("../../libs/errors");
class PriorityController {
    async getPriorityQueue(req, res) {
        try {
            const { workCenterId, limit = 50 } = req.query;
            const queue = await priority_service_1.priorityService.getPriorityQueue(workCenterId, parseInt(limit));
            res.json({
                success: true,
                data: queue,
                total: queue.length
            });
        }
        catch (error) {
            logger_1.logger.error('Get priority queue error:', error);
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
    }
    async optimizeSchedule(req, res) {
        try {
            const { workCenterId } = req.params;
            const optimized = await priority_service_1.priorityService.optimizeSchedule(workCenterId);
            res.json({
                success: true,
                data: optimized,
                message: 'Schedule optimized successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Optimize schedule error:', error);
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
    }
    async getPriorityAnalytics(req, res) {
        try {
            const { timeRange = 'week' } = req.query;
            const analytics = await priority_service_1.priorityService.getPriorityAnalytics(timeRange);
            res.json({
                success: true,
                data: analytics,
                timeRange
            });
        }
        catch (error) {
            logger_1.logger.error('Get priority analytics error:', error);
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
    }
    async changePriority(req, res) {
        try {
            const { orderId } = req.params;
            const { newPriority, reason } = req.body;
            const userId = req.user?.id;
            if (!newPriority || !reason) {
                throw new errors_1.AppError('New priority and reason are required', 400);
            }
            await priority_service_1.priorityService.handlePriorityChange(orderId, newPriority, reason);
            res.json({
                success: true,
                message: 'Priority changed successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Change priority error:', error);
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
    }
    async calculatePriorityScore(req, res) {
        try {
            const { orderId } = req.params;
            const { type } = req.query;
            if (!type || !['MANUFACTURING_ORDER', 'WORK_ORDER'].includes(type)) {
                throw new errors_1.AppError('Valid type is required (MANUFACTURING_ORDER or WORK_ORDER)', 400);
            }
            const score = await priority_service_1.priorityService.calculatePriorityScore(orderId, type);
            res.json({
                success: true,
                data: score
            });
        }
        catch (error) {
            logger_1.logger.error('Calculate priority score error:', error);
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
    }
}
exports.PriorityController = PriorityController;
//# sourceMappingURL=priority.controller.js.map