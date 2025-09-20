import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { AppError } from '../libs/errors';
import { logger } from '../config/logger';

const authService = new AuthService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const user = await authService.verifyToken(token);
    
    // Attach user to request object
    (req as any).user = user;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        throw new AppError('User not authenticated', 401);
      }

      if (!roles.includes(user.role)) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      logger.error('Role middleware error:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }
  };
};