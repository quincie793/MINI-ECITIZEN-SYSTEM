import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import prisma from '../lib/prisma';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// 2. Set up Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mini_ecitizen',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

const upload = multer({ storage });

// 3. POST route with better error logging
router.post('/', protect, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { category, location, description } = req.body;
    
    // req.file.path contains the full Cloudinary URL
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
    console.error("SUBMIT REQUEST ERROR:", error); // <-- This will show in Render logs
    res.status(500).json({ message: 'Failed to submit request' });
  }
});

export default router;