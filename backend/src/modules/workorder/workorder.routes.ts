import { Router } from 'express';
import { WorkOrderController } from './workorder.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const workOrderController = new WorkOrderController();

// All work order routes require authentication
router.use(authMiddleware);

// Work order routes
router.get('/', workOrderController.getWorkOrders);
router.get('/:id', workOrderController.getWorkOrderById);
router.post('/', workOrderController.createWorkOrder);
router.put('/:id', workOrderController.updateWorkOrder);
router.delete('/:id', workOrderController.deleteWorkOrder);

// Work order status management
router.patch('/:id/start', workOrderController.startWorkOrder);
router.patch('/:id/pause', workOrderController.pauseWorkOrder);
router.patch('/:id/complete', workOrderController.completeWorkOrder);
router.patch('/:id/cancel', workOrderController.cancelWorkOrder);

export default router;