import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

// They must be logged in AND be an admin
router.use(protect, adminOnly);

// 1. Get all requests (with user details)
router.get('/requests', async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true }, // Don't send passwords back!
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// 2. Update request status
router.patch(
  '/requests/:id/status',
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      if (!['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const updatedRequest = await prisma.serviceRequest.update({
        where: { id: Number(id) },
        data: { status },
      });

      res.json({ success: true, request: updatedRequest });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update status' });
    }
  }
);

// 3. Get Analytics (Counts)
router.get('/analytics', async (req: AuthRequest, res: Response) => {
  try {
    const pending = await prisma.serviceRequest.count({
      where: { status: 'PENDING' },
    });
    const inProgress = await prisma.serviceRequest.count({
      where: { status: 'IN_PROGRESS' },
    });
    const resolved = await prisma.serviceRequest.count({
      where: { status: 'RESOLVED' },
    });

    res.json({
      pending,
      inProgress,
      resolved,
      total: pending + inProgress + resolved,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;
