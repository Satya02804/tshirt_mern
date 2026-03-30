import express from 'express';
import { getRoles, getPermissions, updateRolePermissions, createRole, deleteRole } from '../controllers/RoleController.js';
import { authMiddleware } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

// Get all roles
router.get('/', authMiddleware, checkPermission('update-permission'), getRoles);

// Create a new role
router.post('/', authMiddleware, checkPermission('create-permission'), createRole);

// Get all permissions
router.get('/permissions', authMiddleware, checkPermission('update-permission'), getPermissions);

// Update role permissions
router.put('/:id/permissions', authMiddleware, checkPermission('update-permission'), updateRolePermissions);

// Delete role
router.delete('/:id', authMiddleware, checkPermission('delete-role'), deleteRole);

export default router;
