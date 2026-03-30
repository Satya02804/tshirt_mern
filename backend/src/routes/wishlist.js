import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as WishlistController from '../controllers/WishlistController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/add', WishlistController.addToWishlist);
router.delete('/remove/:productId', WishlistController.removeFromWishlist);
router.get('/', WishlistController.getWishlist);
router.get('/status/:productId', WishlistController.checkWishlistStatus);

export default router;
