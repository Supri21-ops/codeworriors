"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bom_controller_1 = require("./bom.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const bomController = new bom_controller_1.BomController();
router.use(auth_middleware_1.authMiddleware);
router.get('/', bomController.getBoms);
router.get('/:id', bomController.getBomById);
router.post('/', bomController.createBom);
router.put('/:id', bomController.updateBom);
router.delete('/:id', bomController.deleteBom);
exports.default = router;
//# sourceMappingURL=bom.routes.js.map