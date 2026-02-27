import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const posts = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
      return res.json(posts);
    } catch (error) {
      console.error('Blog posts fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  if (req.method === 'POST') {
    const { 
      id, title, slug, content, excerpt, meta_title, meta_description, 
      status, published_at, featured_image, image_alt, reading_time 
    } = req.body;

    try {
      if (id) {
        await sql`
          UPDATE blog_posts SET 
            title = ${title}, slug = ${slug}, content = ${content}, excerpt = ${excerpt}, 
            meta_title = ${meta_title}, meta_description = ${meta_description}, status = ${status}, 
            published_at = ${published_at}, featured_image = ${featured_image}, image_alt = ${image_alt}, 
            reading_time = ${reading_time}, updated_at = NOW()
          WHERE id = ${id}
        `;
        return res.json({ success: true, id });
      } else {
        const result = await sql`
          INSERT INTO blog_posts (
            title, slug, content, excerpt, meta_title, meta_description, 
            status, published_at, featured_image, image_alt, reading_time
          ) VALUES (
            ${title}, ${slug}, ${content}, ${excerpt}, ${meta_title}, ${meta_description}, 
            ${status}, ${published_at}, ${featured_image}, ${image_alt}, ${reading_time}
          )
          RETURNING id
        `;
        return res.json({ success: true, id: result[0]?.id });
      }
    } catch (error) {
      console.error('Blog post save error:', error);
      return res.status(500).json({ error: 'Failed to save post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
