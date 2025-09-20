"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priority_controller_1 = require("./priority.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const priorityController = new priority_controller_1.PriorityController();
router.use(auth_middleware_1.authMiddleware);
router.get('/queue', priorityController.getPriorityQueue);
router.get('/analytics', priorityController.getPriorityAnalytics);
router.get('/calculate/:orderId', priorityController.calculatePriorityScore);
router.put('/change/:orderId', (0, auth_middleware_1.requireRole)(['MANAGER', 'ADMIN']), (0, validation_middleware_1.validateRequest)(joi_1.default.object({
    newPriority: joi_1.default.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').required(),
    reason: joi_1.default.string().required().min(10).max(500)
})), priorityController.changePriority);
router.post('/optimize/:workCenterId', (0, auth_middleware_1.requireRole)(['MANAGER', 'ADMIN']), priorityController.optimizeSchedule);
exports.default = router;
//# sourceMappingURL=priority.routes.js.map