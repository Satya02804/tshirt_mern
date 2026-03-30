import express from 'express';
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, downloadInvoice } from '../controllers/OrderController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

// User routes
router.post('/', optionalAuth, placeOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id/invoice', authMiddleware, downloadInvoice);

// Admin routes
router.get('/', authMiddleware, checkPermission('view-orders'), getAllOrders);

router.put('/:id/status', authMiddleware, checkPermission('update-order-status'), updateOrderStatus);
export default router;
