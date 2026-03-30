import express from 'express';
import { addAddress, getAddresses, updateAddress, deleteAddress } from '../controllers/AddressController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware); // Protect all routes

router.post('/', addAddress);
router.get('/', getAddresses);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
