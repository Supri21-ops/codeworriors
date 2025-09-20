import { kafkaService } from '../config/kafka';
import { eventHandler } from './event.handler';
import { logger } from '../config/logger';

export class EventConsumers {
  async startAllConsumers() {
    try {
      logger.info('Starting all event consumers...');

      // Manufacturing Order Events Consumer
      await kafkaService.startConsumer(
        'manufacturing-orders-group',
        ['manufacturing-orders'],
        eventHandler.handleManufacturingOrderEvent.bind(eventHandler)
      );

      // Work Order Events Consumer
      await kafkaService.startConsumer(
        'work-orders-group',
        ['work-orders'],
        eventHandler.handleWorkOrderEvent.bind(eventHandler)
      );

      // Inventory Events Consumer
      await kafkaService.startConsumer(
        'inventory-group',
        ['inventory'],
        eventHandler.handleInventoryEvent.bind(eventHandler)
      );

      // Priority Events Consumer
      await kafkaService.startConsumer(
        'priority-group',
        ['priority-queue'],
        eventHandler.handlePriorityEvent.bind(eventHandler)
      );

      // Vector Search Events Consumer
      await kafkaService.startConsumer(
        'vector-search-group',
        ['vector-search'],
        eventHandler.handleVectorSearchEvent.bind(eventHandler)
      );

      logger.info('All event consumers started successfully');
    } catch (error) {
      logger.error('Error starting event consumers:', error);
      throw error;
    }
  }

  async stopAllConsumers() {
    try {
      logger.info('Stopping all event consumers...');
      await kafkaService.disconnect();
      logger.info('All event consumers stopped successfully');
    } catch (error) {
      logger.error('Error stopping event consumers:', error);
      throw error;
    }
  }
}

export const eventConsumers = new EventConsumers();
