import React from 'react';
import { 
  Book, Camera, BookOpen, ClipboardList, Package, 
  Newspaper, Target, Folder, Utensils, FileText, 
  Leaf, Sparkles, Phone 
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SITE } from '../constants';

interface PrintingProps {
  onOpenModal: (product?: string) => void;
}

const Printing: React.FC<PrintingProps> = ({ onOpenModal }) => {
  const [printingItems, setPrintingItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchPrintingItems = async () => {
    try {
      const response = await fetch('/api/printing-items');
      if (response.ok) {
        const data = await response.json();
        setPrintingItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch printing items:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrintingItems();
  }, []);

  React.useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading, printingItems]);

  const getIconByName = (name: string, size = 56) => {
    switch (name) {
      case 'Book': return <Book size={size} />;
      case 'Camera': return <Camera size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'ClipboardList': return <ClipboardList size={size} />;
      case 'Package': return <Package size={size} />;
      case 'Newspaper': return <Newspaper size={size} />;
      case 'Target': return <Target size={size} />;
      case 'Folder': return <Folder size={size} />;
      case 'Utensils': return <Utensils size={size} />;
      default: return <Package size={size} />;
    }
  };

  const sections = [
    {
      id: 'books',
      title: 'Books & Albums',
      sub: 'Premium print for premium publications',
    },
    {
      id: 'brochures',
      title: 'Brochures & Catalogs',
      sub: 'Your brand in every hand',
    },
    {
      id: 'kits',
      title: 'Corporate Kits',
      sub: 'Leave a lasting impression',
    }
  ];

  const groupedItems = sections.map(section => ({
    ...section,
    items: printingItems.filter(item => item.section_id === section.id)
  }));

  return (
    <div className="printing-page">
      <Breadcrumb currentPage="Commercial Printing" />
      <div className="page-hero">
        <div className="inner">
          <h1>Commercial <span>Printing</span></h1>
          <p>High-quality offset printing for all your commercial needs — from brochures to coffee table books. Sharp, vibrant, consistent.</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading printing items...</p>
            </div>
          ) : groupedItems.map(section => (
            <React.Fragment key={section.id}>
              <div className="section-header" id={section.id}>
                <div>
                  <h2 className="section-title">{section.title.split(' & ')[0]} & <span>{section.title.split(' & ')[1]}</span></h2>
                  <p className="section-sub">{section.sub}</p>
                </div>
              </div>
              <div className="print-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {section.items.map((item, i) => (
                  <div key={i} className="print-card reveal bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]">
                    <div className="print-card-img h-[160px] flex items-center justify-center relative" style={{ background: item.bg_color }}>
                      <div className="text-gray-800 opacity-80 h-14 flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full object-contain" />
                        ) : (
                          getIconByName(item.icon_name)
                        )}
                      </div>
                    </div>
                    <div className="print-card-body p-4">
                      <div className="print-card-name font-baloo text-base font-bold text-[var(--secondary)] mb-1">{item.name}</div>
                      <div className="print-card-desc text-xs text-gray-500 mb-2.5 leading-relaxed line-clamp-2">{item.description}</div>
                      <div className="print-price font-baloo text-[15px] text-[var(--primary)] font-bold">{item.price_range}</div>
                      <div className="print-moq text-[11px] text-gray-500">MOQ: {item.moq}</div>
                      <button className="enquire-btn" onClick={() => onOpenModal(item.name)}>Send Enquiry</button>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* PAPER TYPES */}
      <section className="paper-section py-10 bg-gray-50" aria-labelledby="paper-title">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="section-title" id="paper-title">Paper & Material <span>Options</span></h2>
          </div>
          <div className="paper-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: <FileText size={28} />, n: 'Art Paper', s: '90–300 GSM, Glossy/Matte' },
              { i: <ClipboardList size={28} />, n: 'Board', s: '350–450 GSM SBS/GD2' },
              { i: <Leaf size={28} />, n: 'Recycled / FSC', s: 'Eco-certified paper' },
              { i: <Sparkles size={28} />, n: 'Textured / Specialty', s: 'Linen, Cotton, Kraft' },
            ].map((p, i) => (
              <div key={i} className="paper-card reveal bg-white rounded-xl p-4 text-center border-[1.5px] border-gray-200 shadow-sm transition-all duration-200 hover:border-[var(--primary)]">
                <div className="text-[var(--primary)] mb-1.5 flex justify-center">{p.i}</div>
                <div className="paper-name font-bold text-[13px] text-[var(--secondary)] mb-1">{p.n}</div>
                <div className="paper-spec text-[11px] text-gray-500">{p.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[var(--primary)] py-10 text-center">
        <div className="container">
          <h2 className="font-baloo text-[26px] font-bold text-white mb-2">Need a Printing Quote?</h2>
          <p className="text-white/85 mb-6">Tell us what you need — we'll respond with specs, pricing and timeline in 2 hours.</p>
          <div className="flex justify-center items-center gap-3">
            <button className="btn-lg bg-white text-[var(--primary)] font-extrabold flex items-center gap-2" onClick={() => onOpenModal()}>
              <ClipboardList size={20} /> Get Quote Now
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

export default Printing;
