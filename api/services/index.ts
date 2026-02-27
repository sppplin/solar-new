import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const services = await sql`SELECT * FROM services ORDER BY display_order ASC`;
      return res.json(services.map((s: any) => ({
        ...s,
        tags: JSON.parse(s.tags || '[]'),
        features: JSON.parse(s.features || '[]')
      })));
    } catch (error) {
      console.error('Services fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
  }

  if (req.method === 'POST') {
    const { id, name, description, image_url, icon_name, tags, features, bg_color, link, display_order } = req.body;
    try {
      const tagsJson = JSON.stringify(tags || []);
      const featuresJson = JSON.stringify(features || []);
      
      if (id) {
        await sql`
          UPDATE services SET 
            name = ${name}, description = ${description}, image_url = ${image_url}, 
            icon_name = ${icon_name}, tags = ${tagsJson}, features = ${featuresJson}, 
            bg_color = ${bg_color}, link = ${link}, display_order = ${display_order}
          WHERE id = ${id}
        `;
      } else {
        await sql`
          INSERT INTO services (name, description, image_url, icon_name, tags, features, bg_color, link, display_order)
          VALUES (${name}, ${description}, ${image_url}, ${icon_name}, ${tagsJson}, ${featuresJson}, ${bg_color}, ${link}, ${display_order})
        `;
      }
      return res.json({ success: true });
    } catch (error) {
      console.error('Service save error:', error);
      return res.status(500).json({ error: 'Failed to save service' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
