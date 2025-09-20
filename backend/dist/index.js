"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./config/logger");
process.on('uncaughtException', (err) => {
    logger_1.logger.error('Uncaught Exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
const app_1 = require("./app");
const env_1 = require("./config/env");
const kafka_1 = require("./config/kafka");
const consumers_1 = require("./events/consumers");
const PORT = env_1.config.PORT || 5000;
async function startServer() {
    try {
        const { db } = await Promise.resolve().then(() => __importStar(require('./config/prisma')));
        await db.connect();
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
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    await consumers_1.eventConsumers.stopAllConsumers();
    await kafka_1.kafkaService.disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map