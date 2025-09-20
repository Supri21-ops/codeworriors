import { Router } from 'express';
import { ManufacturingOrderController } from './mo.controller';
import { WorkOrderController } from '../workorder/workorder.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createManufacturingOrderSchema, updateManufacturingOrderSchema } from './dto';

const router = Router();
const manufacturingOrderController = new ManufacturingOrderController();
const workOrderController = new WorkOrderController();

// Get manufacturing order statistics (no auth required for dashboard stats)
router.get('/stats', manufacturingOrderController.getManufacturingOrderStats);

// All other routes require authentication
router.use(authMiddleware);

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

// Work order routes under manufacturing
router.get('/work-orders', workOrderController.getWorkOrders);
router.get('/work-orders/:id', workOrderController.getWorkOrderById);
router.post('/work-orders', 
  requireRole(['MANAGER', 'ADMIN', 'OPERATOR']),
  workOrderController.createWorkOrder
);
router.put('/work-orders/:id',
  requireRole(['MANAGER', 'ADMIN', 'OPERATOR']),
  workOrderController.updateWorkOrder
);
router.delete('/work-orders/:id',
  requireRole(['ADMIN']),
  workOrderController.deleteWorkOrder
);

// Work order status management
router.patch('/work-orders/:id/start',
  requireRole(['OPERATOR', 'MANAGER', 'ADMIN']),
  workOrderController.startWorkOrder
);
router.patch('/work-orders/:id/pause',
  requireRole(['OPERATOR', 'MANAGER', 'ADMIN']),
  workOrderController.pauseWorkOrder
);
router.patch('/work-orders/:id/complete',
  requireRole(['OPERATOR', 'MANAGER', 'ADMIN']),
  workOrderController.completeWorkOrder
);
router.patch('/work-orders/:id/cancel',
  requireRole(['MANAGER', 'ADMIN']),
  workOrderController.cancelWorkOrder
);

export default router;