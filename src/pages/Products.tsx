import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, Printer, Store, Diamond, Cake, Target, Search, 
  Gift, Book, FileText, ClipboardList, Flame, Star, 
  Sparkles, CheckCircle, Phone, Camera, ShoppingCart, 
  Tag, Layout, Box, Monitor, Palette, Truck
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SITE } from '../constants';

interface Product {
  id: number;
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

interface Service {
  id: number;
  name: string;
  description: string;
  image_url: string;
  icon_name: string;
  tags: string[];
  link: string;
}

interface ProductsProps {
  onOpenModal: (product?: string) => void;
}

const Products: React.FC<ProductsProps> = ({ onOpenModal }) => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = React.useState('all');
  const [sort, setSort] = React.useState('default');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const query = searchParams.get('q') || '';

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

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchServices()]);
      setLoading(false);
    };
    init();
  }, []);

  const getIconByName = (name: string, size = 40) => {
    switch (name) {
      case 'Printer': return <Printer size={size} />;
      case 'Package': return <Package size={size} />;
      case 'Layout': return <Layout size={size} />;
      case 'Palette': return <Palette size={size} />;
      case 'Camera': return <Camera size={size} />;
      case 'Truck': return <Truck size={size} />;
      case 'Store': return <Store size={size} />;
      case 'Book': return <Book size={size} />;
      case 'FileText': return <FileText size={size} />;
      case 'Diamond': return <Diamond size={size} />;
      case 'Target': return <Target size={size} />;
      default: return <Package size={size} />;
    }
  };

  const badgeMap: Record<string, React.ReactNode> = {
    hot: <span className="badge badge-hot flex items-center gap-1"><Flame size={10} /> HOT</span>,
    popular: <span className="badge badge-popular flex items-center gap-1"><Star size={10} /> Popular</span>,
    new: <span className="badge badge-new flex items-center gap-1"><Sparkles size={10} /> NEW</span>
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filter, sort, query, products]);

  const filteredProducts = React.useMemo(() => {
    let prods = [...products];
    if (filter !== 'all') prods = prods.filter(p => p.sub_category === filter);
    if (query) {
      const q = query.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === 'price-low') prods.sort((a, b) => a.min_price - b.min_price);
    else if (sort === 'price-high') prods.sort((a, b) => b.min_price - a.min_price);
    else if (sort === 'name') prods.sort((a, b) => a.name.localeCompare(b.name));
    return prods;
  }, [filter, sort, query, products]);

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'Packaging': return <Package size={52} />;
      case 'Food Packaging': return <Cake size={52} />;
      case 'Display Systems': return <Store size={52} />;
      case 'Commercial Printing': return <Book size={52} />;
      case 'Printing': return <FileText size={52} />;
      case 'Luxury Packaging': return <Diamond size={52} />;
      case 'Corporate': return <Target size={52} />;
      default: return <Package size={52} />;
    }
  };

  const getProductBg = (category: string) => {
    switch (category) {
      case 'Packaging': return 'linear-gradient(135deg,#fde68a,#fbbf24)';
      case 'Food Packaging': return 'linear-gradient(135deg,#d1fae5,#6ee7b7)';
      case 'Display Systems': return 'linear-gradient(135deg,#fce7f3,#f9a8d4)';
      case 'Commercial Printing': return 'linear-gradient(135deg,#ede9fe,#c4b5fd)';
      case 'Printing': return 'linear-gradient(135deg,#ffedd5,#fed7aa)';
      case 'Luxury Packaging': return 'linear-gradient(135deg,#ecfdf5,#6ee7b7)';
      case 'Corporate': return 'linear-gradient(135deg,#e0f2fe,#7dd3fc)';
      default: return 'linear-gradient(135deg,#f3f4f6,#d1d5db)';
    }
  };

  return (
    <div className="products-page">
      <Breadcrumb currentPage="All Products" />
      <div className="page-hero">
        <div className="inner">
          <h1>Our <span>Products</span></h1>
          <p>Premium quality printing & packaging products with competitive pricing. Low MOQ. PAN India delivery. GST invoices provided.</p>
        </div>
      </div>

      <div className="filter-bar bg-white border-b border-gray-200 py-3.5 sticky top-16 z-90">
        <div className="container">
          <div className="filter-inner flex items-center gap-3 flex-wrap">
            <strong className="text-[13px] text-gray-700">Filter:</strong>
            {[
              { id: 'all', label: 'All Products', icon: null },
              { id: 'packaging', label: 'Packaging', icon: <Package size={14} /> },
              { id: 'printing', label: 'Printing', icon: <Printer size={14} /> },
              { id: 'display', label: 'Display', icon: <Store size={14} /> },
              { id: 'luxury', label: 'Luxury', icon: <Diamond size={14} /> },
              { id: 'food', label: 'Food', icon: <Cake size={14} /> },
              { id: 'corporate', label: 'Corporate', icon: <Target size={14} /> },
            ].map(f => (
              <button 
                key={f.id}
                className={`filter-btn py-1.5 px-4 rounded-full border-[1.5px] border-gray-200 bg-white text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] flex items-center gap-2 ${filter === f.id ? 'active bg-[var(--primary)] text-white border-[var(--primary)]' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-8">
        <div className="container">
          {query && (
            <div className="search-highlight bg-[var(--primary-light)] border-2 border-[var(--primary)] rounded-lg p-3 px-4 mb-5 text-sm text-[var(--secondary)] flex items-center gap-2">
              <Search size={16} /> Showing results for: <strong>{query}</strong> — <Link to="/products" className="text-[var(--primary)] no-underline">Clear search</Link>
            </div>
          )}
          <div className="sort-bar flex items-center justify-between mb-5">
            <div className="result-count text-[13px] text-gray-500">Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</div>
            <select 
              className="sort-select p-1.5 px-3.5 border-[1.5px] border-gray-200 rounded-md text-[13px] outline-none cursor-pointer"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-page-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
              {filteredProducts.map(p => (
                <div key={p.id} className="product-card reveal">
                  <Link to={p.link || '/products'} className="no-underline">
                    <div className="product-img w-full aspect-4/3 flex items-center justify-center relative overflow-hidden group" style={{ background: getProductBg(p.category) }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.image_alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      ) : (
                        <div className="text-gray-800 transition-transform duration-300 group-hover:scale-110">
                          {getProductIcon(p.category)}
                        </div>
                      )}
                      <div className="overlay absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/45 opacity-0 transition-opacity duration-200 flex items-end p-2.5 group-hover:opacity-100">
                        <button className="overlay-btn bg-[var(--primary)] text-white py-1.5 px-3.5 rounded text-xs font-bold border-none cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenModal(p.name); }}>Quick Enquiry</button>
                      </div>
                      {p.badge && <div className="feat-badge absolute top-2.5 left-2.5 z-10">{badgeMap[p.badge]}</div>}
                    </div>
                    <div className="product-info p-3">
                      <div className="product-name font-bold text-sm text-gray-900 mb-1 leading-tight">{p.name}</div>
                      <div className="product-category text-[11px] text-gray-500 mb-2">{p.category}</div>
                      <div className="product-price font-baloo text-base font-bold text-[var(--primary)]">{p.price} <span className="text-[11px] font-normal text-gray-500 font-sans">/ piece</span></div>
                      <div className="product-moq text-[11px] text-gray-500 mt-0.5">Min Order: {p.moq}</div>
                      <div className="mt-1.5"><span className="verified inline-flex items-center gap-1 text-[11px] text-green-600 font-bold bg-green-100 py-0.5 px-2 rounded"><CheckCircle size={10} /> GST Verified</span></div>
                    </div>
                  </Link>
                  <div className="p-3 pt-0">
                    <button className="enquire-btn" onClick={() => onOpenModal(p.name)}>Send Enquiry</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results text-center py-15 px-5 text-gray-500">
              <div className="flex justify-center mb-3">
                <Search size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold">No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="btn-lg btn-orange mt-4" onClick={() => { setFilter('all'); setSort('default'); }}>Show All Products</button>
            </div>
          )}
        </div>
      </section>

      <div className="bg-[var(--primary-light)] border-t-3 border-[var(--primary)] py-12">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-baloo text-3xl font-extrabold text-[var(--secondary)] mb-2">Our Core <span>Services</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Beyond products, we offer end-to-end manufacturing and design services to support your business growth.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <Link key={i} className="bg-white rounded-2xl p-6 border-[1.5px] border-gray-100 transition-all duration-200 no-underline block group hover:shadow-xl hover:border-[var(--primary)]" to={svc.link}>
                <div className="text-[var(--primary)] mb-4 h-12 flex items-center">
                  {svc.image_url ? (
                    <img src={svc.image_url} alt={svc.name} className="h-full object-contain" />
                  ) : (
                    getIconByName(svc.icon_name, 48)
                  )}
                </div>
                <h3 className="font-baloo text-xl font-bold text-[var(--secondary)] mb-2">{svc.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {svc.tags.map((tag, j) => <span key={j} className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded text-[10px] font-bold">{tag}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-12 text-center">
        <div className="container">
          <h2 className="font-baloo text-2xl font-extrabold text-[var(--secondary)] mb-2">Can't find what you're looking for?</h2>
          <p className="text-gray-500 mb-5">We manufacture custom products to your specifications. Tell us your requirement!</p>
          <div className="flex justify-center items-center gap-3">
            <button className="btn-lg btn-orange flex items-center gap-2" onClick={() => onOpenModal()}>
              <ClipboardList size={20} /> Send Custom Requirement
            </button>
            <a href={`tel:${SITE.tel}`} className="btn-lg btn-secondary no-underline inline-flex items-center gap-2">
              <Phone size={20} /> Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
