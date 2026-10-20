import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '../lib/prisma';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Configure Cloudinary - Added 'as string' to fix the TypeScript error
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET MY REQUESTS
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

// POST NEW REQUEST
router.post('/', protect, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { category, location, description } = req.body;
    let imageUrl = null;

    // If an image was uploaded, send it to Cloudinary
    if (req.file) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'mini_ecitizen' },
          (error, result) => {
            if (error) {
              console.error("CLOUDINARY STREAM ERROR:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        // Send the file buffer to Cloudinary
        uploadStream.end(req.file!.buffer);
      });
      
      imageUrl = uploadResult.secure_url;
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
    console.error("SUBMIT REQUEST ERROR:", error);
    res.status(500).json({ message: 'Failed to submit request', error });
  }
});

export default router;