import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { SITE } from '../constants';

interface FooterProps {
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ logoUrl }) => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-wrap flex items-center gap-2">
              <img 
                src={logoUrl || "https://static.wixstatic.com/media/895e2c_99457844de4b481da7005c3e882ca1ec~mv2.jpg"} 
                alt="Solar Print Process Logo" 
                className="h-12 md:h-20 w-auto brightness-0 invert transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="footer-desc">
              The complete solution for Print, Packaging & Production. Trusted by India's leading brands since 1975. ISO certified. 3-acre facility in Noida, UP.
            </p>
            <div className="footer-social">
              <a className="social-btn flex items-center justify-center" href="https://www.facebook.com/solarprintprocessprivatelimited" target="_blank" rel="noopener" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a className="social-btn flex items-center justify-center" href="https://www.instagram.com/solarprintprocess" target="_blank" rel="noopener" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a className="social-btn flex items-center justify-center" href="https://x.com/solar_process" target="_blank" rel="noopener" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a className="social-btn flex items-center justify-center" href="https://www.linkedin.com/company/solar-print-process-private-limited/" target="_blank" rel="noopener" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Products</h4>
            <ul className="footer-links">
              <li><Link to="/packaging#rigid">Rigid Boxes</Link></li>
              <li><Link to="/packaging#mono">Mono Cartons</Link></li>
              <li><Link to="/packaging#gift">Gift Boxes</Link></li>
              <li><Link to="/packaging#food">Food Packaging</Link></li>
              <li><Link to="/display-units">3D Display Units</Link></li>
              <li><Link to="/printing#books">Coffee Table Books</Link></li>
              <li><Link to="/printing#kits">Corporate Kits</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/printing">Offset Printing</Link></li>
              <li><Link to="/packaging">Custom Packaging</Link></li>
              <li><Link to="/services#design">Graphic Design</Link></li>
              <li><Link to="/services#photography">Photography</Link></li>
              <li><Link to="/display-units">Display Systems</Link></li>
              <li><Link to="/services#logistics">Logistics</Link></li>
              <li><Link to="/services#logistics">Warehousing</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/industries">Industries</Link></li>
              <li><Link to="/products">Our Products</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/contact#enquiry">Get a Quote</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 Solar Print Process Pvt. Ltd. | All Rights Reserved | Noida, India</div>
          <div>Design. Print. Package. Deliver.</div>
        </div>
      </div>
    </footer>
  );
};
