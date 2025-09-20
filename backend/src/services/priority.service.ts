import { prisma } from '../config/prisma';
import { logger } from '../config/logger';
import { kafkaService } from '../config/kafka';
import { AppError } from '../libs/errors';

interface PriorityScore {
  baseScore: number;
  urgencyMultiplier: number;
  deadlineFactor: number;
  resourceAvailability: number;
  customerTier: number;
  totalScore: number;
}

interface PriorityQueueItem {
  id: string;
  type: 'MANUFACTURING_ORDER' | 'WORK_ORDER';
  priority: number;
  dueDate: Date;
  estimatedDuration: number;
  resourceRequirements: string[];
  metadata: any;
}

export class PriorityService {
  private readonly URGENCY_WEIGHTS = {
    URGENT: 4.0,
    HIGH: 3.0,
    NORMAL: 2.0,
    LOW: 1.0
  };

  private readonly CUSTOMER_TIER_WEIGHTS = {
    PLATINUM: 1.5,
    GOLD: 1.3,
    SILVER: 1.1,
    BRONZE: 1.0
  };

  async calculatePriorityScore(orderId: string, type: 'MANUFACTURING_ORDER' | 'WORK_ORDER'): Promise<PriorityScore> {
    try {
      let order: any;
      
      if (type === 'MANUFACTURING_ORDER') {
        order = await prisma.manufacturingOrder.findUnique({
          where: { id: orderId },
          include: {
            product: true,
            createdBy: true
          }
        });
      } else {
        order = await prisma.workOrder.findUnique({
          where: { id: orderId },
          include: {
            manufacturingOrder: {
              include: { product: true }
            },
            workCenter: true
          }
        });
      }

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const baseScore = this.URGENCY_WEIGHTS[order.priority] || 2.0;
      const urgencyMultiplier = this.calculateUrgencyMultiplier(order);
      const deadlineFactor = this.calculateDeadlineFactor(order.dueDate);
      const resourceAvailability = await this.calculateResourceAvailability(order);
      const customerTier = this.CUSTOMER_TIER_WEIGHTS[order.customerTier] || 1.0;

      const totalScore = baseScore * urgencyMultiplier * deadlineFactor * resourceAvailability * customerTier;

      const priorityScore: PriorityScore = {
        baseScore,
        urgencyMultiplier,
        deadlineFactor,
        resourceAvailability,
        customerTier,
        totalScore
      };

      // Update priority score in database
      await this.updatePriorityScore(orderId, type, totalScore);

      // Publish priority update event
      await kafkaService.publishPriorityEvent('PRIORITY_UPDATED', {
        orderId,
        type,
        priorityScore,
        timestamp: new Date().toISOString()
      });

      return priorityScore;
    } catch (error) {
      logger.error('Error calculating priority score:', error);
      throw error;
    }
  }

  private calculateUrgencyMultiplier(order: any): number {
    const now = new Date();
    const dueDate = new Date(order.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 3.0; // Overdue
    if (daysUntilDue === 0) return 2.5; // Due today
    if (daysUntilDue <= 1) return 2.0; // Due tomorrow
    if (daysUntilDue <= 3) return 1.5; // Due in 3 days
    if (daysUntilDue <= 7) return 1.2; // Due in a week
    return 1.0; // More than a week
  }

  private calculateDeadlineFactor(dueDate: Date): number {
    const now = new Date();
    const due = new Date(dueDate);
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDue < 0) return 3.0; // Overdue
    if (hoursUntilDue <= 24) return 2.5; // Due within 24 hours
    if (hoursUntilDue <= 72) return 2.0; // Due within 3 days
    if (hoursUntilDue <= 168) return 1.5; // Due within a week
    return 1.0; // More than a week
  }

  private async calculateResourceAvailability(order: any): number {
    try {
      // Check work center availability
      const workCenters = await prisma.workCenter.findMany({
        where: { isActive: true }
      });

      const totalCapacity = workCenters.reduce((sum, wc) => sum + wc.capacity, 0);
      
      // Check current workload
      const currentWorkload = await prisma.workOrder.count({
        where: {
          status: 'IN_PROGRESS',
          workCenterId: { in: workCenters.map(wc => wc.id) }
        }
      });

      const availabilityRatio = Math.max(0.1, (totalCapacity - currentWorkload) / totalCapacity);
      return 0.5 + (availabilityRatio * 1.5); // Range: 0.5 to 2.0
    } catch (error) {
      logger.error('Error calculating resource availability:', error);
      return 1.0; // Default neutral factor
    }
  }

  private async updatePriorityScore(orderId: string, type: string, score: number) {
    try {
      if (type === 'MANUFACTURING_ORDER') {
        await prisma.manufacturingOrder.update({
          where: { id: orderId },
          data: { 
            priorityScore: score,
            updatedAt: new Date()
          }
        });
      } else {
        await prisma.workOrder.update({
          where: { id: orderId },
          data: { 
            priorityScore: score,
            updatedAt: new Date()
          }
        });
      }
    } catch (error) {
      logger.error('Error updating priority score:', error);
      throw error;
    }
  }

