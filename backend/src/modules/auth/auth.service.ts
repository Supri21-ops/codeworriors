import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/prisma';
import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';
import { LoginDto, SignupDto } from './dto';

export class AuthService {
  async signup(data: SignupDto) {
    try {
      // Check if user already exists (by email)
      const existingUserResult = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );
      
      if (existingUserResult.rows.length > 0) {
        throw new AppError('User with this email already exists', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user - note: we'll ignore username for now and use name instead
      const userResult = await db.query(
        'INSERT INTO users (email, password, name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, name, role, created_at, updated_at',
        [data.email, hashedPassword, `${data.firstName} ${data.lastName}`, data.role || 'USER']
      );
      
      const user = userResult.rows[0];

  logger.info(`Found user for login check: ${user.email} (id=${user.id})`);

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
      const userResult = await db.query(
        'SELECT id, email, name, role, password, created_at, updated_at FROM users WHERE email = $1',
        [data.emailOrUsername]
      );
      
      if (userResult.rows.length === 0) {
        throw new AppError('Invalid credentials', 401);
      }
      
      const user = userResult.rows[0];

      // Debug: log presence of user and hash format (no plaintext)
      try {
        logger.info(`Login: user found for ${user.email}. Password hash present: ${!!user.password}. hashPrefix=${String(user.password).slice(0,7)}`);
      } catch (e) {
        // ignore logging errors
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      // Debug: log comparison result (do NOT log supplied password)
      try {
        logger.info(`Login: password comparison result for ${user.email}: ${isPasswordValid}`);
      } catch (e) {
        // ignore logging errors
      }

      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Update last login timestamp
      await db.query(
        'UPDATE users SET updated_at = NOW() WHERE id = $1',
        [user.id]
      );

      logger.info(`User logged in: ${user.email}`);

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
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
      const userResult = await db.query(
        'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length === 0) {
        throw new AppError('User not found or inactive', 401);
      }
      
      const user = userResult.rows[0];
      
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

      const userResult = await db.query(
        'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length === 0) {
        throw new AppError('User not found or inactive', 401);
      }
      
      const user = userResult.rows[0];
      
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