-- Tum Panich Database Schema
-- Run this script in PostgreSQL

-- Drop tables if exist (for fresh start)
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS special_announcements CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories Table
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE menu_items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category_id VARCHAR(50) REFERENCES categories(id),
  options JSONB,
  available BOOLEAN DEFAULT true,
  is_special BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Special Announcements (เมนูพิเศษประจำวัน)
CREATE TABLE special_announcements (
  id SERIAL PRIMARY KEY,
  day_of_week INT NOT NULL,  -- 0 = Sunday, 1 = Monday, etc.
  menu_name VARCHAR(200) NOT NULL,
  emoji VARCHAR(10),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20),
  line_user_id VARCHAR(100),
  delivery_type VARCHAR(20) NOT NULL,
  delivery_address TEXT,
  landmark VARCHAR(200),
  distance_km DECIMAL(5,2),
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  slip_image_url VARCHAR(500),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Status History
CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_menu_items_special ON menu_items(is_special);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_line_user ON orders(line_user_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_updated ON orders(updated_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_order_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_history_time ON order_status_history(changed_at DESC);

-- Admin Users Table (for POS authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'staff',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Insert default admin (password: admin123 - change in production!)
INSERT INTO admin_users (username, password_hash, role) VALUES
  ('admin', '$2a$10$rHQgKXBGGZdxL3FxqzQcQeZ8qYb3XqZ9Y5q8Y5q8Y5q8Y5q8Y5q8Y', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Store Settings Table (for open/close status)
CREATE TABLE IF NOT EXISTS store_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value VARCHAR(500),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default store status
INSERT INTO store_settings (setting_key, setting_value) VALUES
  ('is_open', 'true'),
  ('open_message', 'ร้านเปิดให้บริการปกติครับ'),
  ('close_message', 'ขออภัยครับ ร้านปิดทำการชั่วคราว')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Default Categories
INSERT INTO categories (id, name, icon, sort_order) VALUES
  ('rice', 'ข้าว', '🍚', 1),
  ('noodle', 'ก๋วยเตี๋ยว', '🍜', 2),
  ('drink', 'เครื่องดื่ม', '🥤', 3),
  ('special', 'เมนูพิเศษ', '⭐', 4);

-- Insert Default Special Announcements
INSERT INTO special_announcements (day_of_week, menu_name, emoji, active) VALUES
  (1, 'หมูแดงพิเศษ + ไข่ลวก', '🥩', true),
  (2, 'ก๋วยเตี๋ยวต้มยำรวมมิตร', '🌶️', true),
  (3, 'บะหมี่หมูกรอบน้ำ', '🍜', true),
  (4, 'เส้นหมี่หมูแดงแห้ง', '🥢', true),
  (5, 'ก๋วยเตี๋ยวหมูตุ๋น', '🍲', true),
  (6, 'รวมมิตรหมูแดง+หมูกรอบ', '🎉', true);

-- Insert Default Menu Items (from LIFF hardcoded data)
INSERT INTO menu_items (id, name, description, price, image_url, category_id, options, available, sort_order) VALUES
  ('rice-1', 'ข้าวหมูแดงสันคอ', 'หมูแดงสันคอหั่นชิ้น ราดน้ำจิ้ม เสิร์ฟพร้อมข้าวสวยร้อน', 50, '/images/rice-red-pork.jpg', 'rice', NULL, true, 1),
  ('rice-2', 'ข้าวหมูแดงสามชั้น', 'หมูสามชั้นชุบซอสหมูแดง เนื้อนุ่มมัน', 60, '/images/rice-belly.jpg', 'rice', NULL, true, 2),
  ('rice-3', 'ข้าวหมูกรอบ', 'หมูกรอบทอดกรอบนอกนุ่มใน ราดน้ำจิ้ม', 60, '/images/rice-crispy.jpg', 'rice', NULL, true, 3),
  ('rice-4', 'ข้าวหมูแดงสันคอ + หมูกรอบ', 'รวมความอร่อย หมูแดงสันคอ + หมูกรอบ', 70, '/images/rice-combo1.jpg', 'rice', NULL, true, 4),
  ('rice-5', 'ข้าวหมูแดงสามชั้น + หมูกรอบ', 'จัดเต็ม! หมูแดงสามชั้น + หมูกรอบ', 80, '/images/rice-combo2.jpg', 'rice', NULL, true, 5),
  
  ('noodle-1', 'บะหมี่เกี๊ยวแห้งหมูแดง ไข่ยางมะตูม', 'บะหมี่เกี๊ยวหมูแดง เสิร์ฟพร้อมไข่ยางมะตูม', 50, '/images/noodle-egg.jpg', 'noodle', '{"id":"noodle-type","name":"เลือกเส้น","choices":["เส้นเล็ก","เส้นใหญ่","บะหมี่","วุ้นเส้น"],"required":true}', true, 1),
  ('noodle-2', 'ก๋วยเตี๋ยวต้มยำ', 'ก๋วยเตี๋ยวน้ำต้มยำ รสจัดจ้าน', 40, '/images/noodle-tomyum.jpg', 'noodle', '{"id":"noodle-type","name":"เลือกเส้น","choices":["เส้นเล็ก","เส้นใหญ่","บะหมี่","วุ้นเส้น"],"required":true}', true, 2),
  ('noodle-3', 'ก๋วยเตี๋ยวต้มจืด', 'ก๋วยเตี๋ยวน้ำใส รสกลมกล่อม', 40, '/images/noodle-clear.jpg', 'noodle', '{"id":"noodle-type","name":"เลือกเส้น","choices":["เส้นเล็ก","เส้นใหญ่","บะหมี่","วุ้นเส้น"],"required":true}', true, 3),
  ('noodle-4', 'ก๋วยเตี๋ยวเย็นตาโฟ', 'ก๋วยเตี๋ยวน้ำแดงเย็นตาโฟ ใส่เต้าหู้ทอด', 45, '/images/noodle-yentafo.jpg', 'noodle', '{"id":"noodle-type","name":"เลือกเส้น","choices":["เส้นเล็ก","เส้นใหญ่","บะหมี่","วุ้นเส้น"],"required":true}', true, 4),
  
  ('drink-1', 'น้ำแข็ง', 'น้ำแข็งเปล่า', 0, '/images/ice.jpg', 'drink', NULL, true, 1),
  ('drink-2', 'น้ำเปล่า', 'น้ำดื่มบรรจุขวด', 10, '/images/water.jpg', 'drink', NULL, true, 2),
  ('drink-3', 'โค้กแช่เย็น', 'โค้กขวดแช่เย็น', 15, '/images/coke.jpg', 'drink', NULL, true, 3),
  ('drink-4', 'โค้กแก้วโดม', 'โค้กใส่แก้วโดม ใส่น้ำแข็ง', 25, '/images/coke-dome.jpg', 'drink', NULL, true, 4),
  ('drink-5', 'ชาไทยแบบขวด', 'ชาไทยหวานมัน บรรจุขวด', 30, '/images/thai-tea-bottle.jpg', 'drink', NULL, true, 5),
  ('drink-6', 'ชาไทยใส่แก้ว', 'ชาไทยชงสด ใส่แก้วพร้อมน้ำแข็ง', 40, '/images/thai-tea-glass.jpg', 'drink', NULL, true, 6);
