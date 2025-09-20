"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../config/prisma");
const env_1 = require("../../config/env");
const logger_1 = require("../../config/logger");
const errors_1 = require("../../libs/errors");
class AuthService {
    async signup(data) {
        try {
            const existingUserRes = await prisma_1.pool.query('SELECT * FROM users WHERE email = $1', [data.email]);
            if (existingUserRes.rows.length > 0) {
                throw new errors_1.AppError('User with this email already exists', 400);
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
            const insertRes = await prisma_1.pool.query(`INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, createdAt, updatedAt`, [data.email, hashedPassword, data.firstName + ' ' + data.lastName, data.role || 'USER']);
            const user = insertRes.rows[0];
            const tokens = this.generateTokens(user.id);
            logger_1.logger.info(`New user registered: ${user.email}`);
            return {
                user,
                ...tokens
            };
        }
        catch (error) {
            logger_1.logger.error('Signup error:', error);
            throw error;
        }
    }
    async login(data) {
        try {
            const userRes = await prisma_1.pool.query('SELECT * FROM users WHERE email = $1', [data.emailOrUsername]);
            const user = userRes.rows[0];
            if (!user) {
                throw new errors_1.AppError('Invalid credentials', 401);
            }
            const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                throw new errors_1.AppError('Invalid credentials', 401);
            }
            const tokens = this.generateTokens(user.id);
            await prisma_1.pool.query('UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
            logger_1.logger.info(`User logged in: ${user.email}`);
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
        }
        catch (error) {
            logger_1.logger.error('Login error:', error);
            throw error;
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.config.JWT_SECRET);
            const userRes = await prisma_1.pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
            const user = userRes.rows[0];
            if (!user) {
                throw new errors_1.AppError('User not found or inactive', 401);
            }
            const tokens = this.generateTokens(user.id);
            return {
                user,
                ...tokens
            };
        }
        catch (error) {
            logger_1.logger.error('Refresh token error:', error);
            throw new errors_1.AppError('Invalid refresh token', 401);
        }
    }
    async logout(userId) {
        try {
            logger_1.logger.info(`User logged out: ${userId}`);
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            logger_1.logger.error('Logout error:', error);
            throw error;
        }
    }
    generateTokens(userId) {
        const payload = { userId };
        const secret = String(env_1.config.JWT_SECRET);
        const accessToken = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: String(env_1.config.JWT_EXPIRES_IN) });
        const refreshToken = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: String(env_1.config.JWT_REFRESH_EXPIRES_IN) });
        return {
            accessToken,
            refreshToken,
            expiresIn: env_1.config.JWT_EXPIRES_IN
        };
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
            const userRes = await prisma_1.pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
            const user = userRes.rows[0];
            if (!user) {
                throw new errors_1.AppError('User not found or inactive', 401);
            }
            return user;
        }
        catch (error) {
            logger_1.logger.error('Token verification error:', error);
            throw new errors_1.AppError('Invalid token', 401);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map