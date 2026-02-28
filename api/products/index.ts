import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
      return res.json(products);
    } catch (error) {
      console.error('Products fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  if (req.method === 'POST') {
    const { id, name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price } = req.body;
    try {
      if (id) {
        await sql`
          UPDATE products SET 
            name = ${name}, category = ${category}, sub_category = ${sub_category}, 
            price = ${price}, moq = ${moq}, image_url = ${image_url}, 
            image_alt = ${image_alt}, badge = ${badge}, link = ${link}, min_price = ${min_price}
          WHERE id = ${id}
        `;
      } else {
        await sql`
          INSERT INTO products (name, category, sub_category, price, moq, image_url, image_alt, badge, link, min_price)
          VALUES (${name}, ${category}, ${sub_category}, ${price}, ${moq}, ${image_url}, ${image_alt}, ${badge}, ${link}, ${min_price})
        `;
      }
      return res.json({ success: true });
    } catch (error) {
      console.error('Product save error:', error);
      return res.status(500).json({ error: 'Failed to save product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
