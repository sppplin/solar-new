import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const posts = await sql`SELECT * FROM blog_posts WHERE slug = ${slug}`;
      const post = posts[0];
      
      if (post) {
        await sql`UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ${post.id}`;
        return res.json(post);
      } else {
        return res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      console.error('Blog post fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Assuming slug is actually id for delete operations
      await sql`DELETE FROM blog_posts WHERE id = ${slug}`;
      return res.json({ success: true });
    } catch (error) {
      console.error('Blog post delete error:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
