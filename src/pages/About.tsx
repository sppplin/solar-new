import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Factory, Printer, Target, Rocket, Handshake, Zap, Leaf, 
  Crown, Award, CheckCircle, Flag, ClipboardList, Mail 
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SITE } from '../constants';

interface AboutProps {
  onOpenModal: (product?: string) => void;
}

const About: React.FC<AboutProps> = ({ onOpenModal }) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <Breadcrumb currentPage="About Us" />
      <div className="page-hero">
        <div className="inner">
          <h1>About <span>Solar Print</span></h1>
          <p>50+ years of printing excellence. From a small setup to India's most trusted print & packaging partner.</p>
        </div>
      </div>

      <section className="about-intro py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-baloo text-[28px] text-[var(--secondary)] mb-4">The Complete Solution for Print, Packaging & Production</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3.5">Established in 1975, Solar Print Process Pvt. Ltd. is a renowned process-driven company that has grown over five decades to become one of India's most trusted printing and packaging manufacturers.</p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3.5">We offer professional offset printing, custom packaging solutions and production services to a diverse range of industries — from FMCG and Beauty to Pharmaceuticals, Automotive, and Hospitality.</p>
              <div className="highlight-box bg-[var(--primary-light)] border-l-4 border-[var(--primary)] p-4 rounded-r-lg my-4 text-sm text-[var(--secondary)] font-semibold flex items-center gap-3">
                <Factory size={24} className="text-[var(--primary)] shrink-0" />
                <span>3-acre, 2,0,000+ sq. ft. facility in Sector 85, Noida — one of India's largest print & packaging plants.</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3.5">Our integrated approach covers Design, Print, Package, Photography and Logistics — all under one roof — making us the preferred partner for brands that demand excellence and consistency.</p>
            </div>
            <div className="about-visual reveal bg-linear-to-br from-[var(--primary-light)] to-yellow-200 rounded-2xl p-10 text-center">
              <div className="flex justify-center mb-4">
                <Printer size={80} className="text-[var(--primary)]" />
              </div>
              <div className="font-baloo text-[22px] font-extrabold text-[var(--secondary)] mt-4">Solar Print Process</div>
              <div className="text-[var(--primary)] font-bold mt-1 text-base">Est. 1975 | Noida, India</div>
              <div className="mt-4 flex justify-center gap-3">
                {[
                  { n: '50+', l: 'Years' },
                  { n: '500+', l: 'Clients' },
                  { n: '200+', l: 'Team' }
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-lg p-2.5 px-4 shadow-md">
                    <div className="font-baloo text-2xl text-[var(--primary)] font-extrabold">{s.n}</div>
                    <div className="text-[11px] text-gray-500">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section py-12 bg-linear-to-br from-[var(--secondary)] to-blue-800">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              { n: '1975', l: 'Year Established' },
              { n: '200+', l: 'Team Members' },
              { n: '500+', l: 'Satisfied Clients' },
              { n: '14+', l: 'Industries Served' }
            ].map((s, i) => (
              <div key={i} className="stat-item text-center p-6 border-r border-white/10 last:border-none">
                <span className="stat-num font-baloo text-[40px] font-extrabold text-[var(--accent)] block">{s.n}</span>
                <div className="stat-label text-[13px] text-blue-200 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MILESTONES */}
      <section className="milestones py-12 bg-gray-50">
        <div className="container">
          <div className="text-center mb-9">
            <h2 className="section-title">Our <span>Journey</span></h2>
            <p className="section-sub">Five decades of innovation, growth and excellence</p>
          </div>
          <div className="timeline relative max-w-[700px] mx-auto before:content-[''] before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200 before:-translate-x-1/2">
            {[
              { y: '1975', t: 'Founded', d: 'Solar Print Process established in Delhi/NCR region with offset printing as core service.', side: 'left' },
              { y: '1985', t: 'Expansion', d: 'Expanded operations, added packaging division to serve FMCG and pharma sectors.', side: 'right' },
              { y: '1995', t: 'ISO Certification', d: 'Achieved ISO quality management certification, formalizing our commitment to excellence.', side: 'left' },
              { y: '2005', t: 'New Noida Facility', d: 'Moved to state-of-the-art 3-acre facility in Sector 85, Noida with 2,00,000 sq. ft. workspace.', side: 'right' },
              { y: '2012', t: '3D Display Division', d: 'Launched 3D retail display unit manufacturing, serving major FMCG and beauty brands.', side: 'left' },
              { y: '2025', t: '50 Years Strong', d: 'Celebrating 50 years of excellence with 500+ clients, 200+ team members and digital expansion.', side: 'right' },
            ].map((m, i) => (
              <div key={i} className={`timeline-item reveal grid grid-cols-[1fr_40px_1fr] gap-0 mb-8 items-start ${m.side === 'right' ? 'rtl' : ''}`}>
                <div className={`tl-content ${m.side === 'left' ? 'text-right pr-6' : 'col-start-3 pl-6 text-left'} [direction:ltr]`}>
                  <div className="tl-box bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="tl-title font-baloo text-[15px] font-bold text-[var(--secondary)] mb-1">{m.t}</div>
                    <div className="tl-desc text-xs text-gray-500">{m.d}</div>
                  </div>
                </div>
                <div className="tl-year w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-[11px] font-extrabold text-center z-10 relative col-start-2 leading-tight">{m.y}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="team-section py-12 bg-white">
        <div className="container">
          <div className="text-center max-w-[600px] mx-auto mb-9">
            <h2 className="section-title">Our <span>Values</span></h2>
            <p className="section-sub">The principles that drive everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { i: <Target size={40} />, n: 'Precision', d: 'Every print, every package, every detail executed with uncompromising accuracy and attention.' },
              { i: <Rocket size={40} />, n: 'Innovation', d: 'Continuously investing in latest printing technology and creative packaging solutions.' },
              { i: <Handshake size={40} />, n: 'Partnership', d: 'We build long-term relationships, not just transactions. Your success is our success.' },
              { i: <Zap size={40} />, n: 'Reliability', d: 'On-time delivery, consistent quality, transparent communication — every single time.' },
              { i: <Leaf size={40} />, n: 'Sustainability', d: 'Committed to eco-friendly materials and responsible manufacturing practices.' },
              { i: <Crown size={40} />, n: 'Excellence', d: 'ISO certified processes ensuring the highest quality standards across all our products.' },
            ].map((v, i) => (
              <div key={i} className="value-card reveal bg-gray-50 rounded-xl p-6 text-center border border-gray-100 transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary-light)]">
                <div className="value-icon text-[var(--primary)] mb-3 flex justify-center">{v.i}</div>
                <div className="value-name font-baloo text-base font-bold text-[var(--secondary)] mb-1.5">{v.n}</div>
                <div className="value-desc text-[13px] text-gray-500">{v.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="certifications py-10 bg-gray-50">
        <div className="container">
          <div className="text-center mb-7">
            <h2 className="section-title">Certifications & <span>Standards</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: <Award size={40} />, n: 'ISO 9001:2015', d: 'Quality Management System certified' },
              { i: <Leaf size={40} />, n: 'FSC Certified', d: 'Responsible sourcing of paper & materials' },
              { i: <CheckCircle size={40} />, n: 'GST Registered', d: 'Verified supplier with proper GST compliance' },
              { i: <Flag size={40} />, n: 'Make in India', d: '100% manufactured in India, Noida facility' },
            ].map((c, i) => (
              <div key={i} className="cert-card reveal bg-white rounded-xl p-5 text-center border-[1.5px] border-gray-200 shadow-sm">
                <div className="cert-icon text-[var(--primary)] mb-2 flex justify-center">{c.i}</div>
                <div className="cert-name font-bold text-[13px] text-[var(--secondary)]">{c.n}</div>
                <div className="cert-desc text-[11px] text-gray-500 mt-1">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section bg-[var(--primary)] py-12 text-center">
        <div className="container">
          <h2 className="font-baloo text-[28px] font-extrabold text-white mb-2">Ready to Work with India's Best Printer?</h2>
          <p className="text-white/85 text-[15px] mb-6">Get in touch for a free quote on your next packaging or printing project.</p>
          <div className="flex justify-center items-center gap-3">
            <button className="btn-lg bg-white text-[var(--primary)] font-extrabold flex items-center gap-2" onClick={() => onOpenModal()}>
              <ClipboardList size={20} /> Get Free Quote
            </button>
            <Link to="/contact" className="btn-lg btn-white-outline no-underline inline-flex items-center gap-2">
              <Mail size={20} /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
