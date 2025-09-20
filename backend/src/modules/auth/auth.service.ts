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
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { username: data.username }
          ]
        }
      });

      if (existingUser) {
        throw new AppError('User with this email or username already exists', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          password: hashedPassword,
          role: data.role || 'USER'
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true
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
      throw error;
    }
  }

  async login(data: LoginDto) {
    try {
      // Find user
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.emailOrUsername },
            { username: data.emailOrUsername }
          ],
          isActive: true
        }
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

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() }
      });

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        ...tokens
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as { userId: string };
      
      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId, isActive: true },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true
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
      throw error;
    }
  }

  private generateTokens(userId: string) {
    const payload = { userId };
    
    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN
    });

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
        where: { id: decoded.userId, isActive: true },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true
        }
      });

      if (!user) {
        throw new AppError('User not found or inactive', 401);
      }

      return user;
    } catch (error) {
      logger.error('Token verification error:', error);
      throw new AppError('Invalid token', 401);
    }
  }
}