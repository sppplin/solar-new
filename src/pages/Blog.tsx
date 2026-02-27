import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, ChevronRight, Search, Tag, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  reading_time: number;
  status: string;
  created_at?: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts');
        if (response.ok) {
          const data = await response.json();
          // Only show published posts
          setPosts(data.filter((p: BlogPost) => p.status === 'published'));
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      {/* HERO SECTION */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--secondary)] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 text-[var(--primary)] text-sm font-bold mb-6"
            >
              <Tag size={16} />
              <span>Our Insights & News</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-baloo text-4xl md:text-5xl font-bold text-[var(--secondary)] mb-6"
            >
              The Antigravity <span className="text-[var(--primary)]">Journal</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg mb-10"
            >
              Expert tips on printing, packaging design, and branding strategies to help your business stand out.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl shadow-lg border-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOG LIST */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-bold">Loading articles...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100"
              >
                <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                  {post.featured_image ? (
                    <img 
                      src={post.featured_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-[var(--secondary)] uppercase tracking-wider">
                      Article
                    </span>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[var(--primary)]" />
                      {new Date(post.published_at || post.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[var(--primary)]" />
                      {post.reading_time} min read
                    </span>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="font-baloo text-xl font-bold text-[var(--secondary)] mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[var(--primary)] font-bold text-sm hover:gap-3 transition-all"
                  >
                    Read Article <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[var(--secondary)] mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search terms or check back later.</p>
          </div>
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="container mx-auto px-4 mt-12">
        <div className="bg-[var(--secondary)] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-baloo text-3xl font-bold text-white mb-4">Stay ahead of the curve</h2>
              <p className="text-gray-300">Subscribe to our newsletter for the latest industry trends and exclusive offers.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-1 md:w-64 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-gray-500 outline-none focus:border-[var(--primary)] transition-all"
              />
              <button className="px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg">
                Join
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
