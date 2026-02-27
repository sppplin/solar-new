import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Package, Printer, Settings, Factory, 
  Phone, ChevronRight 
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

const Sitemap: React.FC = () => {
  const groups = [
    {
      title: 'Main Pages',
      icon: <Home size={20} />,
      links: [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/services', label: 'All Services' },
        { to: '/industries', label: 'Industries Served' },
        { to: '/products', label: 'All Products' },
      ]
    },
    {
      title: 'Products & Packaging',
      icon: <Package size={20} />,
      links: [
        { to: '/packaging', label: 'Custom Packaging' },
        { to: '/packaging#rigid', label: 'Rigid Boxes' },
        { to: '/packaging#mono', label: 'Mono Cartons' },
        { to: '/packaging#gift', label: 'Gift Boxes' },
        { to: '/packaging#food', label: 'Food Packaging' },
        { to: '/packaging#luxury', label: 'Luxury Boxes' },
      ]
    },
    {
      title: 'Printing',
      icon: <Printer size={20} />,
      links: [
        { to: '/printing', label: 'Commercial Printing' },
        { to: '/printing#books', label: 'Coffee Table Books' },
        { to: '/printing#brochures', label: 'Brochures & Catalogs' },
        { to: '/printing#kits', label: 'Corporate Kits' },
        { to: '/display-units', label: '3D Display Units' },
      ]
    },
    {
      title: 'Services',
      icon: <Settings size={20} />,
      links: [
        { to: '/services#printing', label: 'Offset Printing' },
        { to: '/services#packaging', label: 'Custom Packaging' },
        { to: '/services#design', label: 'Graphic Design' },
        { to: '/services#photography', label: 'Product Photography' },
        { to: '/services#logistics', label: 'Logistics & Warehousing' },
      ]
    },
    {
      title: 'Industries',
      icon: <Factory size={20} />,
      links: [
        { to: '/industries#fmcg', label: 'FMCG' },
        { to: '/industries#pharma', label: 'Pharmaceuticals' },
        { to: '/industries#beauty', label: 'Beauty & Skincare' },
        { to: '/industries#food', label: 'Food & Beverages' },
        { to: '/industries#it', label: 'IT & Technology' },
        { to: '/industries#banking', label: 'Banking & Finance' },
      ]
    },
    {
      title: 'Contact & Info',
      icon: <Phone size={20} />,
      links: [
        { to: '/contact', label: 'Contact Us' },
        { to: '/contact#enquiry', label: 'Send Enquiry' },
        { to: '/about', label: 'Our Story' },
        { to: '/about#milestones', label: 'Company Timeline' },
      ]
    }
  ];

  return (
    <div className="sitemap-page">
      <Breadcrumb currentPage="Sitemap" />
      <div className="page-hero">
        <div className="inner">
          <h1>Site<span>map</span></h1>
          <p>Complete index of all pages on our website.</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-[var(--primary)]">
                <h3 className="font-baloo text-lg text-[var(--secondary)] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="text-[var(--primary)]">{group.icon}</span>
                  {group.title}
                </h3>
                <ul className="list-none">
                  {group.links.map((link, j) => (
                    <li key={j} className="mb-2">
                      <Link to={link.to} className="text-blue-600 no-underline text-[13px] flex items-center gap-1.5 hover:text-[var(--primary)] hover:underline">
                        <ChevronRight size={12} className="text-[var(--primary)]" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sitemap;
