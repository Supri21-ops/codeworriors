"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const prisma_1 = require("./config/prisma");
const kafka_1 = require("./config/kafka");
const consumers_1 = require("./events/consumers");
const PORT = env_1.config.PORT || 3000;
async function startServer() {
    try {
        await prisma_1.prisma.$connect();
        logger_1.logger.info('Database connected successfully');
        await kafka_1.kafkaService.connect();
        logger_1.logger.info('Kafka connected successfully');
        await consumers_1.eventConsumers.startAllConsumers();
        logger_1.logger.info('Event consumers started successfully');
        app_1.app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Manufacturing Management System running on port ${PORT}`);
            logger_1.logger.info(`📊 Environment: ${env_1.config.NODE_ENV}`);
            logger_1.logger.info(`🔗 API Documentation: http://localhost:${PORT}/api/docs`);
            logger_1.logger.info(`🔍 Vector Search: Enabled`);
            logger_1.logger.info(`⚡ Priority System: Enabled`);
            logger_1.logger.info(`📡 Event Streaming: Enabled`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    await consumers_1.eventConsumers.stopAllConsumers();
    await kafka_1.kafkaService.disconnect();
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    await consumers_1.eventConsumers.stopAllConsumers();
    await kafka_1.kafkaService.disconnect();
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map