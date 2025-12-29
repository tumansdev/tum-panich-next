import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

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
      VALUES ('status', '{"isOpen": true, "message": ""}')
      ON CONFLICT (key) DO NOTHING;
    `);
    client.release();
    console.log('✅ Store settings table initialized');
  } catch (err) {
    console.error('Failed to init store settings:', err);
  }
};

// Run init
initTable();

// GET /api/store/status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT value FROM store_settings WHERE key = $1', ['status']);
    if (result.rows.length === 0) {
      return res.json({ isOpen: true, message: '' });
    }
    res.json(result.rows[0].value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch store status' });
  }
});

// POST /api/store/status (Admin only - technically)
router.post('/status', async (req: Request, res: Response) => {
  const { isOpen, message } = req.body;
  
  if (typeof isOpen !== 'boolean') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const value = { isOpen, message: message || '' };
    await pool.query(
      `INSERT INTO store_settings (key, value, updated_at)
       VALUES ('status', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(value)]
    );
    res.json({ success: true, ...value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update store status' });
  }
});

export default router;
