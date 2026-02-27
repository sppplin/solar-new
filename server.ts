import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const db = new Database("enquiries.db");

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const prefix = req.path.includes("logo") ? "logo" : "product";
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".svg", ".png", ".jpg", ".jpeg", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .svg, .png, .jpg, .jpeg and .webp files are allowed"));
    }
  },
});

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    company TEXT,
    product TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_title TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'draft',
    published_at DATETIME,
    author_id INTEGER,
    category_id INTEGER,
    featured_image TEXT,
    image_alt TEXT,
    reading_time INTEGER,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  CREATE TABLE IF NOT EXISTS printing_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  CREATE TABLE IF NOT EXISTS blog_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS blog_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    mimetype TEXT,
    size INTEGER,
    alt_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Initialize default blog categories
const initCategories = db.prepare("INSERT OR IGNORE INTO blog_categories (name, slug) VALUES (?, ?)");
initCategories.run("Industry News", "industry-news");
initCategories.run("Printing Tips", "printing-tips");
initCategories.run("Packaging Design", "packaging-design");
initCategories.run("Corporate Branding", "corporate-branding");

// Initialize default settings
const initSettings = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
initSettings.run("logo_url", "https://static.wixstatic.com/media/895e2c_99457844de4b481da7005c3e882ca1ec~mv2.jpg");

