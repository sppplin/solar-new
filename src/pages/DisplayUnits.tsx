import React from 'react';
import { 
  Star, Store, ShoppingCart, Pin, Tag, Archive, 
  Tent, Palette, Factory, Truck, ClipboardList, Phone 
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SITE } from '../constants';

interface DisplayUnitsProps {
  onOpenModal: (product?: string) => void;
}

const DisplayUnits: React.FC<DisplayUnitsProps> = ({ onOpenModal }) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const displays = [
    { name: 'Floor Standing Display Units (FSDU)', desc: 'Full-height free-standing displays for retail floors, supermarkets and brand activation zones.', badge: 'Most Popular', badgeIcon: <Star size={10} />, price: '₹ 2,500 – ₹ 15,000', moq: '10 units', bg: 'linear-gradient(135deg,#fff3e0,#f58220)', icon: <Store size={60} /> },
    { name: 'Counter Top Display Units', desc: 'Compact counter displays for checkout counters, reception desks and pharmacy shelves.', price: '₹ 800 – ₹ 5,000', moq: '20 units', bg: 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', icon: <ShoppingCart size={60} /> },
    { name: 'Power Wings / Side Wings', desc: 'Aisle-facing side wings that attach to existing shelving for maximum impulse buy visibility.', price: '₹ 500 – ₹ 3,000', moq: '25 units', bg: 'linear-gradient(135deg,#d1fae5,#16a34a)', icon: <Pin size={60} /> },
    { name: 'Shelf Talkers & Wobblers', desc: 'Eye-catching shelf communication materials that draw attention to specific products on shelf.', price: '₹ 5 – ₹ 80', moq: '500 pcs', bg: 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', icon: <Tag size={60} /> },
    { name: 'Product Shipper Displays', desc: 'Corrugated shipper boxes that convert to retail displays — perfect for product launch rollouts.', price: '₹ 150 – ₹ 1,200', moq: '50 units', bg: 'linear-gradient(135deg,#fff3e0,#f58220)', icon: <Archive size={60} /> },
    { name: 'Event & Exhibition Displays', desc: 'Custom structural displays for trade shows, exhibitions and brand activation events.', price: '₹ 5,000 – ₹ 25,000', moq: '5 units', bg: 'linear-gradient(135deg,#e0f2fe,#1e3a5f)', icon: <Tent size={60} /> },
  ];

  return (
    <div className="display-units-page">
      <Breadcrumb currentPage="3D Display Units" />
      <div className="page-hero">
        <div className="inner">
          <h1>3D Retail <span>Display Units</span></h1>
          <p>Custom POS displays that drive in-store visibility and boost sales. From floor-standing to counter units — all designed and manufactured in-house.</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">Our <span>Display Products</span></h2><p className="section-sub">Engineered for maximum impact at the point of sale</p></div>
          </div>
          <div className="display-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displays.map((d, i) => (
              <div key={i} className="display-card reveal bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]">
                <div className="display-card-img h-[180px] flex items-center justify-center relative" style={{ background: d.bg }}>
                  <div className="text-gray-800 opacity-80">
                    {d.icon}
                  </div>
                </div>
                <div className="display-card-body p-4">
                  <div className="display-card-name font-baloo text-base font-bold text-[var(--secondary)] mb-1">{d.name}</div>
                  <div className="display-card-desc text-xs text-gray-500 mb-2.5 leading-relaxed">{d.desc}</div>
                  {d.badge && (
                    <div className="flex gap-1.5 flex-wrap mb-2.5">
                      <span className="badge badge-popular flex items-center gap-1">
                        {d.badgeIcon} {d.badge}
                      </span>
                    </div>
                  )}
                  <div className="display-price font-baloo text-[15px] text-[var(--primary)] font-bold">{d.price}</div>
                  <div className="display-moq text-[11px] text-gray-500">MOQ: {d.moq}</div>
                  <button className="enquire-btn" onClick={() => onOpenModal(d.name)}>Send Enquiry</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="section-title mb-5">Why Choose Our <span>Display Units?</span></h2>
            <div className="benefit-grid grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              {[
                { i: <Palette size={28} />, t: 'In-House Design', d: 'Our structural designers create custom display architectures to maximize shelf impact and brand communication.' },
                { i: <Factory size={28} />, t: 'Manufactured In-House', d: 'Complete manufacturing in our Noida facility — no middlemen, faster turnaround and better quality control.' },
                { i: <Truck size={28} />, t: 'Flat-Pack Delivery', d: 'Units delivered flat-packed with easy assembly instructions for efficient retail installation across all stores.' },
              ].map((b, i) => (
                <div key={i} className="benefit-card reveal bg-[var(--primary-light)] rounded-xl p-5 border-l-4 border-[var(--primary)]">
                  <div className="benefit-icon text-[var(--primary)] mb-2">{b.i}</div>
                  <div className="benefit-title font-bold text-[13px] text-[var(--secondary)] mb-1">{b.t}</div>
                  <div className="benefit-desc text-xs text-gray-600">{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[var(--primary)] py-10 text-center">
        <div className="container">
          <h2 className="font-baloo text-[26px] font-bold text-white mb-2">Boost Your In-Store Sales!</h2>
          <p className="text-white/85 mb-6">Get a custom 3D mockup of your display unit for free with your quote.</p>
          <div className="flex justify-center items-center gap-3">
            <button className="btn-lg bg-white text-[var(--primary)] font-extrabold flex items-center gap-2" onClick={() => onOpenModal('Display Units')}>
              <ClipboardList size={20} /> Get Free 3D Mockup
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

export default DisplayUnits;
