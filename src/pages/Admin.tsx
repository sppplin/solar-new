import React from 'react';
import { ClipboardList, Trash2, Calendar, User, Phone, Mail, Building, Package2, MessageSquare, CheckCircle, Loader2, Plus, Edit2, Image as ImageIcon, Save, X, FileText, Settings as SettingsIcon, Eye, Globe, Clock, Tag } from 'lucide-react';
import { useSWRConfig } from 'swr';
import { BlogEditor } from '../components/BlogEditor';

interface Enquiry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  company: string;
  product: string;
  message: string;
  created_at: string;
}

interface Product {
  id?: number;
  name: string;
  category: string;
  sub_category: string;
  price: string;
  moq: string;
  image_url: string;
  image_alt: string;
  badge: string;
  link: string;
  min_price: number;
}

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published';
  published_at: string | null;
  featured_image: string;
  image_alt: string;
  reading_time: number;
  view_count?: number;
  created_at?: string;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface Service {
  id?: number;
  name: string;
  description: string;
  image_url: string;
  icon_name: string;
  tags: string[];
  features: string[];
  bg_color: string;
  link: string;
  display_order: number;
}

interface PrintingItem {
  id?: number;
  section_id: string;
  name: string;
  description: string;
  price_range: string;
  moq: string;
  image_url: string;
  bg_color: string;
  icon_name: string;
  display_order: number;
}

