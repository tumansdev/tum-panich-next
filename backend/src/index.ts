import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Routes
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

// Socket.io
io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Example: Order Status Update
  socket.on('join_order', (orderId: string) => {
      socket.join(`order_${orderId}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
