import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/prisma';
import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';
import { LoginDto, SignupDto } from './dto';

export class AuthService {
  async signup(data: SignupDto) {
    try {
      // Check if user already exists (by email)
      const existingUserRes = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [data.email]
      );
      if (existingUserRes.rows.length > 0) {
        throw new AppError('User with this email already exists', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const insertRes = await pool.query(
        `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, createdAt, updatedAt`,
        [data.email, hashedPassword, data.firstName + ' ' + data.lastName, data.role || 'USER']
      );
      const user = insertRes.rows[0];

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
      // Find user by email
      const userRes = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [data.emailOrUsername]
      );
      const user = userRes.rows[0];
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
      await pool.query('UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdat,
          updatedAt: user.updatedat
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

      // Check if user still exists
      const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
      const user = userRes.rows[0];
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

      const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
      const user = userRes.rows[0];
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