import { Router } from 'express';
import { ProductController } from './product.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const productController = new ProductController();

// All product routes require authentication
router.use(authMiddleware);

// Product routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;