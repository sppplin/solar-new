import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Printer, Package, Palette, Camera, Truck, 
  ClipboardList, CheckCircle, MapPin, ArrowRight 
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

interface Service {
  id: number;
  name: string;
  description: string;
  image_url: string;
  icon_name: string;
  tags: string[];
  features: string[];
  bg_color: string;
  link: string;
}

interface ServicesProps {
  onOpenModal: (product?: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenModal }) => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
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
  }, [loading, services]);

  const getIconByName = (name: string, size = 80) => {
    switch (name) {
      case 'Printer': return <Printer size={size} />;
      case 'Package': return <Package size={size} />;
      case 'Layout': return <Package size={size} />; // Fallback for Layout
      case 'Palette': return <Palette size={size} />;
      case 'Camera': return <Camera size={size} />;
      case 'Truck': return <Truck size={size} />;
      default: return <Package size={size} />;
    }
  };

  return (
    <div className="services-page">
      <Breadcrumb currentPage="Services" />
      <div className="page-hero">
        <div className="inner">
          <h1>Our <span>Services</span></h1>
          <p>End-to-end printing and packaging solutions under one roof — from design to delivery.</p>
        </div>
      </div>

      {/* PROCESS */}
      <section className="process-section py-12 bg-gray-50" aria-labelledby="process-title">
        <div className="container">
          <div className="text-center mb-9">
            <h2 className="section-title" id="process-title">Our <span>Process</span></h2>
            <p className="section-sub">Simple, transparent, reliable</p>
          </div>
          <div className="process-steps grid grid-cols-1 lg:grid-cols-5 gap-0 relative before:content-[''] before:absolute before:top-7 before:left-[10%] before:right-[10%] before:h-0.5 before:bg-linear-to-r before:from-[var(--primary)] before:to-blue-400 before:z-0 before:hidden lg:before:block">
            {[
              { i: <ClipboardList size={24} />, t: 'Enquiry', d: 'Share your requirement and get a quote' },
              { i: <Palette size={24} />, t: 'Design', d: 'Our team creates artwork for approval' },
              { i: <CheckCircle size={24} />, t: 'Approval', d: 'Sample/digital proof sign-off' },
              { i: <Printer size={24} />, t: 'Production', d: 'Manufacturing with QC at every stage' },
              { i: <Truck size={24} />, t: 'Delivery', d: 'Packed and delivered PAN India' },
            ].map((s, i) => (
              <div key={i} className="step reveal text-center px-2 relative z-10 mb-8 lg:mb-0">
                <div className="step-circle w-14 h-14 rounded-full bg-white border-3 border-[var(--primary)] flex items-center justify-center text-[var(--primary)] mx-auto mb-3 shadow-md relative">
                  {s.i}
                  <div className="step-num absolute -top-1 -right-1 bg-[var(--primary)] text-white w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center">{i + 1}</div>
                </div>
                <div className="step-title font-bold text-xs text-[var(--secondary)] mb-1">{s.t}</div>
                <div className="step-desc text-[11px] text-gray-500">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES DETAILS */}
      <section className="services-list py-12">
        <div className="container">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading services...</p>
            </div>
          ) : services.map((svc, i) => (
            <div key={svc.id} className={`service-detail grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-12 border-b border-gray-100 last:border-none ${i % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`} id={svc.id?.toString()}>
              <div className="service-visual reveal rounded-2xl p-10 text-center relative overflow-hidden [direction:ltr]" style={{ background: svc.bg_color }}>
                <div className="text-gray-800 opacity-80 flex justify-center h-20 items-center">
                  {svc.image_url ? (
                    <img src={svc.image_url} alt={svc.name} className="h-full object-contain" />
                  ) : (
                    getIconByName(svc.icon_name)
                  )}
                </div>
                <div className="absolute -bottom-5 -right-5 w-25 h-25 bg-[var(--primary)]/15 rounded-full"></div>
              </div>
              <div className="reveal [direction:ltr]">
                <h2 className="font-baloo text-[28px] text-[var(--secondary)] mb-2.5">{svc.name}</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-3.5">{svc.description}</p>
                <ul className="service-features list-none my-4">
                  {svc.features.map((f, j) => (
                    <li key={j} className="py-2 text-[13px] text-gray-700 flex items-start gap-2 border-b border-gray-100 last:border-none">
                      <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="tag-cloud flex flex-wrap gap-2 mt-4">
                  {svc.tags.map((tag, k) => <span key={k} className="tag bg-gray-100 text-gray-700 py-1 px-3.5 rounded-full text-xs font-semibold border border-gray-200">{tag}</span>)}
                </div>
                <div className="mt-5 flex gap-3">
                  {svc.link && svc.link.startsWith('/') && !svc.link.includes('#') && <Link to={svc.link} className="btn-lg btn-secondary text-sm py-2.5 px-6 no-underline inline-flex items-center gap-2">View Details <ArrowRight size={16} /></Link>}
                  <button className="btn-lg btn-orange text-sm py-2.5 px-6 flex items-center gap-2" onClick={() => onOpenModal(svc.name)}>Get Quote <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-[var(--secondary)] py-10 text-center">
        <div className="container">
          <h2 className="font-baloo text-[26px] font-bold text-white mb-2">Ready to Get Started?</h2>
          <p className="text-blue-200 mb-6">Contact us today for a free consultation and quote.</p>
          <div className="flex justify-center items-center gap-3">
            <button className="btn-lg btn-orange flex items-center gap-2" onClick={() => onOpenModal()}>
              <ClipboardList size={20} /> Send Enquiry
            </button>
            <Link to="/contact" className="btn-lg btn-white-outline no-underline inline-flex items-center gap-2">
              <MapPin size={20} /> Visit Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
