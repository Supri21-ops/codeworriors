import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Initialize the Prisma client
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log Prisma events
prisma.$on('query', (e: any) => {
  logger.debug(`Query: ${e.query}, Params: ${e.params}, Duration: ${e.duration}ms`);
});

prisma.$on('error', (e: any) => {
  logger.error('Prisma error:', e);
});

prisma.$on('info', (e: any) => {
  logger.info('Prisma info:', e.message);
});

prisma.$on('warn', (e: any) => {
  logger.warn('Prisma warning:', e.message);
});

export { prisma };