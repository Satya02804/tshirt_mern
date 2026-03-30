import express from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductsByCategory, getAllCategories } from '../controllers/ProductController.js';
import { authMiddleware } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/category/:category', getProductsByCategory);

// Protected routes (admin only)
router.post('/', authMiddleware, checkPermission('create-products'), createProduct);
router.put('/:id', authMiddleware, checkPermission('edit-products'), updateProduct);
router.delete('/:id', authMiddleware, checkPermission('delete-products'), deleteProduct);

export default router;
