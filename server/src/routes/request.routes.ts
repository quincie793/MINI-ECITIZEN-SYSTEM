import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import prisma from '../lib/prisma';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && cloudApiKey && cloudApiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudApiSecret,
  });
} else {
  console.warn(
    'Cloudinary configuration is incomplete. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file.'
  );
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mini_ecitizen',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

const upload = multer({ storage });

// 1. GET MY REQUESTS (Fixing the 404)
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

// 2. POST NEW REQUEST (Fixing the 500)
router.post('/', protect, (req, res, next) => {
  // Wrap multer to catch Cloudinary upload errors
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("IMAGE UPLOAD ERROR:", err); // THIS WILL SHOW IN RENDER LOGS
      return res.status(500).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, async (req: AuthRequest, res: Response) => {
  try {
    const { category, location, description } = req.body;
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
    console.error("SUBMIT REQUEST DB ERROR:", error);
    res.status(500).json({ message: 'Failed to submit request' });
  }
});

export default router;