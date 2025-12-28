import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/announcements - Get all active announcements
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM special_announcements WHERE active = true ORDER BY day_of_week'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Failed to get announcements' });
  }
});

// GET /api/announcements/today - Get today's special menu
router.get('/today', async (_req: Request, res: Response) => {
  try {
    const dayOfWeek = new Date().getDay(); // 0 = Sunday
    const result = await pool.query(
      'SELECT * FROM special_announcements WHERE day_of_week = $1 AND active = true',
      [dayOfWeek]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Get today announcement error:', error);
    res.status(500).json({ error: 'Failed to get today announcement' });
  }
});

// PUT /api/announcements - Batch update announcements (Admin)
router.put('/', async (req: Request, res: Response) => {
  try {
    const { announcements } = req.body;
    
    if (!Array.isArray(announcements)) {
      return res.status(400).json({ error: 'Announcements must be an array' });
    }
    
    // Update each announcement
    for (const ann of announcements) {
      await pool.query(`
        INSERT INTO special_announcements (day_of_week, menu_name, emoji, active)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (day_of_week) 
        DO UPDATE SET menu_name = $2, emoji = $3, active = $4
      `, [ann.day_of_week, ann.menu_name, ann.emoji, ann.active ?? true]);
    }
    
    // Return updated list
    const result = await pool.query(
      'SELECT * FROM special_announcements ORDER BY day_of_week'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Update announcements error:', error);
    res.status(500).json({ error: 'Failed to update announcements' });
  }
});

// PUT /api/announcements/:dayOfWeek - Update single day announcement (Admin)
router.put('/:dayOfWeek', async (req: Request, res: Response) => {
  try {
    const dayOfWeek = parseInt(req.params.dayOfWeek);
    const { menu_name, emoji, active } = req.body;
    
    const result = await pool.query(`
      UPDATE special_announcements 
      SET menu_name = COALESCE($1, menu_name),
          emoji = COALESCE($2, emoji),
          active = COALESCE($3, active)
      WHERE day_of_week = $4
      RETURNING *
    `, [menu_name, emoji, active, dayOfWeek]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

export default router;
