import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  console.log('Starting database migration...');
  
  // Create enquiries table
  await sql`
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      message TEXT NOT NULL,
      service VARCHAR(100),
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created enquiries table');

  // Create settings table
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created settings table');

  // Create products table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      price DECIMAL(10,2),
      image_url TEXT,
      features TEXT,
      specifications TEXT,
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created products table');

  // Create services table
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      short_description TEXT,
      icon VARCHAR(100),
      image_url TEXT,
      features TEXT,
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created services table');

  // Create printing_items table
  await sql`
    CREATE TABLE IF NOT EXISTS printing_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      base_price DECIMAL(10,2),
      image_url TEXT,
      options TEXT,
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created printing_items table');

  // Create blog_categories table
  await sql`
    CREATE TABLE IF NOT EXISTS blog_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created blog_categories table');

  // Create blog_posts table
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT,
      excerpt TEXT,
      featured_image TEXT,
      category_id INTEGER REFERENCES blog_categories(id),
      status VARCHAR(50) DEFAULT 'draft',
      author VARCHAR(255),
      meta_title VARCHAR(255),
      meta_description TEXT,
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created blog_posts table');

  // Create blog_media table
  await sql`
    CREATE TABLE IF NOT EXISTS blog_media (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255),
      mime_type VARCHAR(100),
      size INTEGER,
      url TEXT NOT NULL,
      alt_text VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Created blog_media table');

  // Insert default settings
  const defaultSettings = [
    ['site_name', 'Solar Energy Solutions'],
    ['site_description', 'Leading provider of solar energy solutions'],
    ['contact_email', 'info@solarenergy.com'],
    ['contact_phone', '+1 234 567 890'],
    ['contact_address', '123 Solar Street, Energy City'],
    ['social_facebook', ''],
    ['social_twitter', ''],
    ['social_linkedin', ''],
    ['social_instagram', '']
  ];

  for (const [key, value] of defaultSettings) {
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `;
  }
  console.log('Inserted default settings');

  // Insert default blog categories
  const defaultCategories = [
    ['Solar Technology', 'solar-technology', 'Latest in solar technology'],
    ['Energy Savings', 'energy-savings', 'Tips and guides for saving energy'],
    ['Industry News', 'industry-news', 'News from the solar industry'],
    ['Case Studies', 'case-studies', 'Real-world solar installations']
  ];

  for (const [name, slug, description] of defaultCategories) {
    await sql`
      INSERT INTO blog_categories (name, slug, description)
      VALUES (${name}, ${slug}, ${description})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log('Inserted default blog categories');

  console.log('Migration completed successfully!');
}

runMigration().catch(console.error);
