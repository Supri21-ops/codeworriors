"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const mo_routes_1 = __importDefault(require("./modules/manufacturing/mo.routes"));
const search_routes_1 = __importDefault(require("./modules/search/search.routes"));
const priority_routes_1 = __importDefault(require("./modules/priority/priority.routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.config.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.logger.info(message.trim())
    }
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.config.NODE_ENV
    });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/manufacturing', mo_routes_1.default);
app.use('/api/search', search_routes_1.default);
app.use('/api/priority', priority_routes_1.default);
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'Manufacturing Management System API',
        version: '1.0.0',
        description: 'API for managing manufacturing orders, work orders, and inventory',
        endpoints: {
            auth: {
                'POST /api/auth/login': 'User login',
                'POST /api/auth/signup': 'User registration',
                'POST /api/auth/refresh': 'Refresh access token'
            },
            users: {
                'GET /api/users': 'Get all users',
                'GET /api/users/:id': 'Get user by ID',
                'PUT /api/users/:id': 'Update user',
                'DELETE /api/users/:id': 'Delete user'
            },
            manufacturing: {
                'GET /api/manufacturing/orders': 'Get all manufacturing orders',
                'POST /api/manufacturing/orders': 'Create manufacturing order',
                'GET /api/manufacturing/orders/:id': 'Get manufacturing order by ID',
                'PUT /api/manufacturing/orders/:id': 'Update manufacturing order',
                'DELETE /api/manufacturing/orders/:id': 'Delete manufacturing order'
            }
        }
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});
app.use(error_middleware_1.errorHandler);
//# sourceMappingURL=app.js.map