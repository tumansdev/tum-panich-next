import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/login - Admin login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณากรอก username และ password' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1 AND active = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
});

/**
 * GET /api/auth/me - Get current user info
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      'SELECT id, username, display_name, role FROM admin_users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      role: user.role,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

/**
 * POST /api/auth/change-password - Change password
 */
router.post('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'กรุณากรอกรหัสผ่านให้ครบ' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
    }

    // Get current user
    const result = await pool.query(
      'SELECT password_hash FROM admin_users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, userId]
    );

    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

/**
 * POST /api/auth/refresh - Refresh JWT token
 * Returns a new token if current token is valid
 */
router.post('/refresh', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    // Verify user still exists and is active
    const result = await pool.query(
      'SELECT id, username, display_name, role FROM admin_users WHERE id = $1 AND active = true',
      [user.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'ผู้ใช้ไม่ถูกต้อง' });
    }

    const dbUser = result.rows[0];

    // Generate new token
    const newToken = generateToken({
      id: dbUser.id,
      username: dbUser.username,
      role: dbUser.role,
    });

    res.json({
      token: newToken,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        displayName: dbUser.display_name,
        role: dbUser.role,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการรีเฟรช Token' });
  }
});

export default router;
