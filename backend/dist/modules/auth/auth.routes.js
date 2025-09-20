"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const dto_1 = require("./dto");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/signup', (0, validation_middleware_1.validateRequest)(dto_1.signupSchema), authController.signup);
router.post('/login', (0, validation_middleware_1.validateRequest)(dto_1.loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', auth_middleware_1.authMiddleware, authController.logout);
router.get('/profile', auth_middleware_1.authMiddleware, authController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map