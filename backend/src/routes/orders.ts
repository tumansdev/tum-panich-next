import { Router, Request, Response } from 'express';
import pool from '../db';
import { upload, handleImageUpload } from '../middleware/upload';
import { Server } from 'socket.io';

const router = Router();

// Store io instance for real-time updates
let io: Server | null = null;
export const setIO = (ioInstance: Server) => {
  io = ioInstance;
};

// Generate order ID
const generateOrderId = (): string => {
  const timestamp = Date.now();
  return `TP${timestamp}`;
};

// GET /api/orders - Get all orders (Admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM orders';
    const params: (string | number)[] = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(String(status));
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(Number(limit));
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// GET /api/orders/user/:lineUserId - Get user's orders (LIFF)
router.get('/user/:lineUserId', async (req: Request, res: Response) => {
  try {
    const { lineUserId } = req.params;
    const result = await pool.query(
      'SELECT * FROM orders WHERE line_user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [lineUserId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// POST /api/orders - Create new order (LIFF)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      items,
      total_amount,
      customer_name,
      customer_phone,
      line_user_id,
      delivery_type,
      delivery_address,
      landmark,
      distance_km,
      payment_method,
      note,
    } = req.body;
    
    const orderId = generateOrderId();
    
    const result = await pool.query(`
      INSERT INTO orders (
        id, items, total_amount, customer_name, customer_phone,
        line_user_id, delivery_type, delivery_address, landmark,
        distance_km, payment_method, note
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      orderId,
      JSON.stringify(items),
      total_amount,
      customer_name,
      customer_phone,
      line_user_id,
      delivery_type,
      delivery_address,
      landmark,
      distance_km,
      payment_method,
      note,
    ]);
    
    const newOrder = result.rows[0];
    
    // Log status history
    await pool.query(
      'INSERT INTO order_status_history (order_id, status) VALUES ($1, $2)',
      [orderId, 'pending']
    );
    
    // Emit real-time event to Admin
    if (io) {
      io.emit('new_order', newOrder);
    }
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'cooking', 'ready', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const updatedOrder = result.rows[0];
    
    // Log status history
    await pool.query(
      'INSERT INTO order_status_history (order_id, status) VALUES ($1, $2)',
      [id, status]
    );
    
    // Emit real-time event to LIFF
    if (io) {
      io.to(`order_${id}`).emit('order_status_updated', updatedOrder);
      io.emit('order_updated', updatedOrder); // For admin dashboard
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// POST /api/orders/:id/slip - Upload payment slip (LIFF)
router.post('/:id/slip',
  upload.single('slip'),
  handleImageUpload('slips'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const slipUrl = req.body.imageUrl;
      
      if (!slipUrl) {
        return res.status(400).json({ error: 'No slip image provided' });
      }
      
      const result = await pool.query(
        'UPDATE orders SET slip_image_url = $1, payment_status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [slipUrl, 'paid', id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const updatedOrder = result.rows[0];
      
      // Emit to admin
      if (io) {
        io.emit('order_updated', updatedOrder);
      }
      
      res.json({ message: 'Slip uploaded', order: updatedOrder });
    } catch (error) {
      console.error('Upload slip error:', error);
      res.status(500).json({ error: 'Failed to upload slip' });
    }
  }
);

// GET /api/orders/:id/history - Get order status history
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY changed_at ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ error: 'Failed to get order history' });
  }
});

export default router;
