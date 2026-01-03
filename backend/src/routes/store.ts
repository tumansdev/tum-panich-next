import { Router, Request, Response } from 'express';
import pool from '../db';
import { Server } from 'socket.io';

const router = Router();

// Socket.IO instance (injected from index.ts)
let io: Server | null = null;

export const setSocketIO = (socketIO: Server) => {
  io = socketIO;
};

// Ensure table exists
const initTable = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Insert default status if not exists
      INSERT INTO store_settings (key, value)
      VALUES 
        ('status', '{"isOpen": true, "message": "", "closeTime": null}'),
        ('hours', '{"weekday": {"open": "10:00", "close": "14:00"}, "sunday": "ปิด"}'),
        ('special_menu', '{"active": false, "title": "", "description": "", "emoji": ""}')
      ON CONFLICT (key) DO NOTHING;
    `);
    client.release();
    if (process.env.NODE_ENV === 'development') {
      console.debug('✅ Store settings table initialized');
    }
  } catch (err) {
    console.error('Failed to init store settings:', err);
  }
};

// Run init
initTable();

// GET /api/store/status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const statusResult = await pool.query('SELECT value FROM store_settings WHERE key = $1', ['status']);
    const hoursResult = await pool.query('SELECT value FROM store_settings WHERE key = $1', ['hours']);
    
    const status = statusResult.rows[0]?.value || { isOpen: true, message: '', closeTime: null };
    const hours = hoursResult.rows[0]?.value || { weekday: { open: '10:00', close: '14:00' }, sunday: 'ปิด' };
    
    // Calculate time until close
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    
    let closeTimeStr = null;
    let minutesUntilClose = null;
    
    if (dayOfWeek !== 0 && status.isOpen) { // Not Sunday and open
      closeTimeStr = status.closeTime || hours.weekday.close;
      const [hours24, mins] = closeTimeStr.split(':').map(Number);
      const closeDate = new Date(now);
      closeDate.setHours(hours24, mins, 0, 0);
      
      minutesUntilClose = Math.floor((closeDate.getTime() - now.getTime()) / 60000);
      if (minutesUntilClose < 0) minutesUntilClose = 0;
    }
    
    res.json({
      ...status,
      hours,
      closeTimeStr,
      minutesUntilClose,
      isSunday: dayOfWeek === 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch store status' });
  }
});

// POST /api/store/status (Admin only)
router.post('/status', async (req: Request, res: Response) => {
  const { isOpen, message, closeTime } = req.body;
  
  if (typeof isOpen !== 'boolean') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const value = { isOpen, message: message || '', closeTime: closeTime || null };
    await pool.query(
      `INSERT INTO store_settings (key, value, updated_at)
       VALUES ('status', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(value)]
    );
    
    // 📡 Emit real-time update to all customers
    if (io) {
      io.to('store_status').emit('store_status_changed', value);
      console.log('📡 Store status changed:', isOpen ? 'OPEN' : 'CLOSED');
    }
    
    res.json({ success: true, ...value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update store status' });
  }
});

// POST /api/store/hours (Admin only)
router.post('/hours', async (req: Request, res: Response) => {
  const { weekday, sunday } = req.body;
  
  try {
    const value = { weekday, sunday };
    await pool.query(
      `INSERT INTO store_settings (key, value, updated_at)
       VALUES ('hours', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(value)]
    );
    res.json({ success: true, ...value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update store hours' });
  }
});

// GET /api/store/special-menu
router.get('/special-menu', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT value FROM store_settings WHERE key = $1', ['special_menu']);
    res.json(result.rows[0]?.value || { active: false, title: '', description: '', emoji: '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch special menu' });
  }
});

// POST /api/store/special-menu (Admin only)
router.post('/special-menu', async (req: Request, res: Response) => {
  const { active, title, description, emoji } = req.body;
  
  try {
    const value = { active: !!active, title: title || '', description: description || '', emoji: emoji || '🍜' };
    await pool.query(
      `INSERT INTO store_settings (key, value, updated_at)
       VALUES ('special_menu', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(value)]
    );
    res.json({ success: true, ...value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update special menu' });
  }
});

export default router;
