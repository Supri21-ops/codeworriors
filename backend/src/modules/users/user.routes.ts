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
router.get('/stats', userService.getUserStats);

// Get all users
router.get('/', userService.getUsers);

// Get user by ID
router.get('/:id', userService.getUserById);

// Update user
router.put('/:id', userService.updateUser);

// Delete user (admin only)
router.delete('/:id', 
  requireRole(['ADMIN']),
  userService.deleteUser
);

export default router;