import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '../lib/prisma';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

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

    if (req.file) {
      try {
        // Convert the memory buffer to a Base64 string
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        // Upload directly
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: 'mini_ecitizen',
        });
        
        imageUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("CLOUDINARY ERROR:", cloudinaryError);
        return res.status(500).json({ message: 'Cloudinary upload failed' });
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
    console.error("SUBMIT REQUEST ERROR:", error);
    res.status(500).json({ message: 'Failed to submit request' });
  }
});

export default router;