import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { AppError } from '../../libs/errors';
import { logger } from '../../config/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response) => {
    try {
      const signupData: SignupDto = req.body;
      
      // Validate required fields
      if (!signupData.email || !signupData.firstName || !signupData.lastName || !signupData.password) {
        throw new AppError('Email, first name, last name, and password are required', 400);
      }

      const result = await this.authService.signup(signupData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result
      });
    } catch (error) {
      logger.error('Signup controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      console.log('\n🚀 AUTH CONTROLLER - Login request received');
      const loginData: LoginDto = req.body;
      console.log('📦 Request body:', JSON.stringify(loginData, null, 2));
      
      // Validate required fields
      if (!loginData.emailOrUsername || !loginData.password) {
        console.log('❌ CONTROLLER VALIDATION FAILED - missing fields');
        console.log(`   emailOrUsername: ${!!loginData.emailOrUsername}`);
        console.log(`   password: ${!!loginData.password}`);
        throw new AppError('Email/username and password are required', 400);
      }

      console.log('✅ Controller validation passed');
      console.log('🔄 Calling auth service...');
      const result = await this.authService.login(loginData);
      console.log('✅ Auth service returned success');
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      console.log('\n💥 AUTH CONTROLLER ERROR:');
      console.log('   Error type:', error instanceof AppError ? 'AppError' : 'Unknown');
      console.log('   Error message:', error?.message || 'No message');
      console.log('   Error stack:', error?.stack || 'No stack');
      
      if (error instanceof AppError) {
        console.log(`   Returning ${error.statusCode} status`);
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        console.log('   Returning 500 status (unknown error)');
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      const result = await this.authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      logger.error('Refresh token controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const result = await this.authService.logout(userId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Logout controller error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}