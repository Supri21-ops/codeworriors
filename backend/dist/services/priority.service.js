"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priorityService = exports.PriorityService = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
const pool = new pg_1.Pool({ connectionString: env_1.config.DATABASE_URL });
const logger_1 = require("../config/logger");
const kafka_1 = require("../config/kafka");
const errors_1 = require("../libs/errors");
class PriorityService {
    constructor() {
        this.URGENCY_WEIGHTS = {
            URGENT: 4.0,
            HIGH: 3.0,
            NORMAL: 2.0,
            LOW: 1.0
        };
        this.CUSTOMER_TIER_WEIGHTS = {
            PLATINUM: 1.5,
            GOLD: 1.3,
            SILVER: 1.1,
            BRONZE: 1.0
        };
    }
    async calculatePriorityScore(orderId, type) {
        try {
            let order;
            if (type === 'MANUFACTURING_ORDER') {
                const { rows } = await pool.query(`SELECT mo.*, p.*, u.*
           FROM manufacturing_orders mo
           JOIN products p ON mo.productId = p.id
           JOIN users u ON mo.createdById = u.id
           WHERE mo.id = $1`, [orderId]);
                order = rows[0];
            }
            else {
                const { rows } = await pool.query(`SELECT wo.*, mo.*, p.*, wc.*
           FROM work_orders wo
           JOIN manufacturing_orders mo ON wo.manufacturingOrderId = mo.id
           JOIN products p ON mo.productId = p.id
           JOIN work_centers wc ON wo.workCenterId = wc.id
           WHERE wo.id = $1`, [orderId]);
                order = rows[0];
            }
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
            }
            const baseScore = this.URGENCY_WEIGHTS[order.priority] || 2.0;
            const urgencyMultiplier = this.calculateUrgencyMultiplier(order);
            const deadlineFactor = this.calculateDeadlineFactor(order.dueDate);
            const resourceAvailability = await this.calculateResourceAvailability(order);
            const customerTier = this.CUSTOMER_TIER_WEIGHTS[order.customerTier] || 1.0;
            const totalScore = baseScore * urgencyMultiplier * deadlineFactor * resourceAvailability * customerTier;
            const priorityScore = {
                baseScore,
                urgencyMultiplier,
                deadlineFactor,
                resourceAvailability,
                customerTier,
                totalScore
            };
            await this.updatePriorityScore(orderId, type, totalScore);
            await kafka_1.kafkaService.publishPriorityEvent('PRIORITY_UPDATED', {
                orderId,
                type,
                priorityScore,
                timestamp: new Date().toISOString()
            });
            return priorityScore;
        }
        catch (error) {
            logger_1.logger.error('Error calculating priority score:', error);
            throw error;
        }
    }
    calculateUrgencyMultiplier(order) {
        const now = new Date();
        const dueDate = new Date(order.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue < 0)
            return 3.0;
        if (daysUntilDue === 0)
            return 2.5;
        if (daysUntilDue <= 1)
            return 2.0;
        if (daysUntilDue <= 3)
            return 1.5;
        if (daysUntilDue <= 7)
            return 1.2;
        return 1.0;
    }
    calculateDeadlineFactor(dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilDue < 0)
            return 3.0;
        if (hoursUntilDue <= 24)
            return 2.5;
        if (hoursUntilDue <= 72)
            return 2.0;
        if (hoursUntilDue <= 168)
            return 1.5;
        return 1.0;
    }
    async calculateResourceAvailability(order) {
        try {
            const { rows: wcRows } = await pool.query(`SELECT * FROM work_centers WHERE "isActive" = true`);
            const workCenters = wcRows;
            const totalCapacity = workCenters.reduce((sum, wc) => sum + wc.capacity, 0);
            const { rows: workloadRows } = await pool.query(`SELECT COUNT(*) as count FROM work_orders WHERE status = 'IN_PROGRESS' AND workCenterId = ANY($1::uuid[])`, [workCenters.map(wc => wc.id)]);
            const currentWorkload = parseInt(workloadRows[0]?.count || '0', 10);
            const availabilityRatio = Math.max(0.1, (totalCapacity - currentWorkload) / totalCapacity);
            return 0.5 + (availabilityRatio * 1.5);
        }
        catch (error) {
            logger_1.logger.error('Error calculating resource availability:', error);
            return 1.0;
        }
    }
    async updatePriorityScore(orderId, type, score) {
        try {
            if (type === 'MANUFACTURING_ORDER') {
                await pool.query(`UPDATE manufacturing_orders SET "priorityScore" = $1, "updatedAt" = NOW() WHERE id = $2`, [score, orderId]);
            }
            else {
                await pool.query(`UPDATE work_orders SET "priorityScore" = $1, "updatedAt" = NOW() WHERE id = $2`, [score, orderId]);
            }
        }
        catch (error) {
            logger_1.logger.error('Error updating priority score:', error);
            throw error;
        }
    }
    async getPriorityQueue(workCenterId, limit = 50) {
        try {
            let whereClause = {
                status: { in: ['PLANNED', 'RELEASED'] }
            };
            if (workCenterId) {
                whereClause.workCenterId = workCenterId;
            }
            let sql = `SELECT wo.*, mo.orderNumber as moOrderNumber, p.name as productName, wc.name as workCenterName
                 FROM work_orders wo
                 JOIN manufacturing_orders mo ON wo.manufacturingOrderId = mo.id
                 JOIN products p ON mo.productId = p.id
                 JOIN work_centers wc ON wo.workCenterId = wc.id
                 WHERE wo.status IN ('PLANNED', 'RELEASED')`;
            let params = [];
            if (workCenterId) {
                sql += ` AND wo.workCenterId = $1`;
                params.push(workCenterId);
            }
            sql += ` ORDER BY wo."priorityScore" DESC NULLS LAST, wo."dueDate" ASC LIMIT $${params.length + 1}`;
            params.push(limit);
            const { rows: workOrders } = await pool.query(sql, params);
            return workOrders.map(order => ({
                id: order.id,
                type: 'WORK_ORDER',
                priority: order.priorityScore || 0,
                dueDate: order.dueDate,
                estimatedDuration: this.calculateEstimatedDuration(order),
                resourceRequirements: [order.workCenterId],
                metadata: {
                    orderNumber: order.moOrderNumber,
                    productName: order.productName,
                    workCenter: order.workCenterName
                }
            }));
        }
        catch (error) {
            logger_1.logger.error('Error getting priority queue:', error);
            throw new errors_1.AppError('Failed to get priority queue', 500);
        }
    }
    calculateEstimatedDuration(order) {
        const baseHours = 8;
        const complexityMultiplier = order.manufacturingOrder.quantity / 10;
        return baseHours * Math.max(1, complexityMultiplier);
    }
    async optimizeSchedule(workCenterId) {
        try {
            const queue = await this.getPriorityQueue(workCenterId, 100);
            const optimized = this.applyOptimizationAlgorithm(queue);
            await this.updateWorkOrderPriorities(optimized);
            await kafka_1.kafkaService.publishPriorityEvent('SCHEDULE_OPTIMIZED', {
                workCenterId,
                optimizedCount: optimized.length,
                timestamp: new Date().toISOString()
            });
            return optimized;
        }
        catch (error) {
            logger_1.logger.error('Error optimizing schedule:', error);
            throw new errors_1.AppError('Failed to optimize schedule', 500);
        }
    }
    applyOptimizationAlgorithm(queue) {
        return queue.sort((a, b) => {
            const scoreDiff = b.priority - a.priority;
            if (Math.abs(scoreDiff) < 0.1) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            return scoreDiff;
        });
    }
    async updateWorkOrderPriorities(optimized) {
        try {
            for (let i = 0; i < optimized.length; i++) {
                await pool.query(`UPDATE work_orders SET "priorityScore" = $1, "schedulePosition" = $2, "updatedAt" = NOW() WHERE id = $3`, [optimized[i].priority, i + 1, optimized[i].id]);
            }
        }
        catch (error) {
            logger_1.logger.error('Error updating work order priorities:', error);
            throw error;
        }
    }
    async getPriorityAnalytics(timeRange = 'week') {
        try {
            const now = new Date();
            const startDate = new Date();
            switch (timeRange) {
                case 'day':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
            }
            const { rows: analytics } = await pool.query(`SELECT 
          wo.priority,
          COUNT(*) as count,
          AVG(wo."priorityScore") as avg_score,
          AVG(CASE WHEN wo.status = 'COMPLETED' THEN 1.0 ELSE 0.0 END) as completion_rate
        FROM work_orders wo
        WHERE wo."createdAt" >= $1
        GROUP BY wo.priority
        ORDER BY wo.priority`, [startDate]);
            return analytics;
        }
        catch (error) {
            logger_1.logger.error('Error getting priority analytics:', error);
            throw new errors_1.AppError('Failed to get priority analytics', 500);
        }
    }
    async handlePriorityChange(orderId, newPriority, reason) {
        try {
            await pool.query(`UPDATE work_orders SET priority = $1, "updatedAt" = NOW() WHERE id = $2`, [newPriority, orderId]);
            const priorityScore = await this.calculatePriorityScore(orderId, 'WORK_ORDER');
            await kafka_1.kafkaService.publishPriorityEvent('PRIORITY_CHANGED', {
                orderId,
                oldPriority: 'UNKNOWN',
                newPriority,
                reason,
                priorityScore,
                timestamp: new Date().toISOString()
            });
            logger_1.logger.info(`Priority changed for order ${orderId}: ${newPriority} (${reason})`);
        }
        catch (error) {
            logger_1.logger.error('Error handling priority change:', error);
            throw new errors_1.AppError('Failed to handle priority change', 500);
        }
    }
}
exports.PriorityService = PriorityService;
exports.priorityService = new PriorityService();
//# sourceMappingURL=priority.service.js.map