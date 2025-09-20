"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("./search.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const searchController = new search_controller_1.SearchController();
router.use(auth_middleware_1.authMiddleware);
router.post('/manufacturing-orders', (0, validation_middleware_1.validateRequest)(joi_1.default.object({
    query: joi_1.default.string().required().min(1).max(500),
    filters: joi_1.default.object().optional()
})), searchController.searchManufacturingOrders);
router.post('/products', (0, validation_middleware_1.validateRequest)(joi_1.default.object({
    query: joi_1.default.string().required().min(1).max(500),
    filters: joi_1.default.object().optional()
})), searchController.searchProducts);
router.get('/recommendations/:orderId', searchController.getRecommendations);
router.get('/analytics', searchController.getSearchAnalytics);
exports.default = router;
//# sourceMappingURL=search.routes.js.map