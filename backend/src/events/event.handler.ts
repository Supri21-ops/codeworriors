import { EachMessagePayload } from 'kafkajs';
import { prisma } from '../config/prisma';
import { logger } from '../config/logger';
import { vectorService } from '../services/vector.service';
import { priorityService } from '../services/priority.service';
import { kafkaService } from '../config/kafka';

export class EventHandler {
  async handleManufacturingOrderEvent(payload: EachMessagePayload) {
    try {
      const message = JSON.parse(payload.message.value?.toString() || '{}');
      const { type, ...data } = message;

      logger.info(`Processing manufacturing order event: ${type}`, data);

      switch (type) {
        case 'MANUFACTURING_ORDER_CREATED':
          await this.handleManufacturingOrderCreated(data);
          break;
        case 'MANUFACTURING_ORDER_UPDATED':
          await this.handleManufacturingOrderUpdated(data);
          break;
        case 'MANUFACTURING_ORDER_COMPLETED':
          await this.handleManufacturingOrderCompleted(data);
          break;
        case 'MANUFACTURING_ORDER_CANCELLED':
          await this.handleManufacturingOrderCancelled(data);
          break;
        default:
          logger.warn(`Unknown manufacturing order event type: ${type}`);
      }
    } catch (error) {
      logger.error('Error handling manufacturing order event:', error);
      throw error;
    }
  }

  async handleWorkOrderEvent(payload: EachMessagePayload) {
    try {
      const message = JSON.parse(payload.message.value?.toString() || '{}');
      const { type, ...data } = message;

      logger.info(`Processing work order event: ${type}`, data);

      switch (type) {
        case 'WORK_ORDER_CREATED':
          await this.handleWorkOrderCreated(data);
          break;
        case 'WORK_ORDER_STARTED':
          await this.handleWorkOrderStarted(data);
          break;
        case 'WORK_ORDER_COMPLETED':
          await this.handleWorkOrderCompleted(data);
          break;
        case 'WORK_ORDER_CANCELLED':
          await this.handleWorkOrderCancelled(data);
          break;
        default:
          logger.warn(`Unknown work order event type: ${type}`);
      }
    } catch (error) {
      logger.error('Error handling work order event:', error);
      throw error;
    }
  }

  async handleInventoryEvent(payload: EachMessagePayload) {
    try {
      const message = JSON.parse(payload.message.value?.toString() || '{}');
      const { type, ...data } = message;

      logger.info(`Processing inventory event: ${type}`, data);

      switch (type) {
        case 'STOCK_MOVEMENT':
          await this.handleStockMovement(data);
          break;
        case 'LOW_STOCK_ALERT':
          await this.handleLowStockAlert(data);
          break;
        case 'OUT_OF_STOCK_ALERT':
          await this.handleOutOfStockAlert(data);
          break;
        default:
          logger.warn(`Unknown inventory event type: ${type}`);
      }
    } catch (error) {
      logger.error('Error handling inventory event:', error);
      throw error;
    }
  }

  async handlePriorityEvent(payload: EachMessagePayload) {
    try {
      const message = JSON.parse(payload.message.value?.toString() || '{}');
      const { type, ...data } = message;

      logger.info(`Processing priority event: ${type}`, data);

      switch (type) {
        case 'PRIORITY_UPDATED':
          await this.handlePriorityUpdated(data);
          break;
        case 'PRIORITY_CHANGED':
          await this.handlePriorityChanged(data);
          break;
        case 'SCHEDULE_OPTIMIZED':
          await this.handleScheduleOptimized(data);
          break;
        default:
          logger.warn(`Unknown priority event type: ${type}`);
      }
    } catch (error) {
      logger.error('Error handling priority event:', error);
      throw error;
    }
  }

  async handleVectorSearchEvent(payload: EachMessagePayload) {
    try {
      const message = JSON.parse(payload.message.value?.toString() || '{}');
      const { type, ...data } = message;

      logger.info(`Processing vector search event: ${type}`, data);

      switch (type) {
        case 'DOCUMENT_INDEXED':
          await this.handleDocumentIndexed(data);
          break;
        case 'SEARCH_PERFORMED':
          await this.handleSearchPerformed(data);
          break;
        case 'RECOMMENDATIONS_GENERATED':
          await this.handleRecommendationsGenerated(data);
          break;
        default:
          logger.warn(`Unknown vector search event type: ${type}`);
      }
    } catch (error) {
      logger.error('Error handling vector search event:', error);
      throw error;
    }
  }

