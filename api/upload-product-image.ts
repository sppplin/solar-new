import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    // Parse the multipart form data manually
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Extract boundary from content-type header
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'No boundary found' });
    }
    const boundary = boundaryMatch[1] || boundaryMatch[2];
    
    // Simple multipart parser to extract file
    const parts = buffer.toString('binary').split(`--${boundary}`);
    let fileBuffer: Buffer | null = null;
    let filename = 'product';
    let mimeType = 'image/png';
    
    for (const part of parts) {
      if (part.includes('filename=')) {
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
        
        const contentTypeMatch = part.match(/Content-Type:\s*([^\r\n]+)/i);
        if (contentTypeMatch) {
          mimeType = contentTypeMatch[1].trim();
        }
        
        // Find the start of file content (after double CRLF)
        const headerEndIndex = part.indexOf('\r\n\r\n');
        if (headerEndIndex !== -1) {
          const fileContent = part.slice(headerEndIndex + 4);
          // Remove trailing boundary markers
          const cleanContent = fileContent.replace(/\r\n--$/, '').replace(/--\r\n$/, '').replace(/\r\n$/, '');
          fileBuffer = Buffer.from(cleanContent, 'binary');
        }
      }
    }
    
    if (!fileBuffer) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Vercel Blob
    const ext = filename.split('.').pop() || 'png';
    const blobFilename = `product-${Date.now()}.${ext}`;
    
    const blob = await put(blobFilename, fileBuffer, {
      access: 'public',
      contentType: mimeType,
    });

    return res.json({ success: true, image_url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
