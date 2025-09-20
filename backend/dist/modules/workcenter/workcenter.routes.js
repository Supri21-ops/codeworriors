"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workcenter_controller_1 = require("./workcenter.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const workCenterController = new workcenter_controller_1.WorkCenterController();
router.use(auth_middleware_1.authMiddleware);
router.get('/', workCenterController.getWorkCenters);
router.get('/:id', workCenterController.getWorkCenterById);
router.post('/', workCenterController.createWorkCenter);
router.put('/:id', workCenterController.updateWorkCenter);
router.delete('/:id', workCenterController.deleteWorkCenter);
router.get('/:id/capacity', workCenterController.getWorkCenterCapacity);
router.put('/:id/capacity', workCenterController.updateWorkCenterCapacity);
exports.default = router;
//# sourceMappingURL=workcenter.routes.js.map