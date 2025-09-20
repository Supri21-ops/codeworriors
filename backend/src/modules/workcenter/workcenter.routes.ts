import { Router } from 'express';
import { WorkCenterController } from './workcenter.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const workCenterController = new WorkCenterController();

// All work center routes require authentication
router.use(authMiddleware);

// Work center routes
router.get('/', workCenterController.getWorkCenters);
router.get('/:id', workCenterController.getWorkCenterById);
router.post('/', workCenterController.createWorkCenter);
router.put('/:id', workCenterController.updateWorkCenter);
router.delete('/:id', workCenterController.deleteWorkCenter);

// Work center capacity and utilization
router.get('/:id/capacity', workCenterController.getWorkCenterCapacity);
router.put('/:id/capacity', workCenterController.updateWorkCenterCapacity);

export default router;