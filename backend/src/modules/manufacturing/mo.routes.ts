import { Router } from 'express';
import { ManufacturingOrderController } from './mo.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createManufacturingOrderSchema, updateManufacturingOrderSchema } from './dto';

const router = Router();
const manufacturingOrderController = new ManufacturingOrderController();

// All routes require authentication
router.use(authMiddleware);

// Get manufacturing order statistics
router.get('/stats', manufacturingOrderController.getManufacturingOrderStats);

// Get all manufacturing orders
router.get('/orders', manufacturingOrderController.getManufacturingOrders);

// Get manufacturing order by ID
router.get('/orders/:id', manufacturingOrderController.getManufacturingOrderById);

// Create manufacturing order (requires manager or admin role)
router.post('/orders', 
  requireRole(['MANAGER', 'ADMIN']),
  validateRequest(createManufacturingOrderSchema),
  manufacturingOrderController.createManufacturingOrder
);

// Update manufacturing order (requires manager or admin role)
router.put('/orders/:id',
  requireRole(['MANAGER', 'ADMIN']),
  validateRequest(updateManufacturingOrderSchema),
  manufacturingOrderController.updateManufacturingOrder
);

// Delete manufacturing order (requires admin role)
router.delete('/orders/:id',
  requireRole(['ADMIN']),
  manufacturingOrderController.deleteManufacturingOrder
);

export default router;