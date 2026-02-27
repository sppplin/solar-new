import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Phone, Mail, Printer, Search, Home, Package, Gift, Store, Settings, Factory, Info } from 'lucide-react';
import { SITE, NAV_LINKS } from '../constants';

interface HeaderProps {
  onOpenModal: (product?: string) => void;
  logoUrl?: string;
}

const NAV_ICONS: Record<string, React.ReactNode> = {
  '/': <Home size={14} />,
  '/products': <Package size={14} />,
  '/packaging': <Gift size={14} />,
  '/printing': <Printer size={14} />,
  '/display-units': <Store size={14} />,
  '/services': <Settings size={14} />,
  '/industries': <Factory size={14} />,
  '/about': <Info size={14} />,
  '/contact': <Mail size={14} />,
};

export const Header: React.FC<HeaderProps> = ({ onOpenModal, logoUrl }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="inner">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[var(--primary)]" /> {SITE.address} 
            <span className="mx-2 opacity-30">|</span> 
            <CheckCircle size={12} className="text-green-400" /> <span className="text-green-400">GST Verified Supplier</span> 
            <span className="mx-2 opacity-30">·</span> Est. 1975
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href={`tel:${SITE.tel}`} className="flex items-center gap-1.5"><Phone size={12} /> {SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5"><Mail size={12} /> {SITE.email}</a>
          </div>
        </div>
      </div>
      <header>
        <div className="header-inner">
          <NavLink className="logo" to="/">
            <img 
              src={logoUrl || "https://static.wixstatic.com/media/895e2c_99457844de4b481da7005c3e882ca1ec~mv2.jpg"} 
              alt="Solar Print Process Logo" 
              className="h-10 md:h-16 w-auto transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </NavLink>
          <form className="search-bar hidden lg:flex" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search packaging, printing, boxes, brochures..." 
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select aria-label="Category">
              <option value="">All Products</option>
              <option value="packaging">Packaging</option>
              <option value="printing">Printing</option>
              <option value="display">Display Units</option>
              <option value="design">Design</option>
            </select>
            <button type="submit" className="search-btn flex items-center gap-2" aria-label="Search">
              <Search size={16} /> Search
            </button>
          </form>
          <div className="header-actions flex items-center gap-3">
            <a href={`tel:${SITE.tel}`} className="btn-outline hidden sm:inline-flex items-center gap-2">
              <Phone size={14} /> {SITE.phone}
            </a>
            <button className="btn-primary" onClick={() => onOpenModal()}>Get Quote</button>
          </div>
        </div>
      </header>
      <nav aria-label="Main navigation">
        <ul className="nav-inner" role="menubar">
          {NAV_LINKS.map(link => (
            <li key={link.href} role="none">
              <NavLink 
                to={link.href} 
                role="menuitem"
                className={({ isActive }) => `flex items-center gap-2 ${isActive ? 'active' : ''}`}
              >
                {NAV_ICONS[link.href]}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
