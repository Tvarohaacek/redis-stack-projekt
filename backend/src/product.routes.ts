import { Router } from 'express';
import { productController } from '../controllers/product.controller.';

const router = Router();

// Product routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Categories
router.get('/categories', productController.getCategories);

// Cache management
router.get('/cache/stats', productController.getCacheStats);
router.post('/cache/flush', productController.flushCache);

export default router;