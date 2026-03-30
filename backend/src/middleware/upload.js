import multer from 'multer';
import path from 'path';

// Multer storage in memory so we can resize it with sharp directly before saving
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png) are allowed!'), false);
    }
};

// Initialize upload middleware
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    Error:"image smaller than 5MB",
    fileFilter
});
