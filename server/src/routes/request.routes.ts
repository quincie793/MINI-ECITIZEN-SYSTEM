import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import prisma from '../lib/prisma';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
  // Add 'as string' to satisfy TypeScript's strict mode
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// --- MULTER CONFIGURATION (For Cloudinary Upload) ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mini_ecitizen', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any, // The 'as any' here prevents type errors with multer-storage-cloudinary
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// --- ROUTES ---

// 1. Submit a new request (Citizen)
router.post(
  '/',
  protect,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { category, location, description } = req.body;

      // Cloudinary returns the full secure URL in req.file.path
      const imageUrl = req.file ? req.file.path : null;

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