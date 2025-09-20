import { Router } from 'express';
import { UserService } from './user.service';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import Joi from 'joi';

const router = Router();
const userService = new UserService();

// All routes require authentication
router.use(authMiddleware);

// Get user statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await userService.getUsers(Number(page), Number(limit), filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update user
router.put('/:id', async (req, res, next) => {
  try {
  const updated = await userService.updateUser(req.params.id, req.body, (req as any).user?.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete user (admin only)
router.delete('/:id', 
  requireRole(['ADMIN']),
  async (req, res, next) => {
    try {
  const result = await userService.deleteUser(req.params.id, (req as any).user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;