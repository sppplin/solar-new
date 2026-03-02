import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import sql from './_lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseMultipartFormData(req: VercelRequest): Promise<{ buffer: Buffer; filename: string; contentType: string } | null> {
  const contentType = req.headers['content-type'] || '';
  
  if (!contentType.includes('multipart/form-data')) {
    return null;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    return null;
  }
  const boundary = '--' + (boundaryMatch[1] || boundaryMatch[2]);
  
  // Find the file part
  const boundaryBuffer = Buffer.from(boundary);
  const crlfCrlf = Buffer.from('\r\n\r\n');
  
  let start = buffer.indexOf(boundaryBuffer);
  if (start === -1) return null;
  
  // Skip to after the first boundary
  start += boundaryBuffer.length;
  
  // Find the header section end
  const headerEnd = buffer.indexOf(crlfCrlf, start);
  if (headerEnd === -1) return null;
  
  const headerSection = buffer.slice(start, headerEnd).toString('utf8');
  
  // Extract filename and content-type from headers
  const filenameMatch = headerSection.match(/filename="([^"]+)"/);
  const ctMatch = headerSection.match(/Content-Type:\s*([^\r\n]+)/i);
  
  const filename = filenameMatch ? filenameMatch[1] : 'upload.png';
  const fileContentType = ctMatch ? ctMatch[1].trim() : 'image/png';
  
  // File content starts after headers
  const contentStart = headerEnd + 4;
  
  // Find the next boundary (end of file content)
  const nextBoundary = buffer.indexOf(boundaryBuffer, contentStart);
  const contentEnd = nextBoundary !== -1 ? nextBoundary - 2 : buffer.length; // -2 for \r\n before boundary
  
  const fileBuffer = buffer.slice(contentStart, contentEnd);
  
  return {
    buffer: fileBuffer,
    filename,
    contentType: fileContentType,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = await parseMultipartFormData(req);
    
    if (!parsed || parsed.buffer.length === 0) {
      return res.status(400).json({ error: 'No file uploaded or invalid format' });
    }

    const { buffer, filename, contentType } = parsed;

    // Upload to Vercel Blob
    const ext = filename.split('.').pop() || 'png';
    const blobFilename = `logo-${Date.now()}.${ext}`;
    
    const blob = await put(blobFilename, buffer, {
      access: 'public',
      contentType: contentType,
    });

    // Update settings in DB
    await sql`
      INSERT INTO settings (key, value) VALUES ('logo_url', ${blob.url})
      ON CONFLICT (key) DO UPDATE SET value = ${blob.url}
    `;

    return res.json({ success: true, logo_url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload logo', details: String(error) });
  }
}
