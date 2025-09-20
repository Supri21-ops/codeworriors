"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("./user.service");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const userService = new user_service_1.UserService();
router.use(auth_middleware_1.authMiddleware);
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await userService.getUserStats();
        res.json(stats);
    }
    catch (err) {
        next(err);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const result = await userService.getUsers(Number(page), Number(limit), filters);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        const updated = await userService.updateUser(req.params.id, req.body, req.user?.id);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', (0, auth_middleware_1.requireRole)(['ADMIN']), async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.params.id, req.user?.id);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map