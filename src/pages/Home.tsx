import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, ClipboardList, Phone, Rocket, Send, Loader2, CheckCircle, 
  Factory, Target, Truck, Lightbulb, Package, Gift, Cake, Book, 
  FileText, Store, Diamond, Layout, Camera, Palette, Mail, 
  MapPin, Clock, Building2, Flame, Sparkles, ArrowRight, Printer
} from 'lucide-react';
import { SITE } from '../constants';
import { useProducts, useServices } from '../hooks/useApi';

interface HomeProps {
  onOpenModal: (product?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onOpenModal }) => {
  const { products, isLoading: productsLoading } = useProducts();
  const { services, isLoading: servicesLoading } = useServices();
  const loading = productsLoading || servicesLoading;

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

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'Packaging': return <Package size={40} />;
      case 'Food Packaging': return <Cake size={40} />;
      case 'Display Systems': return <Store size={40} />;
      case 'Commercial Printing': return <Book size={40} />;
      case 'Printing': return <FileText size={40} />;
      case 'Luxury Packaging': return <Diamond size={40} />;
      case 'Corporate': return <Target size={40} />;
      default: return <Package size={40} />;
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

  const badgeMap: Record<string, React.ReactNode> = {
    hot: <span className="badge badge-hot flex items-center gap-1"><Flame size={10} /> HOT</span>,
    popular: <span className="badge badge-popular flex items-center gap-1"><Star size={10} /> Popular</span>,
    new: <span className="badge badge-new flex items-center gap-1"><Sparkles size={10} /> NEW</span>
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Only observe static elements that are present on mount
    document.querySelectorAll('.reveal:not(.product-card)').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Separate effect for dynamic products to ensure they are observed after render
  React.useEffect(() => {
    if (loading || products.length === 0) return;
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [products, loading]);

  const [homeFormStatus, setHomeFormStatus] = React.useState<'idle' | 'sending' | 'success'>('idle');

  const handleHomeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHomeFormStatus('sending');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setHomeFormStatus('success');
        setTimeout(() => setHomeFormStatus('idle'), 5000);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send enquiry. Please try again.');
      setHomeFormStatus('idle');
    }
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section py-9 bg-linear-to-br from-[var(--secondary)] via-[var(--secondary-light)] to-[var(--secondary)] relative overflow-hidden" aria-label="Hero banner">
        <div className="hero-grid max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-7 items-center relative">
          <div className="hero-content">
            <div className="hero-pill inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full py-1 px-3.5 text-xs text-blue-100 mb-3.5">
              <Star size={12} className="text-[var(--accent)]" /> Trusted Since 1975 · 50+ Years of Excellence
            </div>
            <h1 className="font-baloo text-[34px] font-extrabold text-white leading-tight mb-2.5">
              India's Leading <span>Print & Packaging</span> Manufacturer
            </h1>
            <p className="text-blue-100 text-sm mb-5.5 max-w-[500px]">
              Complete solutions for Offset Printing, Custom Packaging & 3D Display Units. Serving FMCG, Pharma, Beauty, Automotive & 14+ industries nationwide from Noida, UP.
            </p>
            <div className="hero-stats flex gap-7 mb-5.5">
              <div className="hero-stat">
                <div className="num font-baloo text-[26px] font-extrabold text-[var(--accent)]">50+</div>
                <div className="lbl text-[11px] text-blue-100">Years Experience</div>
              </div>
              <div className="hero-stat">
                <div className="num font-baloo text-[26px] font-extrabold text-[var(--accent)]">500+</div>
                <div className="lbl text-[11px] text-blue-100">Happy Clients</div>
              </div>
              <div className="hero-stat">
                <div className="num font-baloo text-[26px] font-extrabold text-[var(--accent)]">2L sq.ft</div>
                <div className="lbl text-[11px] text-blue-100">Workspace</div>
              </div>
            </div>
            <div className="hero-btns flex gap-3">
              <button className="btn-lg btn-orange flex items-center gap-2" onClick={() => onOpenModal()}>
                <ClipboardList size={18} /> Send Enquiry
              </button>
              <a href={`tel:${SITE.tel}`} className="btn-lg bg-white text-[var(--secondary)] inline-flex items-center gap-2 no-underline hover:bg-gray-100 transition-all">
                <Phone size={18} /> Call Now
              </a>
            </div>
          </div>
          <div className="enquiry-card bg-white rounded-xl p-6 shadow-lg hidden lg:block">
            <h3 className="font-baloo text-lg text-[var(--secondary)] mb-4 font-bold flex items-center gap-2">
              <Rocket size={20} className="text-[var(--primary)]" /> Get Free Quote Today!
            </h3>
            <form className="enquiry-form" onSubmit={handleHomeSubmit}>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                <input type="text" name="name" placeholder="Full Name" required className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile *</label>
                <input type="tel" name="mobile" placeholder="+91 XXXXX XXXXX" required className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                <input type="email" name="email" placeholder="you@email.com" className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 mb-1">Product *</label>
                <select name="product" className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]">
                  <option value="">Select Category</option>
                  <option value="Rigid Boxes / Gift Boxes">Rigid Boxes / Gift Boxes</option>
                  <option value="Mono Cartons / Pharma Packaging">Mono Cartons / Pharma Packaging</option>
                  <option value="Food Packaging">Food Packaging</option>
                  <option value="3D Display Units">3D Display Units</option>
                  <option value="Commercial Printing / Books">Commercial Printing / Books</option>
                  <option value="Brochures / Catalogs">Brochures / Catalogs</option>
                </select>
              </div>
              <button 
                type="submit" 
                className={`submit-btn w-full p-2.5 rounded-md text-sm font-bold cursor-pointer flex items-center justify-center gap-2 transition-all ${homeFormStatus === 'success' ? 'bg-green-600' : 'bg-[var(--primary)]'} text-white hover:bg-[var(--primary-dark)]`}
                disabled={homeFormStatus !== 'idle'}
              >
                {homeFormStatus === 'idle' && <><Send size={16} /> Submit Enquiry</>}
                {homeFormStatus === 'sending' && <><Loader2 size={16} className="animate-spin" /> Sending...</>}
                {homeFormStatus === 'success' && <><CheckCircle size={16} /> Submitted!</>}
              </button>
              <p className="form-note text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1.5">
                <CheckCircle size={12} className="text-green-500" /> Response within 2 working hours
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="trust-strip bg-linear-to-br from-[var(--secondary)] to-[var(--secondary-light)] py-6" aria-label="Company highlights">
        <div className="container">
          <div className="trust-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="trust-item text-center p-4 border-r border-white/10 flex items-center gap-3.5 last:border-none">
              <div className="trust-icon text-[var(--accent)]">
                <Factory size={32} />
              </div>
              <div className="text-left">
                <span className="trust-number font-baloo text-[22px] font-extrabold text-[var(--accent)] block">3 Acres</span>
                <span className="trust-label text-xs text-blue-100">Manufacturing Facility, Noida</span>
              </div>
            </div>
            <div className="trust-item text-center p-4 border-r border-white/10 flex items-center gap-3.5 last:border-none">
              <div className="trust-icon text-[var(--accent)]">
                <Target size={32} />
              </div>
              <div className="text-left">
                <span className="trust-number font-baloo text-[22px] font-extrabold text-[var(--accent)] block">ISO Certified</span>
                <span className="trust-label text-xs text-blue-100">Quality Management System</span>
              </div>
            </div>
            <div className="trust-item text-center p-4 border-r border-white/10 flex items-center gap-3.5 last:border-none">
              <div className="trust-icon text-[var(--accent)]">
                <Truck size={32} />
              </div>
              <div className="text-left">
                <span className="trust-number font-baloo text-[22px] font-extrabold text-[var(--accent)] block">PAN India</span>
                <span className="trust-label text-xs text-blue-100">Delivery & Logistics Support</span>
              </div>
            </div>
            <div className="trust-item text-center p-4 border-r border-white/10 flex items-center gap-3.5 last:border-none">
              <div className="trust-icon text-[var(--accent)]">
                <Lightbulb size={32} />
              </div>
              <div className="text-left">
                <span className="trust-number font-baloo text-[22px] font-extrabold text-[var(--accent)] block">End-to-End</span>
                <span className="trust-label text-xs text-blue-100">Design, Print, Package & Deliver</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="categories-section py-8 bg-white" aria-labelledby="cat-title">
        <div className="container">
          <div className="section-header flex justify-between items-center mb-6">
            <div>
              <h2 className="section-title" id="cat-title">Browse by <span>Category</span></h2>
              <p className="section-sub text-sm text-gray-500 mt-1">Explore our complete range of printing & packaging products</p>
            </div>
            <Link to="/products" className="view-all text-blue-600 text-[13px] font-semibold no-underline hover:text-[var(--primary)] flex items-center gap-1">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
          <div className="categories-grid grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { icon: <Package size={32} />, name: 'Rigid Boxes', link: '/packaging#rigid' },
              { icon: <Gift size={32} />, name: 'Gift Boxes', link: '/packaging#gift' },
              { icon: <Cake size={32} />, name: 'Food Packaging', link: '/packaging#food' },
              { icon: <Book size={32} />, name: 'Books & Catalogs', link: '/printing#books' },
              { icon: <FileText size={32} />, name: 'Brochures', link: '/printing#brochures' },
              { icon: <Store size={32} />, name: 'Display Units', link: '/display-units' },
              { icon: <Diamond size={32} />, name: 'Luxury Packs', link: '/packaging#luxury' },
            ].map((cat, i) => (
              <Link key={i} className="category-card reveal text-center p-4 rounded-lg transition-all duration-200 border-2 border-transparent bg-gray-50 no-underline hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:-translate-y-0.5" to={cat.link}>
                <span className="cat-icon text-[var(--primary)] mb-2 flex justify-center">{cat.icon}</span>
                <div className="cat-name text-[11px] font-bold text-gray-700">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider h-[5px] bg-linear-to-r from-[var(--primary)] to-[var(--secondary)]"></div>

      {/* PRODUCTS */}
      <section className="products-section py-8" aria-labelledby="prod-title">
        <div className="container">
          <div className="section-header flex justify-between items-center mb-6">
            <div>
              <h2 className="section-title" id="prod-title">Our <span>Products</span></h2>
              <p className="section-sub text-sm text-gray-500 mt-1">Premium quality with competitive pricing. MOQ-friendly.</p>
            </div>
            <Link to="/products" className="view-all text-blue-600 text-[13px] font-semibold no-underline hover:text-[var(--primary)] flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
              ))
            ) : products.length > 0 ? (
              products.slice(0, 8).map(p => (
                <div key={p.id} className="product-card reveal">
                  <Link to={p.link || '/products'} className="no-underline">
                    <div className="product-img w-full aspect-4/3 flex items-center justify-center text-white relative overflow-hidden group" style={{ background: getProductBg(p.category) }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.image_alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      ) : (
                        <div className="transition-transform duration-300 group-hover:scale-110">
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
                      <div className="product-price font-baloo text-base font-bold text-[var(--primary)]">{p.price}</div>
                      <div className="product-moq text-[11px] text-gray-500 mt-0.5">MOQ: {p.moq}</div>
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-green-600 font-bold bg-green-100 py-0.5 px-2 rounded w-fit">
                        <CheckCircle size={10} /> GST Verified
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 pt-0">
                    <button className="enquire-btn" onClick={() => onOpenModal(p.name)}>Send Enquiry</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No products found</h3>
                <p className="text-sm text-gray-500 mb-4">We're currently updating our catalog.</p>
                <Link to="/products" className="btn-primary no-underline inline-block">View All Products</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section py-8 bg-gray-50" aria-labelledby="svc-title">
        <div className="container">
          <div className="section-header flex justify-between items-center mb-6">
            <div>
              <h2 className="section-title" id="svc-title">Our <span>Services</span></h2>
              <p className="section-sub text-sm text-gray-500 mt-1">End-to-end solutions under one roof</p>
            </div>
            <Link to="/services" className="view-all text-blue-600 text-[13px] font-semibold no-underline hover:text-[var(--primary)] flex items-center gap-1">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc, i) => (
              <Link key={i} className="service-card reveal bg-white rounded-xl p-6 border-[1.5px] border-gray-100 transition-all duration-200 cursor-pointer relative overflow-hidden no-underline block group hover:shadow-lg hover:border-[var(--primary)]" to={svc.link}>
                <div className="svc-icon text-[var(--primary)] mb-3 h-10 flex items-center">
                  {svc.image_url ? (
                    <img src={svc.image_url} alt={svc.name} className="h-full object-contain" />
                  ) : (
                    getIconByName(svc.icon_name)
                  )}
                </div>
                <div className="svc-name font-baloo text-lg font-bold text-[var(--secondary)] mb-1.5">{svc.name}</div>
                <div className="svc-desc text-[13px] text-gray-500 leading-relaxed">{svc.description}</div>
                <div className="svc-tags flex flex-wrap gap-1.5 mt-3">
                  {svc.tags.map((tag, j) => <span key={j} className="svc-tag bg-gray-100 text-gray-700 py-0.5 px-2.5 rounded-full text-[11px] font-semibold">{tag}</span>)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--primary)] scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="industries-section py-8" aria-labelledby="ind-title">
        <div className="container">
          <div className="section-header flex justify-between items-center mb-6">
            <div>
              <h2 className="section-title" id="ind-title">Industries We <span>Serve</span></h2>
              <p className="section-sub text-sm text-gray-500 mt-1">Trusted by leading brands across 14+ sectors</p>
            </div>
            <Link to="/industries" className="view-all text-blue-600 text-[13px] font-semibold no-underline hover:text-[var(--primary)] flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="industries-grid grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { icon: <Sparkles size={20} />, name: 'FMCG', link: '/industries#fmcg' },
              { icon: <Target size={20} />, name: 'Pharma', link: '/industries#pharma' },
              { icon: <Star size={20} />, name: 'Beauty', link: '/industries#beauty' },
              { icon: <Cake size={20} />, name: 'Food & Bev', link: '/industries#food' },
              { icon: <Building2 size={20} />, name: 'IT & Tech', link: '/industries#it' },
              { icon: <Building2 size={20} />, name: 'Banking', link: '/industries#banking' },
              { icon: <Building2 size={20} />, name: 'Telecom', link: '/industries#telecom' },
              { icon: <Book size={20} />, name: 'Education', link: '/industries#education' },
              { icon: <Building2 size={20} />, name: 'Hospitality', link: '/industries#hospitality' },
              { icon: <Truck size={20} />, name: 'Automotive', link: '/industries#auto' },
              { icon: <Building2 size={20} />, name: 'Real Estate', link: '/industries#realestate' },
              { icon: <Building2 size={20} />, name: 'Spirits', link: '/industries#spirits' },
              { icon: <Diamond size={20} />, name: 'Jewellery', link: '/industries#jewellery' },
              { icon: <Palette size={20} />, name: 'Art & Media', link: '/industries#art' },
            ].map((ind, i) => (
              <Link key={i} className="ind-badge reveal p-2.5 bg-white border-[1.5px] border-gray-200 rounded-lg text-center text-[11px] font-bold text-gray-700 cursor-pointer transition-all duration-200 flex flex-col items-center gap-1.5 no-underline hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]" to={ind.link}>
                <span className="ind-icon text-[var(--primary)]">{ind.icon}</span>
                {ind.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS TICKER */}
      <section className="clients-section py-7 bg-gray-50" aria-label="Our clients">
        <div className="container">
          <div className="section-header mb-4">
            <div>
              <h2 className="section-title">Our Valued <span>Clients</span></h2>
              <p className="section-sub text-sm text-gray-500 mt-1">Trusted by India's most prestigious brands</p>
            </div>
          </div>
        </div>
        <div className="clients-ticker overflow-hidden relative mt-4">
          <div className="clients-track flex gap-10 animate-[ticker_22s_linear_infinite] w-max">
            {[
              'Hindustan Unilever', 'Sun Pharma', 'L\'Oréal India', 'McDonald\'s', 'HDFC Bank', 'Vodafone India', 'Maruti Suzuki', 'Dabur India', 'Wipro', 'Taj Hotels', 'NIIT', 'Himalaya Drug'
            ].concat([
              'Hindustan Unilever', 'Sun Pharma', 'L\'Oréal India', 'McDonald\'s', 'HDFC Bank', 'Vodafone India', 'Maruti Suzuki', 'Dabur India', 'Wipro', 'Taj Hotels', 'NIIT', 'Himalaya Drug'
            ]).map((client, i) => (
              <div key={i} className="client-logo bg-white border-[1.5px] border-gray-200 rounded-lg py-2.5 px-5 text-[13px] font-bold text-gray-500 whitespace-nowrap flex items-center gap-2">
                <Building2 size={14} /> {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section py-8 bg-white" aria-labelledby="testi-title">
        <div className="container">
          <div className="section-header mb-6">
            <div>
              <h2 className="section-title" id="testi-title">What Clients <span>Say</span></h2>
              <p className="section-sub text-sm text-gray-500 mt-1">5-star reviews from India's top brands</p>
            </div>
          </div>
          <div className="testimonials-grid grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              { text: 'Solar Print has been our go-to packaging partner for over 8 years. Their quality is unmatched and turnaround time is always on point. Highly recommend for premium packaging.', author: 'Rahul Mehta', co: 'Head of Procurement, HUL', bg: 'var(--primary)' },
              { text: 'We needed complex luxury packaging for our skincare launch. Solar delivered beyond expectations — the finish, the feel, everything was premium and perfectly on-brand.', author: 'Priya Sharma', co: 'Brand Manager, L\'Oréal India', bg: 'var(--secondary)' },
              { text: 'Their 3D display units transformed our in-store presence completely. The design team is creative, responsive and deeply understands retail marketing.', author: 'Anil Kapoor', co: 'Marketing Director, Dabur', bg: 'var(--green)' },
            ].map((testi, i) => (
              <div key={i} className="testi-card reveal bg-gray-50 rounded-lg p-5.5 border border-gray-100 relative">
                <p className="testi-text text-[13px] text-gray-700 leading-relaxed mb-3.5 pt-6 italic">{testi.text}</p>
                <div className="testi-author flex items-center gap-2.5">
                  <div className="avatar w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold text-white shrink-0" style={{ background: testi.bg }}>{testi.author[0]}</div>
                  <div>
                    <div className="author-name text-[13px] font-bold text-gray-900">{testi.author}</div>
                    <div className="author-co text-[11px] text-gray-500">{testi.co}</div>
                    <div className="stars text-[var(--accent)] flex gap-0.5">
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <div className="about-strip bg-[var(--primary-light)] border-t-3 border-b-3 border-[var(--primary)] py-7">
        <div className="container">
          <div className="about-strip-grid grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-8 items-center">
            <div className="about-text">
              <h2 className="font-baloo text-xl font-extrabold text-[var(--secondary)] mb-2 flex items-center gap-2">
                <Sparkles className="text-[var(--primary)]" /> About Solar Print Process Pvt. Ltd.
              </h2>
              <p className="text-[13px] text-gray-700 leading-relaxed">Established in 1975, Solar Print Process Pvt. Ltd. is a renowned process-driven company offering professional printing and innovative packaging solutions. Spread across 3 acres with over 2,0,000 sq. ft. of workspace in Sector 85, Noida — we are the complete solution for Print, Packaging, and Production needs across India.</p>
              <div className="mt-3.5 flex items-center gap-1">
                <Link to="/about" className="btn-lg btn-secondary text-[13px] py-2.5 px-6 no-underline inline-flex items-center gap-2">
                  Learn More About Us <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div>
              <div className="contact-item flex items-center gap-2.5 mb-2.5">
                <div className="ci-icon w-9 h-9 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white shrink-0">
                  <Phone size={18} />
                </div>
                <div><div className="ci-label text-[11px] text-gray-500">Phone</div><div className="ci-value text-sm font-bold text-[var(--secondary)]">{SITE.phone}</div></div>
              </div>
              <div className="contact-item flex items-center gap-2.5 mb-2.5">
                <div className="ci-icon w-9 h-9 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white shrink-0">
                  <Mail size={18} />
                </div>
                <div><div className="ci-label text-[11px] text-gray-500">Email</div><div className="ci-value text-sm font-bold text-[var(--secondary)]">{SITE.email}</div></div>
              </div>
            </div>
            <div>
              <div className="contact-item flex items-center gap-2.5 mb-2.5">
                <div className="ci-icon w-9 h-9 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white shrink-0">
                  <MapPin size={18} />
                </div>
                <div><div className="ci-label text-[11px] text-gray-500">Address</div><div className="ci-value text-sm font-bold text-[var(--secondary)]">{SITE.address}</div></div>
              </div>
              <div className="contact-item flex items-center gap-2.5 mb-2.5">
                <div className="ci-icon w-9 h-9 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white shrink-0">
                  <Clock size={18} />
                </div>
                <div><div className="ci-label text-[11px] text-gray-500">Working Hours</div><div className="ci-value text-sm font-bold text-[var(--secondary)]">{SITE.hours}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
