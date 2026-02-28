import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const settings = await sql`SELECT * FROM settings`;
      const settingsMap = settings.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      return res.json(settingsMap);
    } catch (error) {
      console.error('Settings fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  if (req.method === 'POST') {
    const { logo_url } = req.body;
    try {
      if (logo_url) {
        await sql`
          INSERT INTO settings (key, value) VALUES ('logo_url', ${logo_url})
          ON CONFLICT (key) DO UPDATE SET value = ${logo_url}
        `;
      }
      return res.json({ success: true });
    } catch (error) {
      console.error('Settings update error:', error);
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
