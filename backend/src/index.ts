import { app } from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/prisma';
import { kafkaService } from './config/kafka';
import { eventConsumers } from './events/consumers';

const PORT = config.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Connect to Kafka
    await kafkaService.connect();
    logger.info('Kafka connected successfully');

    // Start event consumers
    await eventConsumers.startAllConsumers();
    logger.info('Event consumers started successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Manufacturing Management System running on port ${PORT}`);
      logger.info(`📊 Environment: ${config.NODE_ENV}`);
      logger.info(`🔗 API Documentation: http://localhost:${PORT}/api/docs`);
      logger.info(`🔍 Vector Search: Enabled`);
      logger.info(`⚡ Priority System: Enabled`);
      logger.info(`📡 Event Streaming: Enabled`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await eventConsumers.stopAllConsumers();
  await kafkaService.disconnect();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await eventConsumers.stopAllConsumers();
  await kafkaService.disconnect();
  await prisma.$disconnect();
  process.exit(0);
});

startServer();