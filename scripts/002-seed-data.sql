-- Seed default products (only if table is empty)
INSERT INTO products (name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price)
SELECT * FROM (VALUES
  ('Premium Rigid Gift Boxes', 'Packaging', 'packaging', '₹ 45 – ₹ 250', '500 pcs', '', 'Premium Rigid Gift Boxes', 'hot', '/packaging#rigid', 45),
  ('Mono Carton Packaging', 'Packaging', 'packaging', '₹ 2 – ₹ 18', '5,000 pcs', '', 'Mono Carton Packaging', 'popular', '/packaging#mono', 2),
  ('Cake & Custom Food Boxes', 'Food Packaging', 'food', '₹ 15 – ₹ 80', '200 pcs', '', 'Cake & Custom Food Boxes', 'new', '/packaging#food', 15),
  ('Retail 3D Display Units', 'Display Systems', 'display', '₹ 2,500 – ₹ 25,000', '10 units', '', 'Retail 3D Display Units', '', '/display-units', 2500),
  ('Coffee Table Books', 'Commercial Printing', 'printing', '₹ 300 – ₹ 1,500', '50 pcs', '', 'Coffee Table Books', '', '/printing#books', 300),
  ('Corporate Brochures & Catalogs', 'Printing', 'printing', '₹ 8 – ₹ 120', '500 pcs', '', 'Corporate Brochures & Catalogs', '', '/printing#brochures', 8),
  ('Hi-Gloss Lacquer Luxury Boxes', 'Luxury Packaging', 'luxury', '₹ 120 – ₹ 800', '200 pcs', '', 'Hi-Gloss Lacquer Luxury Boxes', 'popular', '/packaging#luxury', 120),
  ('Welcome & Business Kits', 'Corporate', 'corporate', '₹ 250 – ₹ 2,000', '100 kits', '', 'Welcome & Business Kits', 'new', '/printing#kits', 250)
) AS t(name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Seed default services (only if table is empty)
INSERT INTO services (name, description, tags, features, bg_color, link, icon_name, display_order)
SELECT * FROM (VALUES
  ('Offset Printing', 'Our state-of-the-art offset printing facility delivers sharp, vibrant, and consistent print quality at scale.', '["CMYK", "Pantone", "Spot UV", "Foiling"]', '["Multi-color CMYK and Pantone printing", "Spot UV, matte/gloss lamination, foil stamping", "High-resolution printing up to 300 DPI", "Short runs to bulk production", "Strict color proofing and QC processes"]', 'linear-gradient(135deg,var(--primary-light),var(--primary))', '/printing', 'Printer', 1),
  ('Custom Packaging', 'From luxury rigid boxes to pharmaceutical mono cartons — we design and manufacture bespoke packaging.', '["Rigid", "Mono Carton", "VAP", "Eco-Friendly"]', '["Rigid boxes, mono cartons, value added packs", "Glass, metal, wooden and hi-gloss lacquer boxes", "Gift boxes, cake boxes, food packaging", "Custom structural design and prototyping", "Eco-friendly and sustainable material options"]', 'linear-gradient(135deg,var(--gray-100),var(--secondary))', '/packaging', 'Package', 2),
  ('3D Display Systems', 'Eye-catching retail display units that drive brand visibility at POS.', '["Floor Stands", "Counter Units", "Shelf Displays"]', '["Custom structural design", "High-strength corrugated board", "Vibrant graphics", "Easy assembly", "Durable construction"]', 'linear-gradient(135deg,var(--primary-light),var(--primary))', '/display-units', 'Layout', 3),
  ('Graphic Design', 'Our in-house creative team handles everything from packaging artwork to full brand identity.', '["Packaging Design", "Branding", "Artwork"]', '["Structural packaging design and dielines", "Brand identity and logo design", "Print-ready artwork preparation", "3D mockups and virtual proofs", "Marketing collateral design"]', 'linear-gradient(135deg,var(--gray-100),var(--secondary))', '/services#design', 'Palette', 4),
  ('Product Photography', 'Professional in-house photography studio for product and packaging shoots.', '["E-commerce", "Catalog Shoots", "360° View"]', '["White background and lifestyle photography", "360° product photography", "Packaging and unboxing photography", "Post-processing and retouching", "High-res files for web and print"]', 'linear-gradient(135deg,var(--primary-light),var(--primary))', '/services#photography', 'Camera', 5),
  ('Logistics & Warehousing', 'End-to-end supply chain with warehousing and PAN India delivery.', '["Warehousing", "PAN India", "Track & Trace"]', '["In-house warehousing at our Noida facility", "PAN India delivery via trusted courier partners", "Real-time shipment tracking", "Custom packaging for safe transit", "Bulk storage and inventory management"]', 'linear-gradient(135deg,var(--gray-100),var(--secondary))', '/services#logistics', 'Truck', 6)
) AS t(name, description, tags, features, bg_color, link, icon_name, display_order)
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

-- Seed default printing items (only if table is empty)
INSERT INTO printing_items (section_id, name, description, price_range, moq, bg_color, icon_name, display_order)
SELECT * FROM (VALUES
  ('books', 'Coffee Table Books', 'Lavish, large-format books with premium paper and binding. Perfect for architecture, art, travel and brand showcases.', '₹ 300 – ₹ 1,500', '50 pcs', 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', 'Book', 1),
  ('books', 'Photo Albums', 'Custom lay-flat and paged photo albums for weddings, events, real estate and brands.', '₹ 150 – ₹ 800', '100 pcs', 'linear-gradient(135deg,#fff3e0,#f58220)', 'Camera', 2),
  ('books', 'Art & Exhibition Catalogs', 'High-fidelity color reproduction for art galleries, museums and luxury brand catalogs.', '₹ 200 – ₹ 1,200', '50 pcs', 'linear-gradient(135deg,#d1fae5,#16a34a)', 'BookOpen', 3),
  ('brochures', 'Multi-page Brochures', 'Professional 4 to 100+ page brochures with saddle stitch, perfect bind or spiral binding.', '₹ 8 – ₹ 120', '500 pcs', 'linear-gradient(135deg,#fff3e0,#f58220)', 'ClipboardList', 4),
  ('brochures', 'Product Catalogs', 'Detailed product catalogs for trade shows, e-commerce and B2B sales with accurate color proofing.', '₹ 15 – ₹ 200', '200 pcs', 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', 'Package', 5),
  ('brochures', 'Pamphlets & Leaflets', 'Single and bi-fold pamphlets for campaigns, promotions, events and product launches.', '₹ 1 – ₹ 15', '1,000 pcs', 'linear-gradient(135deg,#d1fae5,#16a34a)', 'Newspaper', 6),
  ('kits', 'Welcome Kits', 'Complete onboarding kit with folders, stationery, ID cards, and branded materials.', '₹ 250 – ₹ 2,000', '100 kits', 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', 'Target', 7),
  ('kits', 'Business Stationery Kits', 'Complete stationery solutions — visiting cards, letterheads, envelopes, notepads and more.', '₹ 100 – ₹ 500', '200 sets', 'linear-gradient(135deg,#fff3e0,#f58220)', 'Folder', 8),
  ('kits', 'Restaurant Menus', 'Premium laminated menus, table cards, and hospitality stationery for restaurants and hotels.', '₹ 50 – ₹ 400', '100 pcs', 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', 'Utensils', 9)
) AS t(section_id, name, description, price_range, moq, bg_color, icon_name, display_order)
WHERE NOT EXISTS (SELECT 1 FROM printing_items LIMIT 1);
