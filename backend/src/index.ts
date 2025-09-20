import { logger } from './config/logger';
// Global error handlers
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
import { app } from './app';
import { config } from './config/env';
import { kafkaService } from './config/kafka';
import { eventConsumers } from './events/consumers';

const PORT = config.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    const { db } = await import('./config/prisma');
    await db.connect();
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
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await eventConsumers.stopAllConsumers();
  await kafkaService.disconnect();
  process.exit(0);
});

startServer();