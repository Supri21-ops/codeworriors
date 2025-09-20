"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaService = void 0;
const kafkajs_1 = require("kafkajs");
const env_1 = require("./env");
const logger_1 = require("./logger");
class KafkaService {
    constructor() {
        this.consumers = new Map();
        this.kafka = new kafkajs_1.Kafka({
            clientId: env_1.config.KAFKA_CLIENT_ID,
            brokers: env_1.config.KAFKA_BROKERS,
            retry: {
                initialRetryTime: 100,
                retries: 8
            },
            connectionTimeout: 3000,
            requestTimeout: 25000
        });
        const { Partitioners } = require('kafkajs');
        this.producer = this.kafka.producer({
            maxInFlightRequests: 1,
            idempotent: true,
            transactionTimeout: 30000,
            createPartitioner: Partitioners.LegacyPartitioner
        });
    }
    async connect() {
        try {
            await this.producer.connect();
            logger_1.logger.info('Kafka producer connected successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to connect Kafka producer:', error);
            throw error;
        }
    }
    async disconnect() {
        try {
            await this.producer.disconnect();
            for (const consumer of this.consumers.values()) {
                await consumer.disconnect();
            }
            logger_1.logger.info('Kafka disconnected successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to disconnect Kafka:', error);
            throw error;
        }
    }
    async publishEvent(topic, event, partition) {
        try {
            const message = {
                topic,
                messages: [{
                        key: event.id || event.orderId || 'default',
                        value: JSON.stringify({
                            ...event,
                            timestamp: new Date().toISOString(),
                            version: '1.0'
                        }),
                        partition
                    }]
            };
            const result = await this.producer.send(message);
            logger_1.logger.info(`Event published to topic ${topic}:`, result);
            return result;
        }
        catch (error) {
            logger_1.logger.error(`Failed to publish event to topic ${topic}:`, error);
            throw error;
        }
    }
    async createConsumer(groupId, topics) {
        try {
            const consumer = this.kafka.consumer({
                groupId,
                sessionTimeout: 30000,
                heartbeatInterval: 3000,
                maxBytesPerPartition: 1048576,
                minBytes: 1,
                maxBytes: 10485760,
                maxWaitTimeInMs: 5000
            });
            await consumer.connect();
            await consumer.subscribe({ topics, fromBeginning: false });
            this.consumers.set(groupId, consumer);
            logger_1.logger.info(`Consumer created for group ${groupId} on topics: ${topics.join(', ')}`);
            return consumer;
        }
        catch (error) {
            logger_1.logger.error(`Failed to create consumer for group ${groupId}:`, error);
            throw error;
        }
    }
    async startConsumer(groupId, topics, messageHandler) {
        try {
            const consumer = await this.createConsumer(groupId, topics);
            await consumer.run({
                eachMessage: async (payload) => {
                    try {
                        await messageHandler(payload);
                    }
                    catch (error) {
                        logger_1.logger.error('Error processing message:', error);
                    }
                }
            });
            logger_1.logger.info(`Consumer started for group ${groupId}`);
            return consumer;
        }
        catch (error) {
            logger_1.logger.error(`Failed to start consumer for group ${groupId}:`, error);
            throw error;
        }
    }
    async publishManufacturingOrderEvent(eventType, data) {
        return this.publishEvent('manufacturing-orders', {
            type: eventType,
            ...data
        });
    }
    async publishWorkOrderEvent(eventType, data) {
        return this.publishEvent('work-orders', {
            type: eventType,
            ...data
        });
    }
    async publishInventoryEvent(eventType, data) {
        return this.publishEvent('inventory', {
            type: eventType,
            ...data
        });
    }
    async publishPriorityEvent(eventType, data) {
        return this.publishEvent('priority-queue', {
            type: eventType,
            ...data
        });
    }
    async publishVectorSearchEvent(eventType, data) {
        return this.publishEvent('vector-search', {
            type: eventType,
            ...data
        });
    }
}
exports.kafkaService = new KafkaService();
exports.default = exports.kafkaService;
//# sourceMappingURL=kafka.js.map