  // Manufacturing Order Event Handlers
  private async handleManufacturingOrderCreated(data: any) {
    try {
      // Index the manufacturing order for vector search
      const order = await prisma.manufacturingOrder.findUnique({
        where: { id: data.orderId },
        include: { product: true }
      });

      if (order) {
        const content = `${order.product.name} ${order.product.description || ''} ${order.notes || ''}`;
        await vectorService.indexDocument(
          order.id,
          content,
          {
            type: 'manufacturing_order',
            productId: order.productId,
            quantity: order.quantity,
            priority: order.priority,
            status: order.status
          },
          'manufacturing-orders'
        );
      }

      // Calculate initial priority score
      await priorityService.calculatePriorityScore(data.orderId, 'MANUFACTURING_ORDER');

      // Create notification
      await this.createNotification({
        type: 'MANUFACTURING_ORDER_CREATED',
        title: 'New Manufacturing Order Created',
        message: `Manufacturing order ${data.orderNumber} has been created`,
        userId: data.userId,
        data: { orderId: data.orderId }
      });
    } catch (error) {
      logger.error('Error handling manufacturing order created:', error);
    }
  }

  private async handleManufacturingOrderUpdated(data: any) {
    try {
      // Update vector index
      const order = await prisma.manufacturingOrder.findUnique({
        where: { id: data.orderId },
        include: { product: true }
      });

      if (order) {
        const content = `${order.product.name} ${order.product.description || ''} ${order.notes || ''}`;
        await vectorService.updateDocumentEmbedding(
          order.id,
          content,
          {
            type: 'manufacturing_order',
            productId: order.productId,
            quantity: order.quantity,
            priority: order.priority,
            status: order.status
          }
        );
      }

      // Recalculate priority if needed
      if (data.changes?.priority || data.changes?.dueDate) {
        await priorityService.calculatePriorityScore(data.orderId, 'MANUFACTURING_ORDER');
      }

      // Create notification
      await this.createNotification({
        type: 'MANUFACTURING_ORDER_UPDATED',
        title: 'Manufacturing Order Updated',
        message: `Manufacturing order ${data.orderNumber} has been updated`,
        userId: data.userId,
        data: { orderId: data.orderId, changes: data.changes }
      });
    } catch (error) {
      logger.error('Error handling manufacturing order updated:', error);
    }
  }

  private async handleManufacturingOrderCompleted(data: any) {
    try {
      // Update vector index
      await vectorService.updateDocumentEmbedding(
        data.orderId,
        `COMPLETED: ${data.productName}`,
        { type: 'manufacturing_order', status: 'COMPLETED' }
      );

      // Create notification
      await this.createNotification({
        type: 'MANUFACTURING_ORDER_COMPLETED',
        title: 'Manufacturing Order Completed',
        message: `Manufacturing order ${data.orderNumber} has been completed`,
        userId: data.userId,
        data: { orderId: data.orderId }
      });
    } catch (error) {
      logger.error('Error handling manufacturing order completed:', error);
    }
  }

  private async handleManufacturingOrderCancelled(data: any) {
    try {
      // Create notification
      await this.createNotification({
        type: 'MANUFACTURING_ORDER_CANCELLED',
        title: 'Manufacturing Order Cancelled',
        message: `Manufacturing order ${data.orderNumber} has been cancelled`,
        userId: data.userId,
        data: { orderId: data.orderId }
      });
    } catch (error) {
      logger.error('Error handling manufacturing order cancelled:', error);
    }
  }

  // Work Order Event Handlers
  private async handleWorkOrderCreated(data: any) {
    try {
      // Calculate priority score
      await priorityService.calculatePriorityScore(data.workOrderId, 'WORK_ORDER');

      // Create notification
      await this.createNotification({
        type: 'WORK_ORDER_CREATED',
        title: 'New Work Order Created',
        message: `Work order ${data.orderNumber} has been created`,
        userId: data.userId,
        data: { workOrderId: data.workOrderId }
      });
    } catch (error) {
      logger.error('Error handling work order created:', error);
    }
  }

  private async handleWorkOrderStarted(data: any) {
    try {
      // Update work center status
      await prisma.workCenter.update({
        where: { id: data.workCenterId },
        data: { 
          currentWorkload: { increment: 1 },
          updatedAt: new Date()
        }
      });

      // Create notification
      await this.createNotification({
        type: 'WORK_ORDER_STARTED',
        title: 'Work Order Started',
        message: `Work order ${data.orderNumber} has been started`,
        userId: data.userId,
        data: { workOrderId: data.workOrderId }
      });
    } catch (error) {
      logger.error('Error handling work order started:', error);
    }
  }

  private async handleWorkOrderCompleted(data: any) {
    try {
      // Update work center status
      await prisma.workCenter.update({
        where: { id: data.workCenterId },
        data: { 
          currentWorkload: { decrement: 1 },
          updatedAt: new Date()
        }
      });

      // Create notification
      await this.createNotification({
        type: 'WORK_ORDER_COMPLETED',
        title: 'Work Order Completed',
        message: `Work order ${data.orderNumber} has been completed`,
        userId: data.userId,
        data: { workOrderId: data.workOrderId }
      });
    } catch (error) {
      logger.error('Error handling work order completed:', error);
    }
  }

