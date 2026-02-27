import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, ChevronRight, User, Image as ImageIcon } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  featured_image: string;
  image_alt: string;
  published_at: string;
  created_at: string;
  reading_time: number;
  view_count: number;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          // Update page title and meta for SEO
          document.title = data.meta_title || data.title;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', data.meta_description || data.excerpt);
        } else {
          navigate('/blog');
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      {/* BREADCRUMBS */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[var(--primary)]">Home</Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-[var(--primary)]">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
        </nav>
      </div>

      {/* ARTICLE HEADER */}
      <article className="container mx-auto px-4 max-w-4xl">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6"
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={16} className="text-[var(--primary)]" />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1.5">
              <Clock size={16} className="text-[var(--primary)]" />
              {post.reading_time} min read
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-baloo text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--secondary)] mb-8 leading-tight"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-12"
          >
            {post.featured_image ? (
              <img 
                src={post.featured_image} 
                alt={post.image_alt || post.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                <ImageIcon size={64} />
              </div>
            )}
          </motion.div>
        </header>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px] gap-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none prose-headings:font-baloo prose-headings:text-[var(--secondary)] prose-p:text-gray-600 prose-a:text-[var(--primary)] prose-img:rounded-2xl prose-blockquote:border-[var(--primary)] prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* SOCIAL SHARE STICKY */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Share</span>
              <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100">
                <Facebook size={20} />
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-all border border-gray-100">
                <Twitter size={20} />
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-all border border-gray-100">
                <Linkedin size={20} />
              </button>
              <button 
                onClick={handleCopyLink}
                className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all border border-gray-100"
              >
                <Copy size={20} />
              </button>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pt-10 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-2xl">
                A
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Written by</div>
                <div className="font-bold text-[var(--secondary)]">Antigravity Team</div>
              </div>
            </div>
            
            <Link 
              to="/blog"
              className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-[var(--secondary)] rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              <ArrowLeft size={18} /> Back to Blog
            </Link>
          </div>
        </footer>
      </article>

      {/* RELATED POSTS (Placeholder) */}
      <section className="bg-gray-50 mt-20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-baloo text-3xl font-bold text-[var(--secondary)] mb-10 text-center">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* We could fetch real related posts here, but for now just a call to action */}
            <div className="md:col-span-3 text-center">
              <p className="text-gray-500 mb-6">Explore more insights on our main blog page.</p>
              <Link to="/blog" className="inline-block px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all">
                View All Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
