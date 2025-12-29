-- Admin Users Table for JWT Authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
-- Hash generated with bcrypt salt 10: $2a$10$rYmKkQmNp.XxFsP0EjWmJOQ8VGE8M5Cj5VvXAQMC5KwQ5K7mZH9Gy
INSERT INTO admin_users (username, password_hash, display_name, role)
VALUES ('admin', '$2a$10$rYmKkQmNp.XxFsP0EjWmJOQ8VGE8M5Cj5VvXAQMC5KwQ5K7mZH9Gy', 'ผู้ดูแลระบบ', 'admin')
ON CONFLICT (username) DO NOTHING;
