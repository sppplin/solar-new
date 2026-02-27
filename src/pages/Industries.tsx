import React from 'react';
import { 
  Package, Pill, Sparkles, Utensils, Monitor, 
  Building2, Hotel, Car, ClipboardList 
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

interface IndustriesProps {
  onOpenModal: (product?: string) => void;
}

const Industries: React.FC<IndustriesProps> = ({ onOpenModal }) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const industries = [
    { id: 'fmcg', icon: <Package size={28} />, title: 'FMCG', sub: 'Fast Moving Consumer Goods', desc: 'From shelf-ready mono cartons to eye-catching FSDU display units — we help FMCG brands stand out at the point of sale with high-volume, consistent quality printing.', prods: ['Mono Cartons', 'Shrink Sleeves', 'Display Units', 'Labels'], clients: 'HUL, Dabur, Himalaya, ITC', bg: '#fff7ed' },
    { id: 'pharma', icon: <Pill size={28} />, title: 'Pharmaceuticals', sub: 'Regulated, compliant packaging', desc: 'Precise pharma packaging that meets regulatory standards — from unit cartons with Braille and leaflet integration to bulk multi-pack solutions with serialization.', prods: ['Unit Cartons', 'Braille', 'Leaflets', 'Blister Cards'], clients: 'Sun Pharma, Cipla, Dr Reddy\'s', bg: '#eff6ff' },
    { id: 'beauty', icon: <Sparkles size={28} />, title: 'Beauty & Skincare', sub: 'Premium finishes for premium brands', desc: 'Luxury packaging that communicates premium quality — hi-gloss lacquer, hot foiling, soft-touch lamination and custom inserts for cosmetics and skincare brands.', prods: ['Luxury Boxes', 'Rigid Boxes', 'Hot Foiling', 'Inserts'], clients: 'L\'Oréal, Lakme, Forest Essentials', bg: '#fdf4ff' },
    { id: 'food', icon: <Utensils size={28} />, title: 'Food & Beverages', sub: 'FDA-compliant food-safe packaging', desc: 'Food-safe packaging that preserves freshness and communicates brand values — from bakery boxes to restaurant takeaway packaging and beverage labels.', prods: ['Food Boxes', 'Cake Boxes', 'Takeaway', 'Labels'], clients: 'McDonald\'s, Haldiram\'s, Café Coffee Day', bg: '#fff7ed' },
    { id: 'it', icon: <Monitor size={28} />, title: 'IT & Technology', sub: 'Corporate print for tech brands', desc: 'Premium corporate collateral for India\'s IT sector — from annual reports and brochures to product launch kits and conference materials.', prods: ['Annual Reports', 'Welcome Kits', 'Brochures', 'Product Boxes'], clients: 'Wipro, Infosys, HCL', bg: '#eff6ff' },
    { id: 'banking', icon: <Building2 size={28} />, title: 'Banking & Finance', sub: 'Secure, professional print', desc: 'Trust-building printed materials for banks and financial institutions — welcome kits, passbooks, collateral, and premium stationery.', prods: ['Welcome Kits', 'Stationery', 'Brochures', 'Annual Reports'], clients: 'HDFC Bank, SBI, ICICI', bg: '#f0fdf4' },
    { id: 'hospitality', icon: <Hotel size={28} />, title: 'Hospitality', sub: 'Premium guest experience materials', desc: 'Elegant hospitality print for hotels, resorts and restaurants — menus, room directories, stationery, amenity packaging and event materials.', prods: ['Menu Cards', 'Room Directories', 'Amenity Packaging', 'Stationery'], clients: 'Taj Hotels, Marriott, ITC Hotels', bg: '#fff7ed' },
    { id: 'auto', icon: <Car size={28} />, title: 'Automotive', sub: 'Technical & brand print', desc: 'Precision printing for automotive brands — service kits, owner\'s manuals, dealership marketing and premium showroom collateral.', prods: ['Manuals', 'Service Kits', 'Showroom Displays', 'Brochures'], clients: 'Maruti Suzuki, Hero, Tata Motors', bg: '#fef3c7' },
  ];

  return (
    <div className="industries-page">
      <Breadcrumb currentPage="Industries" />
      <div className="page-hero">
        <div className="inner">
          <h1>Industries We <span>Serve</span></h1>
          <p>Trusted by India's leading brands across 14+ sectors. Custom printing and packaging solutions tailored for each industry's unique requirements.</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          <div className="section-header mb-6">
            <div><h2 className="section-title">Quick <span>Navigation</span></h2></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-10">
            {industries.map(ind => (
              <a key={ind.id} className="p-3.5 bg-white border-[1.5px] border-gray-200 rounded-xl text-center text-[11px] font-bold text-gray-700 cursor-pointer transition-all duration-200 flex flex-col items-center gap-1.5 no-underline hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]" href={`#${ind.id}`}>
                <span className="text-[var(--primary)]">{ind.icon}</span>
                {ind.title}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {industries.map(ind => (
              <div key={ind.id} className="industry-card reveal bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]" id={ind.id}>
                <div className="p-5 pb-4 flex items-center gap-3.5 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[var(--primary)] shrink-0" style={{ background: ind.bg }}>{ind.icon}</div>
                  <div>
                    <div className="font-baloo text-lg font-bold text-[var(--secondary)]">{ind.title}</div>
                    <div className="text-xs text-gray-500">{ind.sub}</div>
                  </div>
                </div>
                <div className="p-5 pt-4">
                  <div className="text-[13px] text-gray-700 leading-relaxed mb-3">{ind.desc}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.prods.map((p, j) => <span key={j} className="bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-[11px] font-semibold">{p}</span>)}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2.5">Clients include: {ind.clients}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 p-8 bg-[var(--primary-light)] rounded-xl border-2 border-dashed border-[var(--primary)]">
            <h3 className="font-baloo text-xl text-[var(--secondary)] mb-2">Don't see your industry?</h3>
            <p className="text-gray-500 text-sm mb-4">We work with virtually any industry. Tell us your requirement and we'll find the right solution.</p>
            <button className="btn-lg btn-orange flex items-center gap-2 mx-auto" onClick={() => onOpenModal()}>
              <ClipboardList size={20} /> Discuss Your Requirement
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Industries;
