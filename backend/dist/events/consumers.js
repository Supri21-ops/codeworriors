"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventConsumers = exports.EventConsumers = void 0;
const kafka_1 = require("../config/kafka");
const event_handler_1 = require("./event.handler");
const logger_1 = require("../config/logger");
class EventConsumers {
    async startAllConsumers() {
        try {
            logger_1.logger.info('Starting all event consumers...');
            await kafka_1.kafkaService.startConsumer('manufacturing-orders-group', ['manufacturing-orders'], event_handler_1.eventHandler.handleManufacturingOrderEvent.bind(event_handler_1.eventHandler));
            await kafka_1.kafkaService.startConsumer('work-orders-group', ['work-orders'], event_handler_1.eventHandler.handleWorkOrderEvent.bind(event_handler_1.eventHandler));
            await kafka_1.kafkaService.startConsumer('inventory-group', ['inventory'], event_handler_1.eventHandler.handleInventoryEvent.bind(event_handler_1.eventHandler));
            await kafka_1.kafkaService.startConsumer('priority-group', ['priority-queue'], event_handler_1.eventHandler.handlePriorityEvent.bind(event_handler_1.eventHandler));
            await kafka_1.kafkaService.startConsumer('vector-search-group', ['vector-search'], event_handler_1.eventHandler.handleVectorSearchEvent.bind(event_handler_1.eventHandler));
            logger_1.logger.info('All event consumers started successfully');
        }
        catch (error) {
            logger_1.logger.error('Error starting event consumers:', error);
            throw error;
        }
    }
    async stopAllConsumers() {
        try {
            logger_1.logger.info('Stopping all event consumers...');
            await kafka_1.kafkaService.disconnect();
            logger_1.logger.info('All event consumers stopped successfully');
        }
        catch (error) {
            logger_1.logger.error('Error stopping event consumers:', error);
            throw error;
        }
    }
}
exports.EventConsumers = EventConsumers;
exports.eventConsumers = new EventConsumers();
//# sourceMappingURL=consumers.js.map