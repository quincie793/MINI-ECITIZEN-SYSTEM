import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../lib/prisma';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// --- MULTER CONFIGURATION (For Image Upload) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename: timestamp-originalName
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

// --- ROUTES ---

// 1. Submit a new request (Citizen)
// "protect" ensures they are logged in. "upload.single('image')" handles the file.
router.post(
  '/',
  protect,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { category, location, description } = req.body;

      // If a file was uploaded, get its path. Otherwise, null.
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const newRequest = await prisma.serviceRequest.create({
        data: {
          category,
          location,
          description,
          imageUrl,
          userId: req.user!.id,
        },
      });

      res.status(201).json({ success: true, request: newRequest });
    } catch (error) {
      console.log('SUBMIT REQUEST ERROR:', error);
      res.status(500).json({ message: 'Failed to submit request' });
    }
  }
);

// 2. Get logged-in citizen's requests
router.get('/my-requests', protect, async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

export default router;
