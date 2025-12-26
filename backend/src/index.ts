import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
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
app.get('/', (req, res) => {
  res.send('Tum Panich API is running');
});

app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Example: Order Status Update
  socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
