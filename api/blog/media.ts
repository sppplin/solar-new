import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const media = await sql`SELECT * FROM blog_media ORDER BY created_at DESC`;
      return res.json(media);
    } catch (error) {
      console.error('Media fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch media' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
