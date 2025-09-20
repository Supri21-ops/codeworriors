import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { config } from './env';
import { logger } from './logger';

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: config.KAFKA_CLIENT_ID,
      brokers: config.KAFKA_BROKERS,
      retry: {
        initialRetryTime: 100,
        retries: 8
      },
      connectionTimeout: 3000,
      requestTimeout: 25000
    });

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000
    });
  }

  async connect() {
    try {
      await this.producer.connect();
      logger.info('Kafka producer connected successfully');
    } catch (error) {
      logger.error('Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      
      // Disconnect all consumers
      for (const consumer of this.consumers.values()) {
        await consumer.disconnect();
      }
      
      logger.info('Kafka disconnected successfully');
    } catch (error) {
      logger.error('Failed to disconnect Kafka:', error);
      throw error;
    }
  }

  async publishEvent(topic: string, event: any, partition?: number) {
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
      logger.info(`Event published to topic ${topic}:`, result);
      return result;
    } catch (error) {
      logger.error(`Failed to publish event to topic ${topic}:`, error);
      throw error;
    }
  }

  async createConsumer(groupId: string, topics: string[]) {
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
      logger.info(`Consumer created for group ${groupId} on topics: ${topics.join(', ')}`);
      
      return consumer;
    } catch (error) {
      logger.error(`Failed to create consumer for group ${groupId}:`, error);
      throw error;
    }
  }

  async startConsumer(
    groupId: string, 
    topics: string[], 
    messageHandler: (payload: EachMessagePayload) => Promise<void>
  ) {
    try {
      const consumer = await this.createConsumer(groupId, topics);
      
      await consumer.run({
        eachMessage: async (payload) => {
          try {
            await messageHandler(payload);
          } catch (error) {
            logger.error('Error processing message:', error);
            // Implement dead letter queue logic here
          }
        }
      });

      logger.info(`Consumer started for group ${groupId}`);
      return consumer;
    } catch (error) {
      logger.error(`Failed to start consumer for group ${groupId}:`, error);
      throw error;
    }
  }

  // Event publishing methods for different event types
  async publishManufacturingOrderEvent(eventType: string, data: any) {
    return this.publishEvent('manufacturing-orders', {
      type: eventType,
      ...data
    });
  }

  async publishWorkOrderEvent(eventType: string, data: any) {
    return this.publishEvent('work-orders', {
      type: eventType,
      ...data
    });
  }

  async publishInventoryEvent(eventType: string, data: any) {
    return this.publishEvent('inventory', {
      type: eventType,
      ...data
    });
  }

  async publishPriorityEvent(eventType: string, data: any) {
    return this.publishEvent('priority-queue', {
      type: eventType,
      ...data
    });
  }

  async publishVectorSearchEvent(eventType: string, data: any) {
    return this.publishEvent('vector-search', {
      type: eventType,
      ...data
    });
  }
}

export const kafkaService = new KafkaService();
export default kafkaService;