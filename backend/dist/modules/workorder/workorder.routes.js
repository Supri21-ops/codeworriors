"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workorder_controller_1 = require("./workorder.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const workOrderController = new workorder_controller_1.WorkOrderController();
router.use(auth_middleware_1.authMiddleware);
router.get('/', workOrderController.getWorkOrders);
router.get('/:id', workOrderController.getWorkOrderById);
router.post('/', workOrderController.createWorkOrder);
router.put('/:id', workOrderController.updateWorkOrder);
router.delete('/:id', workOrderController.deleteWorkOrder);
router.patch('/:id/start', workOrderController.startWorkOrder);
router.patch('/:id/pause', workOrderController.pauseWorkOrder);
router.patch('/:id/complete', workOrderController.completeWorkOrder);
router.patch('/:id/cancel', workOrderController.cancelWorkOrder);
exports.default = router;
//# sourceMappingURL=workorder.routes.js.map