  private async handleWorkOrderCancelled(data: any) {
    try {
      // Create notification
      await this.createNotification({
        type: 'WORK_ORDER_CANCELLED',
        title: 'Work Order Cancelled',
        message: `Work order ${data.orderNumber} has been cancelled`,
        userId: data.userId,
        data: { workOrderId: data.workOrderId }
      });
    } catch (error) {
      logger.error('Error handling work order cancelled:', error);
    }
  }

  // Inventory Event Handlers
  private async handleStockMovement(data: any) {
    try {
      // Update stock levels
      await prisma.stockItem.update({
        where: { id: data.stockItemId },
        data: {
          quantity: data.newQuantity,
          updatedAt: new Date()
        }
      });

      // Check for low stock alerts
      if (data.newQuantity <= data.minQty) {
        await kafkaService.publishInventoryEvent('LOW_STOCK_ALERT', {
          productId: data.productId,
          currentQuantity: data.newQuantity,
          minQuantity: data.minQty
        });
      }

      // Create notification
      await this.createNotification({
        type: 'STOCK_MOVEMENT',
        title: 'Stock Movement',
        message: `Stock updated for ${data.productName}: ${data.quantity} ${data.type}`,
        userId: data.userId,
        data: { stockItemId: data.stockItemId, movement: data }
      });
    } catch (error) {
      logger.error('Error handling stock movement:', error);
    }
  }

  private async handleLowStockAlert(data: any) {
    try {
      // Create urgent notification
      await this.createNotification({
        type: 'LOW_STOCK_ALERT',
        title: 'Low Stock Alert',
        message: `Low stock alert for product ${data.productName}: ${data.currentQuantity} remaining`,
        userId: data.userId,
        priority: 'URGENT',
        data: { productId: data.productId, currentQuantity: data.currentQuantity }
      });
    } catch (error) {
      logger.error('Error handling low stock alert:', error);
    }
  }

  private async handleOutOfStockAlert(data: any) {
    try {
      // Create critical notification
      await this.createNotification({
        type: 'OUT_OF_STOCK_ALERT',
        title: 'Out of Stock Alert',
        message: `Product ${data.productName} is out of stock`,
        userId: data.userId,
        priority: 'CRITICAL',
        data: { productId: data.productId }
      });
    } catch (error) {
      logger.error('Error handling out of stock alert:', error);
    }
  }

  // Priority Event Handlers
  private async handlePriorityUpdated(data: any) {
    try {
      // Update priority queue
      await priorityService.optimizeSchedule(data.workCenterId);

      // Create notification
      await this.createNotification({
        type: 'PRIORITY_UPDATED',
        title: 'Priority Updated',
        message: `Priority updated for order ${data.orderId}`,
        userId: data.userId,
        data: { orderId: data.orderId, priorityScore: data.priorityScore }
      });
    } catch (error) {
      logger.error('Error handling priority updated:', error);
    }
  }

  private async handlePriorityChanged(data: any) {
    try {
      // Create notification
      await this.createNotification({
        type: 'PRIORITY_CHANGED',
        title: 'Priority Changed',
        message: `Priority changed for order ${data.orderId}: ${data.newPriority}`,
        userId: data.userId,
        data: { orderId: data.orderId, newPriority: data.newPriority, reason: data.reason }
      });
    } catch (error) {
      logger.error('Error handling priority changed:', error);
    }
  }

  private async handleScheduleOptimized(data: any) {
    try {
      // Create notification
      await this.createNotification({
        type: 'SCHEDULE_OPTIMIZED',
        title: 'Schedule Optimized',
        message: `Schedule optimized for work center ${data.workCenterId}`,
        userId: data.userId,
        data: { workCenterId: data.workCenterId, optimizedCount: data.optimizedCount }
      });
    } catch (error) {
      logger.error('Error handling schedule optimized:', error);
    }
  }

  // Vector Search Event Handlers
  private async handleDocumentIndexed(data: any) {
    try {
      logger.info(`Document indexed: ${data.documentId}`);
    } catch (error) {
      logger.error('Error handling document indexed:', error);
    }
  }

  private async handleSearchPerformed(data: any) {
    try {
      // Log search analytics
      await prisma.$executeRaw`
        INSERT INTO search_analytics (query, results_count, user_id, created_at)
        VALUES (${data.query}, ${data.resultsCount}, ${data.userId}, NOW())
      `;
    } catch (error) {
      logger.error('Error handling search performed:', error);
    }
  }

  private async handleRecommendationsGenerated(data: any) {
    try {
      logger.info(`Recommendations generated for: ${data.orderId}`);
    } catch (error) {
      logger.error('Error handling recommendations generated:', error);
    }
  }

  // Helper Methods
  private async createNotification(notification: any) {
    try {
      await prisma.event.create({
        data: {
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          userId: notification.userId,
          isRead: false
        }
      });
    } catch (error) {
      logger.error('Error creating notification:', error);
    }
  }
}

export const eventHandler = new EventHandler();