// Initialize default products if table is empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const defaultProducts = [
    { name: 'Premium Rigid Gift Boxes', category: 'Packaging', sub_category: 'packaging', price: '₹ 45 – ₹ 250', moq: '500 pcs', badge: 'hot', image_url: '', image_alt: 'Premium Rigid Gift Boxes', link: '/packaging#rigid', min_price: 45 },
    { name: 'Mono Carton Packaging', category: 'Packaging', sub_category: 'packaging', price: '₹ 2 – ₹ 18', moq: '5,000 pcs', badge: 'popular', image_url: '', image_alt: 'Mono Carton Packaging', link: '/packaging#mono', min_price: 2 },
    { name: 'Cake & Custom Food Boxes', category: 'Food Packaging', sub_category: 'food', price: '₹ 15 – ₹ 80', moq: '200 pcs', badge: 'new', image_url: '', image_alt: 'Cake & Custom Food Boxes', link: '/packaging#food', min_price: 15 },
    { name: 'Retail 3D Display Units', category: 'Display Systems', sub_category: 'display', price: '₹ 2,500 – ₹ 25,000', moq: '10 units', badge: '', image_url: '', image_alt: 'Retail 3D Display Units', link: '/display-units', min_price: 2500 },
    { name: 'Coffee Table Books', category: 'Commercial Printing', sub_category: 'printing', price: '₹ 300 – ₹ 1,500', moq: '50 pcs', badge: '', image_url: '', image_alt: 'Coffee Table Books', link: '/printing#books', min_price: 300 },
    { name: 'Corporate Brochures & Catalogs', category: 'Printing', sub_category: 'printing', price: '₹ 8 – ₹ 120', moq: '500 pcs', badge: '', image_url: '', image_alt: 'Corporate Brochures & Catalogs', link: '/printing#brochures', min_price: 8 },
    { name: 'Hi-Gloss Lacquer Luxury Boxes', category: 'Luxury Packaging', sub_category: 'luxury', price: '₹ 120 – ₹ 800', moq: '200 pcs', badge: 'popular', image_url: '', image_alt: 'Hi-Gloss Lacquer Luxury Boxes', link: '/packaging#luxury', min_price: 120 },
    { name: 'Welcome & Business Kits', category: 'Corporate', sub_category: 'corporate', price: '₹ 250 – ₹ 2,000', moq: '100 kits', badge: 'new', image_url: '', image_alt: 'Welcome & Business Kits', link: '/printing#kits', min_price: 250 },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price)
    VALUES (@name, @category, @sub_category, @price, @moq, @image_url, @image_alt, @badge, @link, @min_price)
  `);

  const transaction = db.transaction((prods) => {
    for (const p of prods) insertProduct.run(p);
  });
  transaction(defaultProducts);
}

// Initialize default services if table is empty
try {
  // Check if new columns exist
  const tableInfo = db.prepare("PRAGMA table_info(services)").all() as any[];
  const hasFeatures = tableInfo.some(col => col.name === 'features');
  const hasBgColor = tableInfo.some(col => col.name === 'bg_color');
  
  if (!hasFeatures) {
    db.prepare("ALTER TABLE services ADD COLUMN features TEXT").run();
  }
  if (!hasBgColor) {
    db.prepare("ALTER TABLE services ADD COLUMN bg_color TEXT").run();
  }
} catch (e) {
  console.error("Error altering services table:", e);
}

const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
if (serviceCount.count === 0) {
  const defaultServices = [
    { 
      name: 'Offset Printing', 
      description: 'Our state-of-the-art offset printing facility delivers sharp, vibrant, and consistent print quality at scale.', 
      tags: JSON.stringify(['CMYK', 'Pantone', 'Spot UV', 'Foiling']), 
      features: JSON.stringify(['Multi-color CMYK and Pantone printing', 'Spot UV, matte/gloss lamination, foil stamping', 'High-resolution printing up to 300 DPI', 'Short runs to bulk production', 'Strict color proofing and QC processes']),
      bg_color: 'linear-gradient(135deg,var(--primary-light),var(--primary))',
      link: '/printing', 
      icon_name: 'Printer', 
      display_order: 1 
    },
    { 
      name: 'Custom Packaging', 
      description: 'From luxury rigid boxes to pharmaceutical mono cartons — we design and manufacture bespoke packaging.', 
      tags: JSON.stringify(['Rigid', 'Mono Carton', 'VAP', 'Eco-Friendly']), 
      features: JSON.stringify(['Rigid boxes, mono cartons, value added packs', 'Glass, metal, wooden and hi-gloss lacquer boxes', 'Gift boxes, cake boxes, food packaging', 'Custom structural design and prototyping', 'Eco-friendly and sustainable material options']),
      bg_color: 'linear-gradient(135deg,var(--gray-100),var(--secondary))',
      link: '/packaging', 
      icon_name: 'Package', 
      display_order: 2 
    },
    { 
      name: '3D Display Systems', 
      description: 'Eye-catching retail display units that drive brand visibility at POS.', 
      tags: JSON.stringify(['Floor Stands', 'Counter Units', 'Shelf Displays']), 
      features: JSON.stringify(['Custom structural design', 'High-strength corrugated board', 'Vibrant graphics', 'Easy assembly', 'Durable construction']),
      bg_color: 'linear-gradient(135deg,var(--primary-light),var(--primary))',
      link: '/display-units', 
      icon_name: 'Layout', 
      display_order: 3 
    },
    { 
      name: 'Graphic Design', 
      description: 'Our in-house creative team handles everything from packaging artwork to full brand identity.', 
      tags: JSON.stringify(['Packaging Design', 'Branding', 'Artwork']), 
      features: JSON.stringify(['Structural packaging design and dielines', 'Brand identity and logo design', 'Print-ready artwork preparation', '3D mockups and virtual proofs', 'Marketing collateral design']),
      bg_color: 'linear-gradient(135deg,var(--gray-100),var(--secondary))',
      link: '/services#design', 
      icon_name: 'Palette', 
      display_order: 4 
    },
    { 
      name: 'Product Photography', 
      description: 'Professional in-house photography studio for product and packaging shoots.', 
      tags: JSON.stringify(['E-commerce', 'Catalog Shoots', '360° View']), 
      features: JSON.stringify(['White background and lifestyle photography', '360° product photography', 'Packaging and unboxing photography', 'Post-processing and retouching', 'High-res files for web and print']),
      bg_color: 'linear-gradient(135deg,var(--primary-light),var(--primary))',
      link: '/services#photography', 
      icon_name: 'Camera', 
      display_order: 5 
    },
    { 
      name: 'Logistics & Warehousing', 
      description: 'End-to-end supply chain with warehousing and PAN India delivery.', 
      tags: JSON.stringify(['Warehousing', 'PAN India', 'Track & Trace']), 
      features: JSON.stringify(['In-house warehousing at our Noida facility', 'PAN India delivery via trusted courier partners', 'Real-time shipment tracking', 'Custom packaging for safe transit', 'Bulk storage and inventory management']),
      bg_color: 'linear-gradient(135deg,var(--gray-100),var(--secondary))',
      link: '/services#logistics', 
      icon_name: 'Truck', 
      display_order: 6 
    },
  ];

  const insertService = db.prepare(`
    INSERT INTO services (name, description, tags, features, bg_color, link, icon_name, display_order)
    VALUES (@name, @description, @tags, @features, @bg_color, @link, @icon_name, @display_order)
  `);

  const transaction = db.transaction((svcs) => {
    for (const s of svcs) insertService.run(s);
  });
  transaction(defaultServices);
}

// Initialize default printing items if table is empty
const printingItemCount = db.prepare("SELECT COUNT(*) as count FROM printing_items").get() as { count: number };
if (printingItemCount.count === 0) {
  const defaultPrintingItems = [
    { section_id: 'books', name: 'Coffee Table Books', description: 'Lavish, large-format books with premium paper and binding. Perfect for architecture, art, travel and brand showcases.', price_range: '₹ 300 – ₹ 1,500', moq: '50 pcs', bg_color: 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', icon_name: 'Book', display_order: 1 },
    { section_id: 'books', name: 'Photo Albums', description: 'Custom lay-flat and paged photo albums for weddings, events, real estate and brands.', price_range: '₹ 150 – ₹ 800', moq: '100 pcs', bg_color: 'linear-gradient(135deg,#fff3e0,#f58220)', icon_name: 'Camera', display_order: 2 },
    { section_id: 'books', name: 'Art & Exhibition Catalogs', description: 'High-fidelity color reproduction for art galleries, museums and luxury brand catalogs.', price_range: '₹ 200 – ₹ 1,200', moq: '50 pcs', bg_color: 'linear-gradient(135deg,#d1fae5,#16a34a)', icon_name: 'BookOpen', display_order: 3 },
    { section_id: 'brochures', name: 'Multi-page Brochures', description: 'Professional 4 to 100+ page brochures with saddle stitch, perfect bind or spiral binding.', price_range: '₹ 8 – ₹ 120', moq: '500 pcs', bg_color: 'linear-gradient(135deg,#fff3e0,#f58220)', icon_name: 'ClipboardList', display_order: 4 },
    { section_id: 'brochures', name: 'Product Catalogs', description: 'Detailed product catalogs for trade shows, e-commerce and B2B sales with accurate color proofing.', price_range: '₹ 15 – ₹ 200', moq: '200 pcs', bg_color: 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', icon_name: 'Package', display_order: 5 },
    { section_id: 'brochures', name: 'Pamphlets & Leaflets', description: 'Single and bi-fold pamphlets for campaigns, promotions, events and product launches.', price_range: '₹ 1 – ₹ 15', moq: '1,000 pcs', bg_color: 'linear-gradient(135deg,#d1fae5,#16a34a)', icon_name: 'Newspaper', display_order: 6 },
    { section_id: 'kits', name: 'Welcome Kits', description: 'Complete onboarding kit with folders, stationery, ID cards, and branded materials.', price_range: '₹ 250 – ₹ 2,000', moq: '100 kits', bg_color: 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', icon_name: 'Target', display_order: 7 },
    { section_id: 'kits', name: 'Business Stationery Kits', description: 'Complete stationery solutions — visiting cards, letterheads, envelopes, notepads and more.', price_range: '₹ 100 – ₹ 500', moq: '200 sets', bg_color: 'linear-gradient(135deg,#fff3e0,#f58220)', icon_name: 'Folder', display_order: 8 },
    { section_id: 'kits', name: 'Restaurant Menus', description: 'Premium laminated menus, table cards, and hospitality stationery for restaurants and hotels.', price_range: '₹ 50 – ₹ 400', moq: '100 pcs', bg_color: 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', icon_name: 'Utensils', display_order: 9 },
  ];

  const insertPrintingItem = db.prepare(`
    INSERT INTO printing_items (section_id, name, description, price_range, moq, bg_color, icon_name, display_order)
    VALUES (@section_id, @name, @description, @price_range, @moq, @bg_color, @icon_name, @display_order)
  `);

  const transaction = db.transaction((items) => {
    for (const item of items) insertPrintingItem.run(item);
  });
  transaction(defaultPrintingItems);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.get("/api/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM settings").all();
      const settingsMap = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", (req, res) => {
    const { logo_url } = req.body;
    try {
      const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      if (logo_url) stmt.run("logo_url", logo_url);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.post("/api/upload-logo", upload.single("logo"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const logoUrl = `/uploads/${req.file.filename}`;
      
      // Update settings in DB immediately
      const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      stmt.run("logo_url", logoUrl);
      
      res.json({ success: true, logo_url: logoUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  });

  app.post("/api/enquiries", (req, res) => {
    const { name, mobile, email, company, product, message } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO enquiries (name, mobile, email, company, product, message) VALUES (?, ?, ?, ?, ?, ?)"
      );
      stmt.run(name, mobile, email, company, product, message);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save enquiry" });
    }
  });

  app.get("/api/enquiries", (req, res) => {
    try {
      const enquiries = db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC").all();
      res.json(enquiries);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch enquiries" });
    }
  });

  // Product Routes
  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", (req, res) => {
    const { id, name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price } = req.body;
    try {
      if (id) {
        const stmt = db.prepare(`
          UPDATE products SET 
            name = ?, category = ?, sub_category = ?, price = ?, 
            moq = ?, image_url = ?, image_alt = ?, badge = ?, 
            link = ?, min_price = ?
          WHERE id = ?
        `);
        stmt.run(name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price, id);
      } else {
        const stmt = db.prepare(`
          INSERT INTO products (name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Product save error:", error);
      res.status(500).json({ error: "Failed to save product" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Service Routes
  app.get("/api/services", (req, res) => {
    try {
      const services = db.prepare("SELECT * FROM services ORDER BY display_order ASC").all();
      res.json(services.map(s => ({ 
        ...s, 
        tags: JSON.parse(s.tags || '[]'),
        features: JSON.parse(s.features || '[]')
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", (req, res) => {
    const { id, name, description, image_url, icon_name, tags, features, bg_color, link, display_order } = req.body;
    try {
      if (id) {
        const stmt = db.prepare(`
          UPDATE services SET 
            name = ?, description = ?, image_url = ?, 
            icon_name = ?, tags = ?, features = ?, bg_color = ?, link = ?, display_order = ?
          WHERE id = ?
        `);
        stmt.run(name, description, image_url, icon_name, JSON.stringify(tags), JSON.stringify(features || []), bg_color, link, display_order, id);
      } else {
        const stmt = db.prepare(`
          INSERT INTO services (name, description, image_url, icon_name, tags, features, bg_color, link, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(name, description, image_url, icon_name, JSON.stringify(tags), JSON.stringify(features || []), bg_color, link, display_order);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save service" });
    }
  });

  app.delete("/api/services/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM services WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Printing Items Routes
  app.get("/api/printing-items", (req, res) => {
    try {
      const items = db.prepare("SELECT * FROM printing_items ORDER BY display_order ASC").all();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch printing items" });
    }
  });

  app.post("/api/printing-items", (req, res) => {
    const { id, section_id, name, description, price_range, moq, image_url, bg_color, icon_name, display_order } = req.body;
    try {
      if (id) {
        const stmt = db.prepare(`
          UPDATE printing_items SET 
            section_id = ?, name = ?, description = ?, price_range = ?, 
            moq = ?, image_url = ?, bg_color = ?, icon_name = ?, display_order = ?
          WHERE id = ?
        `);
        stmt.run(section_id, name, description, price_range, moq, image_url, bg_color, icon_name, display_order, id);
      } else {
        const stmt = db.prepare(`
          INSERT INTO printing_items (section_id, name, description, price_range, moq, image_url, bg_color, icon_name, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(section_id, name, description, price_range, moq, image_url, bg_color, icon_name, display_order);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Printing item save error:", error);
      res.status(500).json({ error: "Failed to save printing item" });
    }
  });

  app.delete("/api/printing-items/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM printing_items WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete printing item" });
    }
  });

  app.post("/api/upload-product-image", upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, image_url: imageUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Blog API Endpoints
app.get("/api/blog/posts", (req, res) => {
  const posts = db.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC").all();
  res.json(posts);
});

app.get("/api/blog/posts/:slug", (req, res) => {
  const post = db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(req.params.slug);
  if (post) {
    db.prepare("UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?").run(post.id);
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

app.post("/api/blog/posts", (req, res) => {
  const { 
    id, title, slug, content, excerpt, meta_title, meta_description, 
    status, published_at, featured_image, image_alt, reading_time 
  } = req.body;

  if (id) {
    db.prepare(`
      UPDATE blog_posts SET 
        title = ?, slug = ?, content = ?, excerpt = ?, 
        meta_title = ?, meta_description = ?, status = ?, 
        published_at = ?, featured_image = ?, image_alt = ?, 
        reading_time = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title, slug, content, excerpt, meta_title, meta_description, 
      status, published_at, featured_image, image_alt, reading_time, id
    );
    res.json({ success: true, id });
  } else {
    const result = db.prepare(`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, meta_title, meta_description, 
        status, published_at, featured_image, image_alt, reading_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, slug, content, excerpt, meta_title, meta_description, 
      status, published_at, featured_image, image_alt, reading_time
    );
    res.json({ success: true, id: result.lastInsertRowid });
  }
});

app.delete("/api/blog/posts/:id", (req, res) => {
  db.prepare("DELETE FROM blog_posts WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/blog/categories", (req, res) => {
  const categories = db.prepare("SELECT * FROM blog_categories").all();
  res.json(categories);
});

app.post("/api/blog/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/uploads/${req.file.filename}`;
  
  db.prepare("INSERT INTO blog_media (url, filename, mimetype, size) VALUES (?, ?, ?, ?)")
    .run(url, req.file.filename, req.file.mimetype, req.file.size);
    
  res.json({ url });
});

app.get("/api/blog/media", (req, res) => {
  const media = db.prepare("SELECT * FROM blog_media ORDER BY created_at DESC").all();
  res.json(media);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
