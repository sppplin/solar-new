import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  // GET single post by slug or all posts
  if (req.method === 'GET') {
    try {
      if (slug) {
        const posts = await sql`SELECT * FROM blog_posts WHERE slug = ${slug}`;
        const post = posts[0];
        
        if (post) {
          await sql`UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ${post.id}`;
          return res.json(post);
        } else {
          return res.status(404).json({ error: 'Post not found' });
        }
      } else {
        const posts = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
        return res.json(posts);
      }
    } catch (error) {
      console.error('Blog posts fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  // POST create/update post
  if (req.method === 'POST') {
    const { 
      id, title, slug: postSlug, content, excerpt, meta_title, meta_description, 
      status, published_at, featured_image, image_alt, reading_time 
    } = req.body;

    try {
      if (id) {
        await sql`
          UPDATE blog_posts SET 
            title = ${title}, slug = ${postSlug}, content = ${content}, excerpt = ${excerpt}, 
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
            ${title}, ${postSlug}, ${content}, ${excerpt}, ${meta_title}, ${meta_description}, 
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

  // DELETE post
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await sql`DELETE FROM blog_posts WHERE id = ${id}`;
      return res.json({ success: true });
    } catch (error) {
      console.error('Blog post delete error:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
