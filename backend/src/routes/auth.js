import express from 'express';
import { register, login, forgotPassword, resetPassword, getProfile, updateProfile, uploadAvatar, changePassword, getAllUsers, updateUserRole, deleteUser } from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import passport from 'passport';
import { generateToken } from '../utils/jwt.js';
import { checkPermission, checkRole } from '../middleware/permissions.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/profile/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.put('/change-password', authMiddleware, changePassword);
router.get('/refresh-permissions', authMiddleware, getProfile); // Reuse getProfile to get fresh permissions

// Admin routes
router.get('/users', authMiddleware, checkPermission('view-users'), getAllUsers);
router.put('/users/:id/role', authMiddleware, checkRole('super-admin'), updateUserRole);
router.delete('/users/:id', authMiddleware, checkPermission('delete-users'), deleteUser);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    // Successful authentication
    const user = req.user;
    
    // Generate token
    const token = generateToken(user.id);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
  }
);

export default router;
