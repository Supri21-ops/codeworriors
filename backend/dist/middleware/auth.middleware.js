"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const auth_service_1 = require("../modules/auth/auth.service");
const errors_1 = require("../libs/errors");
const logger_1 = require("../config/logger");
const authService = new auth_service_1.AuthService();
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AppError('Access token required', 401);
        }
        const token = authHeader.substring(7);
        const user = await authService.verifyToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.logger.error('Auth middleware error:', error);
        if (error instanceof errors_1.AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new errors_1.AppError('User not authenticated', 401);
            }
            if (!roles.includes(user.role)) {
                throw new errors_1.AppError('Insufficient permissions', 403);
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('Role middleware error:', error);
            if (error instanceof errors_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
        }
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.middleware.js.map