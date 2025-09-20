import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import manufacturingRoutes from './modules/manufacturing/mo.routes';
import searchRoutes from './modules/search/search.routes';
import priorityRoutes from './modules/priority/priority.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/manufacturing', manufacturingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/priority', priorityRoutes);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Manufacturing Management System API',
    version: '1.0.0',
    description: 'API for managing manufacturing orders, work orders, and inventory',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'User login',
        'POST /api/auth/signup': 'User registration',
        'POST /api/auth/refresh': 'Refresh access token'
      },
      users: {
        'GET /api/users': 'Get all users',
        'GET /api/users/:id': 'Get user by ID',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user'
      },
      manufacturing: {
        'GET /api/manufacturing/orders': 'Get all manufacturing orders',
        'POST /api/manufacturing/orders': 'Create manufacturing order',
        'GET /api/manufacturing/orders/:id': 'Get manufacturing order by ID',
        'PUT /api/manufacturing/orders/:id': 'Update manufacturing order',
        'DELETE /api/manufacturing/orders/:id': 'Delete manufacturing order'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export { app };