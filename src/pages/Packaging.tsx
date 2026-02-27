import React from 'react';
import { 
  Package, Pill, Gift, Cake, Diamond, Box, 
  Settings, Sparkles, Award, Circle, Palette, 
  Scissors, Ruler, Ribbon, ClipboardList, Phone, 
  ArrowRight, CheckCircle, Eye
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

interface PackagingProps {
  onOpenModal: (product?: string) => void;
}

const Packaging: React.FC<PackagingProps> = ({ onOpenModal }) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const sections = [
    {
      id: 'rigid',
      icon: <Package size={32} />,
      title: 'Rigid Boxes',
      sub: 'Premium setup/teardown boxes for premium products',
      items: products.filter(p => p.sub_category === 'rigid' || (p.category === 'Packaging' && p.name.toLowerCase().includes('rigid')))
    },
    {
      id: 'mono',
      icon: <Pill size={32} />,
      title: 'Mono Carton Packaging',
      sub: 'For Pharma, FMCG, Food and more',
      items: products.filter(p => p.sub_category === 'mono' || (p.category === 'Packaging' && p.name.toLowerCase().includes('carton')))
    },
    {
      id: 'gift',
      icon: <Gift size={32} />,
      title: 'Gift Boxes',
      sub: 'Custom gift packaging for every occasion',
      items: products.filter(p => p.sub_category === 'gift' || (p.category === 'Packaging' && p.name.toLowerCase().includes('gift')))
    },
    {
      id: 'food',
      icon: <Cake size={32} />,
      title: 'Food Packaging',
      sub: 'FDA compliant, food-safe packaging solutions',
      items: products.filter(p => p.category === 'Food Packaging')
    },
  ];

  const luxuryItems = products.filter(p => p.category === 'Luxury Packaging');

  const getProductBg = (category: string) => {
    switch (category) {
      case 'Packaging': return 'linear-gradient(135deg,#fff3e0,#f58220)';
      case 'Food Packaging': return 'linear-gradient(135deg,#d1fae5,#16a34a)';
      case 'Luxury Packaging': return 'linear-gradient(135deg,#e0f2fe,#1e3a5f)';
      default: return 'linear-gradient(135deg,#f3f4f6,#d1d5db)';
    }
  };

  return (
    <div className="packaging-page">
      <Breadcrumb currentPage="Custom Packaging" />
      <div className="page-hero">
        <div className="inner">
          <h1>Custom <span>Packaging</span></h1>
          <p>Premium packaging solutions that protect your product and elevate your brand. Low MOQ. GST invoices. PAN India delivery.</p>
        </div>
      </div>

      <div className="pack-hero-strip bg-[var(--primary-light)] border-b-3 border-[var(--primary)] py-5">
        <div className="container">
          <div className="pack-categories flex gap-3 flex-wrap">
            {sections.map(s => (
              <a key={s.id} className="pack-cat-btn py-2 px-5 rounded-full border-2 border-gray-200 bg-white text-[13px] font-bold cursor-pointer transition-all duration-200 no-underline text-gray-700 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] flex items-center gap-2" href={`#${s.id}`}>
                {s.icon} {s.title}
              </a>
            ))}
            <a className="pack-cat-btn py-2 px-5 rounded-full border-2 border-gray-200 bg-white text-[13px] font-bold cursor-pointer transition-all duration-200 no-underline text-gray-700 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] flex items-center gap-2" href="#luxury">
              <Diamond size={14} /> Luxury Boxes
            </a>
          </div>
        </div>
      </div>

      <section className="packaging-section py-12">
        <div className="container">
          {sections.map(section => (
            <div key={section.id} className="pack-section-block mb-15" id={section.id}>
              <div className="pack-section-header flex items-center gap-3.5 mb-6 pb-3.5 border-b-2 border-gray-100">
                <div className="pack-section-icon text-[var(--primary)]">{section.icon}</div>
                <div>
                  <div className="pack-section-title font-baloo text-[22px] font-bold text-[var(--secondary)]">{section.title}</div>
                  <div className="pack-section-sub text-[13px] text-gray-500">{section.sub}</div>
                </div>
              </div>
              <div className="pack-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {section.items.map((item, i) => (
                  <div key={i} className="pack-card reveal bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]">
                    <div className="pack-card-img h-[180px] flex items-center justify-center relative" style={{ background: getProductBg(item.category) }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.image_alt} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-800 opacity-80">
                          {React.cloneElement(section.icon as React.ReactElement, { size: 56 } as any)}
                        </div>
                      )}
                    </div>
                    <div className="pack-card-body p-4">
                      <div className="pack-card-name font-baloo text-base font-bold text-[var(--secondary)] mb-1">{item.name}</div>
                      <div className="pack-card-desc text-xs text-gray-500 mb-2.5 leading-relaxed">{item.category}</div>
                      <div className="pack-price font-baloo text-[15px] text-[var(--primary)] font-bold">{item.price}</div>
                      <div className="pack-moq text-[11px] text-gray-500">MOQ: {item.moq}</div>
                      <button className="enquire-btn" onClick={() => onOpenModal(item.name)}>Send Enquiry</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* LUXURY SECTION */}
          <div className="pack-section-block mb-15" id="luxury">
            <div className="pack-section-header flex items-center gap-3.5 mb-6 pb-3.5 border-b-2 border-gray-100">
              <div className="pack-section-icon text-[var(--primary)]">
                <Diamond size={40} />
              </div>
              <div>
                <div className="pack-section-title font-baloo text-[22px] font-bold text-[var(--secondary)]">Luxury Packaging</div>
                <div className="pack-section-sub text-[13px] text-gray-500">Premium materials for premium brands</div>
              </div>
            </div>
            <div className="pack-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {luxuryItems.map((item, i) => (
                <div key={i} className="pack-card reveal bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]">
                  <div className="pack-card-img h-[180px] flex items-center justify-center relative" style={{ background: getProductBg(item.category) }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.image_alt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-800 opacity-80">
                        <Diamond size={56} />
                      </div>
                    )}
                  </div>
                  <div className="pack-card-body p-4">
                    <div className="pack-card-name font-baloo text-base font-bold text-[var(--secondary)] mb-1">{item.name}</div>
                    <div className="pack-card-desc text-xs text-gray-500 mb-2.5 leading-relaxed">{item.category}</div>
                    <div className="pack-price font-baloo text-[15px] text-[var(--primary)] font-bold">{item.price}</div>
                    <div className="pack-moq text-[11px] text-gray-500">MOQ: {item.moq}</div>
                    <button className="enquire-btn" onClick={() => onOpenModal(item.name)}>Send Enquiry</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINISHING OPTIONS */}
      <section className="finishing-section py-10 bg-gray-50" aria-labelledby="finish-title">
        <div className="container">
          <div className="text-center mb-7">
            <h2 className="section-title" id="finish-title">Finishing <span>Options</span></h2>
            <p className="section-sub">Enhance your packaging with premium finishes</p>
          </div>
          <div className="finishing-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: <Sparkles size={32} />, n: 'Spot UV Coating', d: 'High-gloss selective coating for dramatic effect' },
              { i: <Award size={32} />, n: 'Hot Foil Stamping', d: 'Gold, silver or custom foil for luxury appeal' },
              { i: <Circle size={32} />, n: 'Embossing / Debossing', d: 'Raised or recessed texture for tactile branding' },
              { i: <Eye size={32} />, n: 'Window Patching', d: 'Clear PET film window to display contents' },
              { i: <Palette size={32} />, n: 'Matte / Gloss Lamination', d: 'Protective laminate with desired texture' },
              { i: <Scissors size={32} />, n: 'Custom Die Cutting', d: 'Any shape or size with precision die cutting' },
              { i: <Ruler size={32} />, n: 'Velvet Lining', d: 'Soft velvet interior for luxury unboxing' },
              { i: <Ribbon size={32} />, n: 'Ribbon & Handle', d: 'Premium ribbon pulls and custom handles' },
            ].map((f, i) => (
              <div key={i} className="finishing-card reveal bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                <div className="finishing-icon text-[var(--primary)] mb-2 flex justify-center">{f.i}</div>
                <div className="finishing-name font-bold text-[13px] text-[var(--secondary)] mb-1">{f.n}</div>
                <div className="finishing-desc text-[11px] text-gray-500">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[var(--primary)] py-10 text-center">
        <div className="container">
          <h2 className="font-baloo text-[26px] font-bold text-white mb-2">Need Custom Packaging? Let's Talk!</h2>
          <p className="text-white/85 mb-6">Share your specs and get a free sample with quote within 48 hours.</p>
          <div className="flex justify-center items-center gap-3">
            <button className="btn-lg bg-white text-[var(--primary)] font-extrabold flex items-center gap-2" onClick={() => onOpenModal()}>
              <ClipboardList size={20} /> Get Free Quote
            </button>
            <a href={`tel:${SITE.tel}`} className="btn-lg bg-white text-[var(--primary)] no-underline inline-flex items-center gap-2 hover:bg-gray-100 transition-all">
              <Phone size={20} /> Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packaging;
