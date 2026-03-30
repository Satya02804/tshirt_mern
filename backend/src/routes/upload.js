import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { authMiddleware } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.post('/', authMiddleware, checkPermission('create-products'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer);
    
    res.json({
      status: 'success',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: 'Upload failed', error: error.message });
  }
});

export default router;
