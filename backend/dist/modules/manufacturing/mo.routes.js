"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mo_controller_1 = require("./mo.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const dto_1 = require("./dto");
const router = (0, express_1.Router)();
const manufacturingOrderController = new mo_controller_1.ManufacturingOrderController();
router.use(auth_middleware_1.authMiddleware);
router.get('/stats', manufacturingOrderController.getManufacturingOrderStats);
router.get('/orders', manufacturingOrderController.getManufacturingOrders);
router.get('/orders/:id', manufacturingOrderController.getManufacturingOrderById);
router.post('/orders', (0, auth_middleware_1.requireRole)(['MANAGER', 'ADMIN']), (0, validation_middleware_1.validateRequest)(dto_1.createManufacturingOrderSchema), manufacturingOrderController.createManufacturingOrder);
router.put('/orders/:id', (0, auth_middleware_1.requireRole)(['MANAGER', 'ADMIN']), (0, validation_middleware_1.validateRequest)(dto_1.updateManufacturingOrderSchema), manufacturingOrderController.updateManufacturingOrder);
router.delete('/orders/:id', (0, auth_middleware_1.requireRole)(['ADMIN']), manufacturingOrderController.deleteManufacturingOrder);
exports.default = router;
//# sourceMappingURL=mo.routes.js.map