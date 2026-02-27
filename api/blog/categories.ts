import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const categories = await sql`SELECT * FROM blog_categories`;
      return res.json(categories);
    } catch (error) {
      console.error('Categories fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
