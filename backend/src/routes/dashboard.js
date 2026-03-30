import express from 'express';
import { getDashboardStats, getAllUsers, assignRole, deleteUser, getEarnings, getSalesAnalytics, getTopProducts, getUserGrowth } from '../controllers/DashboardController.js';
import { authMiddleware } from '../middleware/auth.js';
import { checkPermission, checkRole } from '../middleware/permissions.js';

const router = express.Router();

// All dashboard routes require authentication and dashboard permission
router.get('/stats', authMiddleware, checkPermission('view-dashboard'), getDashboardStats);
router.get('/users', authMiddleware, checkPermission('view-users'), getAllUsers);
router.get('/earnings', authMiddleware, checkPermission('view-earnings'), getEarnings);

// Analytics
router.get('/analytics/sales', authMiddleware, checkPermission('view-dashboard'), getSalesAnalytics);
router.get('/analytics/top-products', authMiddleware, checkPermission('view-dashboard'), getTopProducts);
router.get('/analytics/user-growth', authMiddleware, checkPermission('view-dashboard'), getUserGrowth);

// Role management (super-admin only)
router.post('/users/assign-role', authMiddleware, checkRole('super-admin'), assignRole);

// User deletion
router.delete('/users/:id', authMiddleware, checkPermission('delete-users'), deleteUser);

export default router;
