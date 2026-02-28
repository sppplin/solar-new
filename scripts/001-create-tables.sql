-- Create all tables for the Solar application
-- This script is idempotent (safe to run multiple times)

-- Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  company TEXT,
  product TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  price TEXT,
  moq TEXT,
  image_url TEXT,
  image_alt TEXT,
  badge TEXT,
  link TEXT,
  min_price INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP,
  author_id INTEGER,
  category_id INTEGER,
  featured_image TEXT,
  image_alt TEXT,
  reading_time INTEGER,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_name TEXT,
  tags TEXT,
  features TEXT,
  bg_color TEXT,
  link TEXT,
  display_order INTEGER DEFAULT 0
);

-- Printing items table
CREATE TABLE IF NOT EXISTS printing_items (
  id SERIAL PRIMARY KEY,
  section_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  moq TEXT,
  image_url TEXT,
  bg_color TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Blog media table
CREATE TABLE IF NOT EXISTS blog_media (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  mimetype TEXT,
  size INTEGER,
  alt_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings (using ON CONFLICT for upsert)
INSERT INTO settings (key, value) VALUES 
  ('logo_url', 'https://static.wixstatic.com/media/895e2c_99457844de4b481da7005c3e882ca1ec~mv2.jpg')
ON CONFLICT (key) DO NOTHING;

-- Insert default blog categories
INSERT INTO blog_categories (name, slug) VALUES 
  ('Industry News', 'industry-news'),
  ('Printing Tips', 'printing-tips'),
  ('Packaging Design', 'packaging-design'),
  ('Corporate Branding', 'corporate-branding')
ON CONFLICT (slug) DO NOTHING;
