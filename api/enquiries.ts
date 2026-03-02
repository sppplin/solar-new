import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const enquiries = await sql`SELECT * FROM enquiries ORDER BY created_at DESC`;
      return res.json(enquiries);
    } catch (error) {
      console.error('Enquiries fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
  }

  if (req.method === 'POST') {
    const { name, mobile, email, company, product, message } = req.body;
    
    console.error('[v0] Enquiry submission:', { name, mobile, email, company, product, message: message?.substring(0, 50) });

    // Validate required fields
    if (!name || !mobile) {
      console.error('[v0] Missing required fields: name or mobile');
      return res.status(400).json({ error: 'Name and mobile are required' });
    }

    try {
      console.error('[v0] Inserting enquiry into database...');
      await sql`
        INSERT INTO enquiries (name, mobile, email, company, product, message)
        VALUES (${name}, ${mobile}, ${email || null}, ${company || null}, ${product || null}, ${message || null})
      `;
      console.error('[v0] Enquiry saved successfully');
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('[v0] Enquiry save error:', error);
      return res.status(500).json({ error: 'Failed to save enquiry', details: String(error) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
