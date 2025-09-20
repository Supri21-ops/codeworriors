import { Router } from 'express';
import { StockController } from './stock.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const stockController = new StockController();

// All stock routes require authentication
router.use(authMiddleware);

// Stock routes
router.get('/items', stockController.getStockItems);
router.get('/items/:id', stockController.getStockItemById);
router.post('/items', stockController.createStockItem);
router.put('/items/:id', stockController.updateStockItem);
router.delete('/items/:id', stockController.deleteStockItem);

// Stock movement routes
router.get('/movements', stockController.getStockMovements);
router.post('/movements', stockController.createStockMovement);

// Inventory reports
router.get('/reports/summary', stockController.getStockSummary);
router.get('/reports/low-stock', stockController.getLowStockItems);

export default router;