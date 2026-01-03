import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import menuRoutes from './routes/menu';
import categoriesRoutes from './routes/categories';
import ordersRoutes, { setIO } from './routes/orders';
import announcementsRoutes from './routes/announcements';
import storeRoutes from './routes/store';
import webhookRoutes from './routes/webhook';
import authRoutes from './routes/auth';
import pool from './db';
import { setSocketIO as setStoreSocketIO } from './routes/store';

const app = express();
const httpServer = createServer(app);

// ======================
// SECURITY CONFIGURATION
// ======================

// Helmet - Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images from uploads
  contentSecurityPolicy: false, // Disable for API server
}));

// Compression - Gzip responses
app.use(compression());

// Rate Limiting - Prevent DDoS/Brute Force
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Only 10 login attempts per window
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limit to all requests
app.use(generalLimiter);

// ======================
// CORS CONFIGURATION
// ======================

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
// Pass io instance to store route for real-time store status
setStoreSocketIO(io);

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

app.use(express.json({ limit: '10mb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ======================
// HEALTH CHECK
// ======================

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

// ======================
// API ROUTES
// ======================

// Auth routes with stricter rate limit
app.use('/api/auth', authLimiter, authRoutes);

// Public API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/store', storeRoutes);

// LINE Webhook (uses raw body parser, must be before JSON parser on this route)
app.use('/api/webhook', webhookRoutes);

// ======================
// SOCKET.IO
// ======================

io.on('connection', (socket: Socket) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug('Client connected:', socket.id);
  }

  // Join order room for status updates
  socket.on('join_order', (orderId: string) => {
    socket.join(`order_${orderId}`);
  });

  // Leave order room
  socket.on('leave_order', (orderId: string) => {
    socket.leave(`order_${orderId}`);
  });

  // Admin room for all order updates
  socket.on('join_admin', () => {
    socket.join('admin');
  });

  // 🏪 Store status room - customers join to receive realtime updates
  socket.on('join_store_status', () => {
    socket.join('store_status');
  });

  socket.on('disconnect', () => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Client disconnected:', socket.id);
    }
  });
});

// ======================
// ERROR HANDLING
// ======================

app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' }); // Don't expose error details
});

// ======================
// GRACEFUL SHUTDOWN
// ======================

function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Closing HTTP server...`);
  httpServer.close(() => {
    console.log('HTTP server closed.');
    pool.end(() => {
      console.log('Database pool closed.');
      process.exit(0);
    });
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ======================
// START SERVER
// ======================

httpServer.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📁 Uploads directory: ${path.join(process.cwd(), 'uploads')}`);
  console.log(`🔒 Security: Helmet + Rate Limiting + Compression enabled`);
});

export { io };
