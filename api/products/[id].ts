import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.json({ success: true });
    } catch (error) {
      console.error('Product delete error:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
