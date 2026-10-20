import { Router, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
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
    'Cloudinary configuration is incomplete. Falling back to local uploads in /uploads.'
  );
}

const localUploadsDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(localUploadsDir, { recursive: true });

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mini_ecitizen',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, localUploadsDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage: cloudName && cloudApiKey && cloudApiSecret ? cloudStorage : localStorage,
});

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

    let imageUrl: string | null = null;

    if (req.file) {
      if (typeof req.file.path === 'string' && req.file.path.startsWith('http')) {
        imageUrl = req.file.path;
      } else if (typeof req.file.filename === 'string') {
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (typeof req.file.path === 'string') {
        const normalizedPath = req.file.path.replace(/\\/g, '/');
        const fileName = normalizedPath.includes('/uploads/')
          ? normalizedPath.split('/uploads/').pop()
          : path.basename(normalizedPath);

        imageUrl = fileName ? `/uploads/${fileName}` : null;
      }
    }

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