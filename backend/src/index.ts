import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import menuRoutes from './routes/menu';
import categoriesRoutes from './routes/categories';
import ordersRoutes, { setIO } from './routes/orders';
import announcementsRoutes from './routes/announcements';
import webhookRoutes from './routes/webhook';
import authRoutes from './routes/auth';
import pool from './db';

const app = express();
const httpServer = createServer(app);

// CORS Configuration - Whitelist specific origins
const ALLOWED_ORIGINS = [
  'https://tumpanich.com',
  'https://www.tumpanich.com',
  'https://admin.tumpanich.com',
  'https://liff.line.me',
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.LIFF_URL || 'http://localhost:5174',
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});

// Pass io instance to orders route for real-time events
setIO(io);

const port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check
app.get('/', (_req: Request, res: Response) => {
  res.send('Tum Panich API is running');
});

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ status: 'error', message });
  }
});

// Public API Routes (no auth required)
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/announcements', announcementsRoutes);

// LINE Webhook (uses raw body parser, must be before JSON parser on this route)
app.use('/api/webhook', webhookRoutes);

// Socket.IO Connection Handling
io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);

  // Join order room for status updates
  socket.on('join_order', (orderId: string) => {
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined order_${orderId}`);
  });

  // Leave order room
  socket.on('leave_order', (orderId: string) => {
    socket.leave(`order_${orderId}`);
  });

  // Admin room for all order updates
  socket.on('join_admin', () => {
    socket.join('admin');
    console.log(`Socket ${socket.id} joined admin room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Start server
httpServer.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📁 Uploads directory: ${path.join(process.cwd(), 'uploads')}`);
  console.log(`🔒 CORS origins: ${ALLOWED_ORIGINS.join(', ')}`);
});

export { io };

