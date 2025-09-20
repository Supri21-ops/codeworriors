import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';
import { LoginDto, SignupDto } from './dto';

export class AuthService {
  async signup(data: SignupDto) {
    try {
      // Check if user already exists (by email)
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });
      
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user - note: we'll ignore username for now and use name instead
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: `${data.firstName} ${data.lastName}`,
          role: data.role || 'USER'
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      logger.info(`New user registered: ${user.email}`);

      return {
        user,
        ...tokens
      };
    } catch (error) {
      logger.error('Signup error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create user', 500);
    }
  }

  async login(data: LoginDto) {
    try {
      // Find user by email (treating emailOrUsername as email for now)
      const user = await prisma.user.findUnique({
        where: { email: data.emailOrUsername }
      });
      
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Update last login timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() }
      });

      logger.info(`User logged in: ${user.email}`);

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return {
        user: userResponse,
        ...tokens
      };
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Login failed', 500);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as { userId: string };

      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      if (!user) {
        throw new AppError('User not found or inactive', 401);
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id);

      return {
        user,
        ...tokens
      };
    } catch (error) {
      logger.error('Refresh token error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(userId: string) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just log the logout
      logger.info(`User logged out: ${userId}`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout error:', error);
      throw new AppError('Logout failed', 500);
    }
  }

  private generateTokens(userId: string) {
    const payload = { userId };
    const secret = String(config.JWT_SECRET);
    const accessToken = jwt.sign(
      payload,
      secret,
      { expiresIn: String(config.JWT_EXPIRES_IN) } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      payload,
      secret,
      { expiresIn: String(config.JWT_REFRESH_EXPIRES_IN) } as jwt.SignOptions
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: config.JWT_EXPIRES_IN
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      if (!user) {
        throw new AppError('User not found or inactive', 401);
      }

      return user;
    } catch (error) {
      logger.error('Token verification error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid token', 401);
    }
  }
}