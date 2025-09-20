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
            const existingUser = await prisma_1.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: data.email },
                        { username: data.username }
                    ]
                }
            });
            if (existingUser) {
                throw new errors_1.AppError('User with this email or username already exists', 400);
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
            const user = await prisma_1.prisma.user.create({
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
            const user = await prisma_1.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: data.emailOrUsername },
                        { username: data.emailOrUsername }
                    ],
                    isActive: true
                }
            });
            if (!user) {
                throw new errors_1.AppError('Invalid credentials', 401);
            }
            const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                throw new errors_1.AppError('Invalid credentials', 401);
            }
            const tokens = this.generateTokens(user.id);
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { updatedAt: new Date() }
            });
            logger_1.logger.info(`User logged in: ${user.email}`);
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
        }
        catch (error) {
            logger_1.logger.error('Login error:', error);
            throw error;
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.config.JWT_SECRET);
            const user = await prisma_1.prisma.user.findUnique({
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
        const accessToken = jsonwebtoken_1.default.sign(payload, env_1.config.JWT_SECRET, {
            expiresIn: env_1.config.JWT_EXPIRES_IN
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, env_1.config.JWT_SECRET, {
            expiresIn: env_1.config.JWT_REFRESH_EXPIRES_IN
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: env_1.config.JWT_EXPIRES_IN
        };
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
            const user = await prisma_1.prisma.user.findUnique({
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