const Admin: React.FC = () => {
  const { mutate } = useSWRConfig();
  const [enquiries, setEnquiries] = React.useState<Enquiry[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [categories, setCategories] = React.useState<BlogCategory[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [printingItems, setPrintingItems] = React.useState<PrintingItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'enquiries' | 'settings' | 'products' | 'blog' | 'services' | 'printing'>('enquiries');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [savingSettings, setSavingSettings] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  // Product Form State
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);

  // Blog Form State
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = React.useState(false);

  // Service Form State
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = React.useState(false);

  // Printing Form State
  const [editingPrintingItem, setEditingPrintingItem] = React.useState<PrintingItem | null>(null);
  const [isPrintingModalOpen, setIsPrintingModalOpen] = React.useState(false);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  };

  const fetchBlogCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch blog categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchPrintingItems = async () => {
    try {
      const response = await fetch('/api/printing-items');
      if (response.ok) {
        const data = await response.json();
        setPrintingItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch printing items:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.logo_url) {
          setLogoUrl(settings.logo_url);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
      fetchSettings();
      fetchProducts();
      fetchBlogPosts();
      fetchBlogCategories();
      fetchServices();
      fetchPrintingItems();
    }
  }, [isAuthenticated]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo_url: logoUrl }),
      });
      if (response.ok) {
        alert('Settings updated successfully!');
        mutate('/api/settings');
      }
    } catch (error) {
      alert('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded credentials for demo purposes
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      fetchEnquiries();
      fetchSettings();
      fetchProducts();
      fetchBlogPosts();
      fetchBlogCategories();
    } else {
      alert('Invalid username or password');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      if (response.ok) {
        alert('Product saved successfully');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch('/api/upload-product-image', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setEditingProduct(prev => prev ? { ...prev, image_url: data.image_url } : null);
      } else {
        const err = await response.json();
        alert(err.error || 'Upload failed');
      }
    } catch (error) {
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });
      if (response.ok) {
        alert('Service saved successfully');
        setIsServiceModalOpen(false);
        setEditingService(null);
        fetchServices();
      }
    } catch (error) {
      alert('Failed to save service');
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const response = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingService) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch('/api/upload-product-image', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setEditingService(prev => prev ? { ...prev, image_url: data.image_url } : null);
      } else {
        const err = await response.json();
        alert(err.error || 'Upload failed');
      }
    } catch (error) {
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePrintingItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrintingItem) return;

    try {
      const response = await fetch('/api/printing-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPrintingItem),
      });
      if (response.ok) {
        alert('Printing item saved successfully');
        setIsPrintingModalOpen(false);
        setEditingPrintingItem(null);
        fetchPrintingItems();
      }
    } catch (error) {
      alert('Failed to save printing item');
    }
  };

  const handleDeletePrintingItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/printing-items/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPrintingItems();
      }
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const handlePrintingItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPrintingItem) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch('/api/upload-product-image', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setEditingPrintingItem(prev => prev ? { ...prev, image_url: data.image_url } : null);
      } else {
        const err = await response.json();
        alert(err.error || 'Upload failed');
      }
    } catch (error) {
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    // Auto-calculate reading time (approx 200 words per minute)
    const wordCount = editingPost.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    const postToSave = { ...editingPost, reading_time: readingTime };

    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postToSave),
      });
      if (response.ok) {
        alert('Post saved successfully');
        setIsBlogModalOpen(false);
        setEditingPost(null);
        fetchBlogPosts();
      }
    } catch (error) {
      alert('Failed to save post');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchBlogPosts();
      }
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setEditingPost({ ...editingPost, featured_image: data.url });
      } else {
        const err = await response.json();
        alert(err.error || 'Upload failed');
      }
    } catch (error) {
      alert('Image upload failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <ClipboardList size={32} />
            </div>
            <h1 className="font-baloo text-2xl font-bold text-[var(--secondary)]">Admin Login</h1>
            <p className="text-gray-500 text-sm">Solar Print Process Admin Panel</p>
          </div>
            <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Admin Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Admin Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)] transition-all"
                required
              />
            </div>
            <button type="submit" className="w-full py-3 bg-[var(--primary)] text-white rounded-lg font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-baloo text-3xl font-bold text-[var(--secondary)] flex items-center gap-3">
              <ClipboardList className="text-[var(--primary)]" size={32} /> 
              Admin <span>Panel</span>
            </h1>
            <p className="text-gray-500">Manage site content and track customer enquiries.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'enquiries' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Enquiries
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'services' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveTab('printing')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'printing' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Printing
            </button>
            <button 
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'blog' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Site Settings
            </button>
            <button 
              onClick={() => { 
                setIsAuthenticated(false); 
                setUsername('');
                setPassword(''); 
                localStorage.removeItem('admin_auth');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {activeTab === 'enquiries' ? (
          <>
            <div className="mb-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-bold text-[var(--secondary)] w-fit">
              Total Enquiries: <span className="text-[var(--primary)]">{enquiries.length}</span>
            </div>
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading enquiries...</p>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <ClipboardList size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-700">No enquiries yet</h2>
                <p className="text-gray-500">When customers fill out forms, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[var(--primary-light)] text-[var(--primary)] rounded-xl flex items-center justify-center">
                            <User size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-[var(--secondary)]">{enquiry.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar size={12} />
                              {new Date(enquiry.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1.5">
                            <Package2 size={12} /> {enquiry.product || 'General Enquiry'}
                          </span>
                          {enquiry.company && (
                            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold border border-purple-100 flex items-center gap-1.5">
                              <Building size={12} /> {enquiry.company}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <Phone size={18} className="text-[var(--primary)]" />
                          <div>
                            <div className="text-[10px] uppercase font-bold text-gray-400">Mobile</div>
                            <div className="text-sm font-bold text-[var(--secondary)]">{enquiry.mobile}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <Mail size={18} className="text-[var(--primary)]" />
                          <div>
                            <div className="text-[10px] uppercase font-bold text-gray-400">Email</div>
                            <div className="text-sm font-bold text-[var(--secondary)]">{enquiry.email || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <MessageSquare size={18} className="text-[var(--primary)]" />
                          <div>
                            <div className="text-[10px] uppercase font-bold text-gray-400">Message Status</div>
                            <div className="text-sm font-bold text-green-600">New Lead</div>
                          </div>
                        </div>
                      </div>

                      {enquiry.message && (
                        <div className="p-4 bg-[var(--primary-light)] rounded-xl border border-[var(--primary)]/10">
                          <div className="text-[10px] uppercase font-bold text-[var(--primary)] mb-2">Requirement Details</div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'services' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-bold text-[var(--secondary)]">
                Total Services: <span className="text-[var(--primary)]">{services.length}</span>
              </div>
              <button 
                onClick={() => {
                  setEditingService({
                    name: '',
                    description: '',
                    image_url: '',
                    icon_name: 'Package',
                    tags: [],
                    features: [],
                    bg_color: 'linear-gradient(135deg,var(--primary-light),var(--primary))',
                    link: '',
                    display_order: services.length + 1
                  });
                  setIsServiceModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all"
              >
                <Plus size={18} /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-300 flex flex-col items-center gap-2">
                        <ImageIcon size={48} />
                        <span className="text-xs font-bold uppercase">{service.icon_name}</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }}
                        className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id!)}
                        className="p-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--secondary)] mb-1">{service.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {service.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Edit Modal */}
            {isServiceModalOpen && editingService && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
                  <button onClick={() => setIsServiceModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                  <h2 className="font-baloo text-2xl font-bold text-[var(--secondary)] mb-6">
                    {editingService.id ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Service Name *</label>
                        <input 
                          type="text" 
                          value={editingService.name}
                          onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Icon Name (Lucide)</label>
                        <input 
                          type="text" 
                          value={editingService.icon_name}
                          onChange={(e) => setEditingService({...editingService, icon_name: e.target.value})}
                          placeholder="Package, Printer, Layout, etc."
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Description *</label>
                      <textarea 
                        value={editingService.description}
                        onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                        required
                        rows={3}
                        className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Link URL</label>
                        <input 
                          type="text" 
                          value={editingService.link}
                          onChange={(e) => setEditingService({...editingService, link: e.target.value})}
                          placeholder="/packaging, /printing, etc."
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Background Color (CSS Gradient)</label>
                        <input 
                          type="text" 
                          value={editingService.bg_color}
                          onChange={(e) => setEditingService({...editingService, bg_color: e.target.value})}
                          placeholder="linear-gradient(135deg, ...)"
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Display Order</label>
                      <input 
                        type="number" 
                        value={editingService.display_order}
                        onChange={(e) => setEditingService({...editingService, display_order: parseInt(e.target.value)})}
                        className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        value={editingService.tags.join(', ')}
                        onChange={(e) => setEditingService({...editingService, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                        placeholder="Tag 1, Tag 2, Tag 3"
                        className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Features (One per line)</label>
                      <textarea 
                        value={editingService.features.join('\n')}
                        onChange={(e) => setEditingService({...editingService, features: e.target.value.split('\n').map(f => f.trim()).filter(f => f)})}
                        rows={4}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Card Image (Optional)</label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                          {editingService.image_url ? (
                            <img src={editingService.image_url} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={32} className="text-gray-300" />
                          )}
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept=".svg,.png,.jpg,.jpeg,.webp"
                            onChange={handleServiceImageUpload}
                            className="hidden" 
                            id="service-image-upload" 
                          />
                          <label 
                            htmlFor="service-image-upload" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-bold cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                          >
                            <ImageIcon size={18} /> {editingService.image_url ? 'Change Image' : 'Upload Image'}
                          </label>
                          <p className="text-[10px] text-gray-400 mt-2">Recommended: 800x600px. Max 2MB. Supports .webp</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="submit" 
                        className="flex-1 py-3 bg-[var(--primary)] text-white rounded-lg font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all"
                      >
                        {editingService.id ? 'Update Service' : 'Create Service'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsServiceModalOpen(false)}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'printing' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-bold text-[var(--secondary)]">
                Total Printing Items: <span className="text-[var(--primary)]">{printingItems.length}</span>
              </div>
              <button 
                onClick={() => {
                  setEditingPrintingItem({
                    section_id: 'books',
                    name: '',
                    description: '',
                    price_range: '',
                    moq: '',
                    image_url: '',
                    bg_color: 'linear-gradient(135deg,var(--primary-light),var(--primary))',
                    icon_name: 'Book',
                    display_order: printingItems.length + 1
                  });
                  setIsPrintingModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all"
              >
                <Plus size={18} /> Add Printing Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {printingItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-300 flex flex-col items-center gap-2">
                        <ImageIcon size={48} />
                        <span className="text-xs font-bold uppercase">{item.icon_name}</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingPrintingItem(item); setIsPrintingModalOpen(true); }}
                        className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeletePrintingItem(item.id!)}
                        className="p-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] font-bold rounded uppercase">
                      {item.section_id}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--secondary)] mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--primary)] text-xs font-bold">{item.price_range}</span>
                      <span className="text-gray-400 text-[10px] uppercase font-bold">MOQ: {item.moq}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Printing Item Edit Modal */}
            {isPrintingModalOpen && editingPrintingItem && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
                  <button onClick={() => setIsPrintingModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                  <h2 className="font-baloo text-2xl font-bold text-[var(--secondary)] mb-6">
                    {editingPrintingItem.id ? 'Edit Printing Item' : 'Add New Printing Item'}
                  </h2>
                  <form onSubmit={handleSavePrintingItem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Section *</label>
                        <select 
                          value={editingPrintingItem.section_id}
                          onChange={(e) => setEditingPrintingItem({...editingPrintingItem, section_id: e.target.value})}
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        >
                          <option value="books">Books & Albums</option>
                          <option value="brochures">Brochures & Catalogs</option>
                          <option value="kits">Corporate Kits</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Item Name *</label>
                        <input 
                          type="text" 
                          value={editingPrintingItem.name}
                          onChange={(e) => setEditingPrintingItem({...editingPrintingItem, name: e.target.value})}
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Description *</label>
                      <textarea 
                        value={editingPrintingItem.description}
                        onChange={(e) => setEditingPrintingItem({...editingPrintingItem, description: e.target.value})}
                        required
                        rows={3}
                        className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Price Range *</label>
                        <input 
                          type="text" 
                          value={editingPrintingItem.price_range}
                          onChange={(e) => setEditingPrintingItem({...editingPrintingItem, price_range: e.target.value})}
                          placeholder="₹ 300 – ₹ 1,500"
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">MOQ *</label>
                        <input 
                          type="text" 
                          value={editingPrintingItem.moq}
                          onChange={(e) => setEditingPrintingItem({...editingPrintingItem, moq: e.target.value})}
                          placeholder="50 pcs"
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Icon Name (Lucide)</label>
                        <input 
                          type="text" 
                          value={editingPrintingItem.icon_name}
                          onChange={(e) => setEditingPrintingItem({...editingPrintingItem, icon_name: e.target.value})}
                          placeholder="Book, Camera, Package, etc."
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Background Color (CSS Gradient)</label>
                        <input 
                          type="text" 
                          value={editingPrintingItem.bg_color}
                          onChange={(e) => setEditingPrintingItem({...editingPrintingItem, bg_color: e.target.value})}
                          placeholder="linear-gradient(135deg, ...)"
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Display Order</label>
                      <input 
                        type="number" 
                        value={editingPrintingItem.display_order}
                        onChange={(e) => setEditingPrintingItem({...editingPrintingItem, display_order: parseInt(e.target.value)})}
                        className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Card Image (Optional)</label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                          {editingPrintingItem.image_url ? (
                            <img src={editingPrintingItem.image_url} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={32} className="text-gray-300" />
                          )}
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept=".svg,.png,.jpg,.jpeg,.webp"
                            onChange={handlePrintingItemImageUpload}
                            className="hidden" 
                            id="printing-image-upload" 
                          />
                          <label 
                            htmlFor="printing-image-upload" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-bold cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                          >
                            <ImageIcon size={18} /> {editingPrintingItem.image_url ? 'Change Image' : 'Upload Image'}
                          </label>
                          <p className="text-[10px] text-gray-400 mt-2">Recommended: 800x600px. Max 2MB. Supports .webp</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="submit" 
                        className="flex-1 py-3 bg-[var(--primary)] text-white rounded-lg font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all"
                      >
                        {editingPrintingItem.id ? 'Update Item' : 'Create Item'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsPrintingModalOpen(false)}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'blog' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-bold text-[var(--secondary)]">
                Total Posts: <span className="text-[var(--primary)]">{posts.length}</span>
              </div>
              <button 
                onClick={() => {
                  setEditingPost({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    meta_title: '',
                    meta_description: '',
                    status: 'draft',
                    published_at: null,
                    featured_image: '',
                    image_alt: '',
                    reading_time: 0
                  });
                  setIsBlogModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all"
              >
                <Plus size={18} /> Create Post
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex items-center p-4 group">
                  <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[var(--secondary)] text-base">{post.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.reading_time} min read</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {post.view_count || 0} views</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingPost(post); setIsBlogModalOpen(true); }}
                      className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id!)}
                      className="p-2 bg-white text-red-600 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Blog Edit Modal */}
            {isBlogModalOpen && editingPost && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-baloo text-xl font-bold text-[var(--secondary)]">
                      {editingPost.id ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsBlogModalOpen(false)}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSavePost}
                        className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[var(--primary-dark)] flex items-center gap-2"
                      >
                        <Save size={18} /> Save Changes
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="form-group">
                          <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Post Title *</label>
                          <input 
                            type="text" 
                            value={editingPost.title}
                            onChange={(e) => {
                              const title = e.target.value;
                              const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              setEditingPost({...editingPost, title, slug});
                            }}
                            required
                            placeholder="Enter a catchy title"
                            className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-[var(--primary)] text-lg font-bold"
                          />
                        </div>

                        <div className="form-group">
                          <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Content *</label>
                          <BlogEditor 
                            content={editingPost.content} 
                            onChange={(content) => setEditingPost({...editingPost, content})} 
                          />
                        </div>

                        <div className="form-group">
                          <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Excerpt (Short Summary)</label>
                          <textarea 
                            value={editingPost.excerpt}
                            onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                            rows={3}
                            placeholder="A brief summary for the blog list page"
                            className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-[var(--primary)] text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                          <h3 className="font-bold text-[var(--secondary)] flex items-center gap-2 border-b border-gray-200 pb-2 mb-4">
                            <SettingsIcon size={18} /> Publishing Settings
                          </h3>
                          
                          <div className="form-group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Status</label>
                            <select 
                              value={editingPost.status}
                              onChange={(e) => setEditingPost({...editingPost, status: e.target.value as 'draft' | 'published'})}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[var(--primary)] text-sm"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">URL Slug</label>
                            <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                              <Globe size={14} className="text-gray-400" />
                              <input 
                                type="text" 
                                value={editingPost.slug}
                                onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                                className="flex-1 outline-none text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                          <h3 className="font-bold text-[var(--secondary)] flex items-center gap-2 border-b border-gray-200 pb-2 mb-4">
                            <ImageIcon size={18} /> Featured Image
                          </h3>
                          
                          <div className="aspect-video bg-white rounded-xl border-2 border-dashed border-gray-200 overflow-hidden relative group">
                            {editingPost.featured_image ? (
                              <>
                                <img src={editingPost.featured_image} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <label className="cursor-pointer p-2 bg-white rounded-full text-gray-700 shadow-lg">
                                    <Edit2 size={20} />
                                    <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={handleFeaturedImageUpload} className="hidden" />
                                  </label>
                                </div>
                              </>
                            ) : (
                              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                <ImageIcon size={32} className="text-gray-300 mb-2" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Image</span>
                                <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={handleFeaturedImageUpload} className="hidden" />
                              </label>
                            )}
                          </div>
                          
                          <div className="form-group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Image Alt Text</label>
                            <input 
                              type="text" 
                              value={editingPost.image_alt}
                              onChange={(e) => setEditingPost({...editingPost, image_alt: e.target.value})}
                              placeholder="Describe image for SEO"
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[var(--primary)] text-xs"
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                          <h3 className="font-bold text-[var(--secondary)] flex items-center gap-2 border-b border-gray-200 pb-2 mb-4">
                            <Tag size={18} /> SEO Settings
                          </h3>
                          
                          <div className="form-group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Meta Title</label>
                            <input 
                              type="text" 
                              value={editingPost.meta_title}
                              onChange={(e) => setEditingPost({...editingPost, meta_title: e.target.value})}
                              placeholder="SEO Title"
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[var(--primary)] text-xs"
                            />
                          </div>

                          <div className="form-group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Meta Description</label>
                            <textarea 
                              value={editingPost.meta_description}
                              onChange={(e) => setEditingPost({...editingPost, meta_description: e.target.value})}
                              rows={4}
                              placeholder="SEO Description"
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[var(--primary)] text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'products' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-bold text-[var(--secondary)]">
                Total Products: <span className="text-[var(--primary)]">{products.length}</span>
              </div>
              <button 
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'Packaging',
                    sub_category: 'packaging',
                    price: '',
                    moq: '',
                    image_url: '',
                    image_alt: '',
                    badge: '',
                    link: '',
                    min_price: 0
                  });
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-[var(--primary-dark)] transition-all"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.image_alt} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={48} className="text-gray-300" />
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                        className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id!)}
                        className="p-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--secondary)] mb-1">{product.name}</h3>
                    <div className="text-xs text-gray-500 mb-3">{product.category}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-[var(--primary)] font-bold">{product.price}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">MOQ: {product.moq}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Edit Modal */}
            {isProductModalOpen && editingProduct && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
                  <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                  <h2 className="font-baloo text-2xl font-bold text-[var(--secondary)] mb-6">
                    {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Product Name *</label>
                        <input 
                          type="text" 
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Category *</label>
                        <select 
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        >
                          <option value="Packaging">Packaging</option>
                          <option value="Food Packaging">Food Packaging</option>
                          <option value="Display Systems">Display Systems</option>
                          <option value="Commercial Printing">Commercial Printing</option>
                          <option value="Luxury Packaging">Luxury Packaging</option>
                          <option value="Corporate">Corporate</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Price Range (e.g. ₹ 45 – ₹ 250) *</label>
                        <input 
                          type="text" 
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">MOQ (e.g. 500 pcs) *</label>
                        <input 
                          type="text" 
                          value={editingProduct.moq}
                          onChange={(e) => setEditingProduct({...editingProduct, moq: e.target.value})}
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs font-bold text-gray-700 uppercase">Min Price (for sorting) *</label>
                        <input 
                          type="number" 
                          value={editingProduct.min_price}
                          onChange={(e) => setEditingProduct({...editingProduct, min_price: parseInt(e.target.value) || 0})}
                          required
                          className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Image Alt Text (SEO) *</label>
                      <input 
                        type="text" 
                        value={editingProduct.image_alt}
                        onChange={(e) => setEditingProduct({...editingProduct, image_alt: e.target.value})}
                        required
                        placeholder="Describe the image for search engines"
                        className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-700 uppercase">Product Image</label>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-200 relative">
                          {uploadingImage ? (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
                            </div>
                          ) : editingProduct.image_url ? (
                            <img src={editingProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={32} className="text-gray-300" />
                          )}
                        </div>
                        <label className="flex-1 cursor-pointer">
                          <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:border-[var(--primary)] text-center transition-colors">
                            <span className="text-xs font-bold text-gray-500">
                              {uploadingImage ? 'Uploading...' : 'Click to upload product image'}
                            </span>
                          </div>
                          <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={handleProductImageUpload} className="hidden" disabled={uploadingImage} />
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-[var(--primary)] text-white rounded-lg font-bold shadow-lg hover:bg-[var(--primary-dark)] flex items-center justify-center gap-2">
                      <Save size={18} /> Save Product
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-xl font-bold text-[var(--secondary)] mb-6">Site Appearance Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Upload Logo (.svg, .png, .jpg, .webp)</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:border-[var(--primary)] transition-all flex flex-col items-center justify-center gap-2">
                      <Package2 size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-500">Click to select or drag & drop</span>
                      <span className="text-[10px] text-gray-400 uppercase">SVG, PNG, JPG, WEBP (Max 5MB)</span>
                    </div>
                    <input 
                      type="file" 
                      accept=".svg,.png,.jpg,.jpeg,.webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const formData = new FormData();
                        formData.append('logo', file);
                        
                        setSavingSettings(true);
                        try {
                          const response = await fetch('/api/upload-logo', {
                            method: 'POST',
                            body: formData,
                          });
                          if (response.ok) {
                            const data = await response.json();
                            setLogoUrl(data.logo_url);
                            alert('Logo uploaded successfully!');
                            mutate('/api/settings');
                          } else {
                            const err = await response.json();
                            alert(err.error || 'Upload failed');
                          }
                        } catch (error) {
                          alert('Failed to upload logo');
                        } finally {
                          setSavingSettings(false);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase mb-3">Current Logo Preview</div>
                <div className="flex items-center justify-center p-8 bg-[var(--secondary)] rounded-lg">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo Preview" className="h-20 w-auto" />
                  ) : (
                    <div className="text-gray-500 text-sm italic">No logo uploaded</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle size={12} className="text-green-500" /> 
                Logo updates are applied instantly to header and footer.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