  async getPriorityQueue(workCenterId?: string, limit: number = 50): Promise<PriorityQueueItem[]> {
    try {
      let whereClause: any = {
        status: { in: ['PLANNED', 'RELEASED'] }
      };

      if (workCenterId) {
        whereClause.workCenterId = workCenterId;
      }

      const workOrders = await prisma.workOrder.findMany({
        where: whereClause,
        include: {
          manufacturingOrder: {
            include: { product: true }
          },
          workCenter: true
        },
        orderBy: [
          { priorityScore: 'desc' },
          { dueDate: 'asc' }
        ],
        take: limit
      });

      return workOrders.map(order => ({
        id: order.id,
        type: 'WORK_ORDER' as const,
        priority: order.priorityScore || 0,
        dueDate: order.dueDate,
        estimatedDuration: this.calculateEstimatedDuration(order),
        resourceRequirements: [order.workCenterId],
        metadata: {
          orderNumber: order.orderNumber,
          productName: order.manufacturingOrder.product.name,
          workCenter: order.workCenter.name
        }
      }));
    } catch (error) {
      logger.error('Error getting priority queue:', error);
      throw new AppError('Failed to get priority queue', 500);
    }
  }

  private calculateEstimatedDuration(order: any): number {
    // This would typically be calculated based on historical data
    // For now, we'll use a simple calculation
    const baseHours = 8; // Base 8 hours
    const complexityMultiplier = order.manufacturingOrder.quantity / 10; // Based on quantity
    return baseHours * Math.max(1, complexityMultiplier);
  }

  async optimizeSchedule(workCenterId: string): Promise<PriorityQueueItem[]> {
    try {
      const queue = await this.getPriorityQueue(workCenterId, 100);
      
      // Apply optimization algorithm (simplified version)
      const optimized = this.applyOptimizationAlgorithm(queue);
      
      // Update work order priorities based on optimization
      await this.updateWorkOrderPriorities(optimized);
      
      // Publish optimization event
      await kafkaService.publishPriorityEvent('SCHEDULE_OPTIMIZED', {
        workCenterId,
        optimizedCount: optimized.length,
        timestamp: new Date().toISOString()
      });

      return optimized;
    } catch (error) {
      logger.error('Error optimizing schedule:', error);
      throw new AppError('Failed to optimize schedule', 500);
    }
  }

  private applyOptimizationAlgorithm(queue: PriorityQueueItem[]): PriorityQueueItem[] {
    // Simple optimization: sort by priority score and deadline
    return queue.sort((a, b) => {
      const scoreDiff = b.priority - a.priority;
      if (Math.abs(scoreDiff) < 0.1) {
        // If scores are similar, prioritize by deadline
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return scoreDiff;
    });
  }

  private async updateWorkOrderPriorities(optimized: PriorityQueueItem[]) {
    try {
      for (let i = 0; i < optimized.length; i++) {
        await prisma.workOrder.update({
          where: { id: optimized[i].id },
          data: { 
            priorityScore: optimized[i].priority,
            schedulePosition: i + 1,
            updatedAt: new Date()
          }
        });
      }
    } catch (error) {
      logger.error('Error updating work order priorities:', error);
      throw error;
    }
  }

  async getPriorityAnalytics(timeRange: 'day' | 'week' | 'month' = 'week') {
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

      const analytics = await prisma.$queryRaw<Array<{
        priority: string;
        count: number;
        avgScore: number;
        completionRate: number;
      }>>`
        SELECT 
          wo.priority,
          COUNT(*) as count,
          AVG(wo.priority_score) as avg_score,
          AVG(CASE WHEN wo.status = 'COMPLETED' THEN 1.0 ELSE 0.0 END) as completion_rate
        FROM work_orders wo
        WHERE wo.created_at >= ${startDate}
        GROUP BY wo.priority
        ORDER BY wo.priority
      `;

      return analytics;
    } catch (error) {
      logger.error('Error getting priority analytics:', error);
      throw new AppError('Failed to get priority analytics', 500);
    }
  }

  async handlePriorityChange(orderId: string, newPriority: string, reason: string) {
    try {
      // Update priority in database
      await prisma.workOrder.update({
        where: { id: orderId },
        data: { 
          priority: newPriority,
          updatedAt: new Date()
        }
      });

      // Recalculate priority score
      const priorityScore = await this.calculatePriorityScore(orderId, 'WORK_ORDER');

      // Publish priority change event
      await kafkaService.publishPriorityEvent('PRIORITY_CHANGED', {
        orderId,
        oldPriority: 'UNKNOWN', // Would need to track previous priority
        newPriority,
        reason,
        priorityScore,
        timestamp: new Date().toISOString()
      });

      logger.info(`Priority changed for order ${orderId}: ${newPriority} (${reason})`);
    } catch (error) {
      logger.error('Error handling priority change:', error);
      throw new AppError('Failed to handle priority change', 500);
    }
  }
}

export const priorityService = new PriorityService();
