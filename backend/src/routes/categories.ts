import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/categories - Get all categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY sort_order'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// POST /api/categories - Create category (Admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { id, name, icon, sort_order } = req.body;
    
    const result = await pool.query(`
      INSERT INTO categories (id, name, icon, sort_order)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id, name, icon, sort_order ?? 0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id - Update category (Admin)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, sort_order } = req.body;
    
    const result = await pool.query(`
      UPDATE categories 
      SET name = COALESCE($1, name),
          icon = COALESCE($2, icon),
          sort_order = COALESCE($3, sort_order)
      WHERE id = $4
      RETURNING *
    `, [name, icon, sort_order, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

export default router;
