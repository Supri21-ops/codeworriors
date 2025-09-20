"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
class AuthController {
    constructor() {
        this.signup = async (req, res) => {
            try {
                const signupData = req.body;
                if (!signupData.email || !signupData.username || !signupData.password) {
                    throw new errors_1.AppError('Email, username, and password are required', 400);
                }
                const result = await this.authService.signup(signupData);
                res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    data: result
                });
            }
            catch (error) {
                logger_1.logger.error('Signup controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.login = async (req, res) => {
            try {
                const loginData = req.body;
                if (!loginData.emailOrUsername || !loginData.password) {
                    throw new errors_1.AppError('Email/username and password are required', 400);
                }
                const result = await this.authService.login(loginData);
                res.json({
                    success: true,
                    message: 'Login successful',
                    data: result
                });
            }
            catch (error) {
                logger_1.logger.error('Login controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.refreshToken = async (req, res) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    throw new errors_1.AppError('Refresh token is required', 400);
                }
                const result = await this.authService.refreshToken(refreshToken);
                res.json({
                    success: true,
                    message: 'Token refreshed successfully',
                    data: result
                });
            }
            catch (error) {
                logger_1.logger.error('Refresh token controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.logout = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const result = await this.authService.logout(userId);
                res.json({
                    success: true,
                    message: result.message
                });
            }
            catch (error) {
                logger_1.logger.error('Logout controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const user = req.user;
                res.json({
                    success: true,
                    data: user
                });
            }
            catch (error) {
                logger_1.logger.error('Get profile controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map