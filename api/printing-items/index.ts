import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const items = await sql`SELECT * FROM printing_items ORDER BY display_order ASC`;
      return res.json(items);
    } catch (error) {
      console.error('Printing items fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch printing items' });
    }
  }

  if (req.method === 'POST') {
    const { id, section_id, name, description, price_range, moq, image_url, bg_color, icon_name, display_order } = req.body;
    try {
      if (id) {
        await sql`
          UPDATE printing_items SET 
            section_id = ${section_id}, name = ${name}, description = ${description}, 
            price_range = ${price_range}, moq = ${moq}, image_url = ${image_url}, 
            bg_color = ${bg_color}, icon_name = ${icon_name}, display_order = ${display_order}
          WHERE id = ${id}
        `;
      } else {
        await sql`
          INSERT INTO printing_items (section_id, name, description, price_range, moq, image_url, bg_color, icon_name, display_order)
          VALUES (${section_id}, ${name}, ${description}, ${price_range}, ${moq}, ${image_url}, ${bg_color}, ${icon_name}, ${display_order})
        `;
      }
      return res.json({ success: true });
    } catch (error) {
      console.error('Printing item save error:', error);
      return res.status(500).json({ error: 'Failed to save printing item' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await sql`DELETE FROM printing_items WHERE id = ${id}`;
      return res.json({ success: true });
    } catch (error) {
      console.error('Printing item delete error:', error);
      return res.status(500).json({ error: 'Failed to delete printing item' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
