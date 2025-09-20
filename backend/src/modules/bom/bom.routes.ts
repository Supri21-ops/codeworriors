import { Router } from 'express';
import { BomController } from './bom.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const bomController = new BomController();

// All BOM routes require authentication
router.use(authMiddleware);

// BOM routes
router.get('/', bomController.getBoms);
router.get('/:id', bomController.getBomById);
router.post('/', bomController.createBom);
router.put('/:id', bomController.updateBom);
router.delete('/:id', bomController.deleteBom);

export default router;