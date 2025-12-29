import { Router, Request, Response } from 'express';
import pool from '../db';
import { upload, handleImageUpload } from '../middleware/upload';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/menu - Get all menu items
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name as category_name, c.icon as category_icon
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY c.sort_order, m.sort_order
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Failed to get menu' });
  }
});

// GET /api/menu/:id - Get single menu item
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Failed to get menu item' });
  }
});

// POST /api/menu - Create menu item (Admin - Protected)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, name, description, price, image_url, category_id, options, available, is_special, sort_order } = req.body;
    
    const result = await pool.query(`
      INSERT INTO menu_items (id, name, description, price, image_url, category_id, options, available, is_special, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [id, name, description, price, image_url, category_id, options ? JSON.stringify(options) : null, available ?? true, is_special ?? false, sort_order ?? 0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// PUT /api/menu/:id - Update menu item (Admin - Protected)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, options, available, is_special, sort_order } = req.body;
    
    const result = await pool.query(`
      UPDATE menu_items 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          image_url = COALESCE($4, image_url),
          category_id = COALESCE($5, category_id),
          options = COALESCE($6, options),
          available = COALESCE($7, available),
          is_special = COALESCE($8, is_special),
          sort_order = COALESCE($9, sort_order),
          updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [name, description, price, image_url, category_id, options ? JSON.stringify(options) : null, available, is_special, sort_order, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE /api/menu/:id - Delete menu item (Admin - Protected)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json({ message: 'Menu item deleted', item: result.rows[0] });
  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// POST /api/menu/:id/upload - Upload menu image (Admin - Protected)
router.post('/:id/upload', 
  authMiddleware,
  upload.single('image'),
  handleImageUpload('menu'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const imageUrl = req.body.imageUrl;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'No image provided' });
      }
      
      const result = await pool.query(
        'UPDATE menu_items SET image_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [imageUrl, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      
      res.json({ message: 'Image uploaded', item: result.rows[0] });
    } catch (error) {
      console.error('Upload menu image error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }
);

// PUT /api/menu/:id/toggle - Toggle availability (Admin - Protected)
router.put('/:id/toggle', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE menu_items SET available = NOT available, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Toggle menu error:', error);
    res.status(500).json({ error: 'Failed to toggle menu item' });
  }
});

export default router;
