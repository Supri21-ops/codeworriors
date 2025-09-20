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

      // Store password as plain text (no hashing)
      const plainPassword = data.password;
      const fullName = `${data.firstName} ${data.lastName}`;
      const userRole = data.role || 'USER';

      console.log('\n📝 SIGNUP DEBUG - SQL Parameters:');
      console.log(`   $1 (email): "${data.email}"`);
      console.log(`   $2 (password): "${plainPassword}"`);
      console.log(`   $3 (name): "${fullName}"`);
      console.log(`   $4 (role): "${userRole}"`);

      // Create user - note: we'll ignore username for now and use name instead
      const userResult = await db.query(
        'INSERT INTO users (email, password, name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, name, role, created_at, updated_at, password',
        [data.email, plainPassword, fullName, userRole]
      );
      
      console.log('✅ User created in database');
      console.log('📊 Returned user data:', JSON.stringify(userResult.rows[0], null, 2));
      
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
      console.log('\n🔐 LOGIN DEBUG - Starting login process');
      console.log(`📧 Email/Username: ${data.emailOrUsername}`);
      console.log(`🔑 Password length: ${data.password?.length || 0} chars`);
      
      // Find user by email (treating emailOrUsername as email for now)
      console.log('🔍 Searching for user in database...');
      const userResult = await db.query(
        'SELECT id, email, password, name, role, created_at, updated_at FROM users WHERE email = $1',
        [data.emailOrUsername]
      );
      
      console.log(`📊 Database query returned ${userResult.rows.length} users`);
      
      if (userResult.rows.length === 0) {
        console.log('❌ USER NOT FOUND - throwing 401');
        throw new AppError('Invalid credentials', 401);
      }
      
      const user = userResult.rows[0];
      console.log(`✅ User found: ${user.email} (ID: ${user.id})`);
      console.log('� FULL USER OBJECT FROM DB:', JSON.stringify(user, null, 2));
      console.log(`📝 user.password field: "${user.password}" (length: ${user.password?.length || 0})`);
      console.log(`📝 user.name field: "${user.name}"`);
      console.log(`📝 Input password: "${data.password}" (length: ${data.password?.length || 0})`);

      // Check password (plain text comparison)
      const isPasswordValid = data.password === user.password;
      console.log(`🔐 Password comparison: ${isPasswordValid ? '✅ MATCH' : '❌ NO MATCH'}`);
      
      if (!isPasswordValid) {
        console.log('❌ PASSWORD MISMATCH - throwing 401');
        console.log(`   Expected: "${user.password}"`);
        console.log(`   Received: "${data.password}"`);
        console.log(`   Strict equality: ${data.password === user.password}`);
        console.log(`   Type check - stored: ${typeof user.password}, input: ${typeof data.password}`);
        throw new AppError('Invalid credentials', 401);
      }

      console.log('✅ LOGIN SUCCESS - generating tokens');

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