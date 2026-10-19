import express from 'express';
import cors from 'cors';
import path from 'path';

// Import your routes
import authRoutes from './routes/auth.routes';
import requestRoutes from './routes/request.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173', 
      'https://mini-ecitizen-system-yec2.vercel.app' 
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// Welcome Route (for the base URL)
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to the Mini eCitizen API. Please use /api/health or the Vercel frontend.' });
});

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Mini eCitizen API is running!',
  });
});

// Global Error Handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
);

export default app;