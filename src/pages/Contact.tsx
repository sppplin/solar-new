import React from 'react';
import { 
  Phone, Mail, MessageCircle, MapPin, Clock, 
  ClipboardList, Send, Loader2, CheckCircle, 
  Facebook, Instagram, Twitter, Linkedin, ArrowRight 
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SITE } from '../constants';

const Contact: React.FC = () => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error('Failed to send enquiry');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send enquiry. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="contact-page">
      <Breadcrumb currentPage="Contact Us" />
      <div className="page-hero">
        <div className="inner">
          <h1>Contact <span>Us</span></h1>
          <p>We're here to help! Reach out for quotes, samples, or any queries about our printing and packaging services.</p>
        </div>
      </div>

      <section className="contact-section py-12" id="enquiry">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
            <div className="contact-info">
              <h2 className="font-baloo text-[26px] text-[var(--secondary)] mb-1.5">Get in Touch</h2>
              <p className="text-sm text-gray-500 mb-7">Our team responds within 2 working hours on business days.</p>

              <a className="info-card reveal bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all duration-200 no-underline hover:border-[var(--primary)] hover:shadow-md" href={`tel:${SITE.tel}`}>
                <div className="info-icon w-12 h-12 bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center text-white shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="info-label text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Phone</div>
                  <div className="info-value text-[15px] font-bold text-[var(--secondary)] mt-0.5">{SITE.phone}</div>
                  <div className="info-sub text-xs text-gray-500 mt-0.5">Mon–Sat, 9AM–6PM</div>
                </div>
              </a>
              <a className="info-card reveal bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all duration-200 no-underline hover:border-[var(--primary)] hover:shadow-md" href={`mailto:${SITE.email}`}>
                <div className="info-icon w-12 h-12 bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center text-white shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="info-label text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Email</div>
                  <div className="info-value text-[15px] font-bold text-[var(--secondary)] mt-0.5">{SITE.email}</div>
                  <div className="info-sub text-xs text-gray-500 mt-0.5">We reply within 2 hours</div>
                </div>
              </a>
              <a className="info-card reveal bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all duration-200 no-underline hover:border-[var(--primary)] hover:shadow-md" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">
                <div className="info-icon w-12 h-12 bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center text-white shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div className="info-label text-[11px] text-gray-500 font-semibold uppercase tracking-wider">WhatsApp</div>
                  <div className="info-value text-[15px] font-bold text-[var(--secondary)] mt-0.5">{SITE.phone}</div>
                  <div className="info-sub text-xs text-gray-500 mt-0.5">Quick response on WhatsApp</div>
                </div>
              </a>
              <div className="info-card reveal bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-default">
                <div className="info-icon w-12 h-12 bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center text-white shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="info-label text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Factory Address</div>
                  <div className="info-value text-[15px] font-bold text-[var(--secondary)] mt-0.5">C-10, Sector 85, Noida</div>
                  <div className="info-sub text-xs text-gray-500 mt-0.5">Uttar Pradesh 201305, India</div>
                </div>
              </div>

              <h3 className="font-baloo text-lg text-[var(--secondary)] mt-6 mb-2 flex items-center gap-2">
                <Clock size={20} className="text-[var(--primary)]" /> Working Hours
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <div className="hour-item flex justify-between py-2.5 border-b border-gray-100 text-[13px]"><span className="font-semibold text-gray-700">Monday</span><span className="text-green-600 font-semibold">9AM – 6PM</span></div>
                  <div className="hour-item flex justify-between py-2.5 border-b border-gray-100 text-[13px]"><span className="font-semibold text-gray-700">Tuesday</span><span className="text-green-600 font-semibold">9AM – 6PM</span></div>
                  <div className="hour-item flex justify-between py-2.5 border-b border-gray-100 text-[13px]"><span className="font-semibold text-gray-700">Wednesday</span><span className="text-green-600 font-semibold">9AM – 6PM</span></div>
                  <div className="hour-item flex justify-between py-2.5 border-b border-gray-100 text-[13px]"><span className="font-semibold text-gray-700">Thursday</span><span className="text-green-600 font-semibold">9AM – 6PM</span></div>
                </div>
                <div>
                  <div className="hour-item flex justify-between py-2.5 border-b border-gray-100 text-[13px]"><span className="font-semibold text-gray-700">Friday</span><span className="text-green-600 font-semibold">9AM – 6PM</span></div>
                  <div className="hour-item flex justify-between py-2.5 border-b border-gray-100 text-[13px]"><span className="font-semibold text-gray-700">Saturday</span><span className="text-green-600 font-semibold">9AM – 2PM</span></div>
                  <div className="hour-item flex justify-between py-2.5 border-b border-gray-100 text-[13px]"><span className="font-semibold text-gray-700">Sunday</span><span className="text-red-600 font-semibold">Closed</span></div>
                </div>
              </div>
            </div>

            <div className="form-card reveal bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="font-baloo text-[22px] text-[var(--secondary)] mb-1.5 flex items-center gap-2">
                <ClipboardList size={22} className="text-[var(--primary)]" /> Send an Enquiry
              </h2>
              <p className="text-[13px] text-gray-500 mb-6">Fill in your details and we'll get back to you with the best quote.</p>
              <form className="enquiry-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="form-group"><label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label><input type="text" name="name" placeholder="Your Name" required className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" /></div>
                  <div className="form-group"><label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label><input type="text" name="company" placeholder="Brand / Company" className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="form-group"><label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number *</label><input type="tel" name="mobile" placeholder="+91 XXXXX XXXXX" required className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" /></div>
                  <div className="form-group"><label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label><input type="email" name="email" placeholder="you@email.com" className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" /></div>
                </div>
                <div className="form-group mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product / Service *</label>
                  <select name="product" required className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]">
                    <option value="">Select what you need</option>
                    <option value="Rigid Boxes / Gift Boxes">Rigid Boxes / Gift Boxes</option>
                    <option value="Mono Cartons">Mono Cartons</option>
                    <option value="Food & Cake Packaging">Food & Cake Packaging</option>
                    <option value="3D Display Units / POS Displays">3D Display Units / POS Displays</option>
                    <option value="Coffee Table Books / Catalogs">Coffee Table Books / Catalogs</option>
                    <option value="Brochures / Pamphlets">Brochures / Pamphlets</option>
                    <option value="Corporate Kits / Welcome Kits">Corporate Kits / Welcome Kits</option>
                    <option value="Luxury Boxes (Glass/Metal/Wood)">Luxury Boxes (Glass/Metal/Wood)</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Product Photography">Product Photography</option>
                    <option value="Logistics / Warehousing">Logistics / Warehousing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="form-group"><label className="block text-xs font-bold text-gray-700 mb-1">Quantity Required</label><input type="text" name="quantity" placeholder="e.g. 1000 pieces" className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" /></div>
                  <div className="form-group"><label className="block text-xs font-bold text-gray-700 mb-1">Deadline (if any)</label><input type="text" name="deadline" placeholder="e.g. 15th Jan 2026" className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)]" /></div>
                </div>
                <div className="form-group mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Requirement *</label>
                  <textarea name="message" placeholder="Please describe: product dimensions, material preference, printing type, special finishes, reference samples, etc." className="w-full p-2.5 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-[var(--primary)] h-28 resize-none" required></textarea>
                </div>
                <div className="form-group mb-4">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
                    <input type="checkbox" className="w-auto" /> I'd like to request a sample before full order
                  </label>
                </div>
                <button 
                  type="submit" 
                  className={`submit-btn w-full p-3 rounded-md text-sm font-bold cursor-pointer transition-colors duration-200 ${status === 'success' ? 'bg-green-600' : 'bg-[var(--primary)]'} text-white hover:bg-[var(--primary-dark)] flex items-center justify-center gap-2`}
                  disabled={status !== 'idle'}
                >
                  {status === 'idle' && <><Send size={16} /> Send Enquiry Now</>}
                  {status === 'sending' && <><Loader2 size={16} className="animate-spin" /> Sending...</>}
                  {status === 'success' && <><CheckCircle size={16} /> Submitted Successfully!</>}
                </button>
                <p className="form-note text-[11px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1.5">
                  <CheckCircle size={12} className="text-green-500" /> Your information is safe with us. We respond within 2 working hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="map-section pb-12" aria-label="Location map">
        <div className="container">
          <h2 className="section-title mb-5">Our <span>Location</span></h2>
          <div className="map-embed rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.7!2d77.3862!3d28.5921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM1JzMxLjYiTiA3N8KwMjMnMTAuMyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Solar Print Process Location - C-10, Sector 85, Noida"
              className="w-full h-[380px] border-none block"
            ></iframe>
          </div>
          <div className="mt-4 bg-[var(--primary-light)] border-[1.5px] border-[var(--primary)] rounded-lg py-3.5 px-5 inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--secondary)]">
            <MapPin size={16} className="text-[var(--primary)]" /> C-10, Sector 85, Noida, Uttar Pradesh 201305 &nbsp;·&nbsp;
            <a href="https://maps.google.com/?q=Sector+85+Noida" target="_blank" rel="noopener" className="text-[var(--primary)] no-underline flex items-center gap-1">
              Get Directions <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="social-section py-10 bg-gray-50" aria-labelledby="social-title">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="section-title" id="social-title">Connect on <span>Social Media</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: <Facebook size={32} />, n: 'Facebook', h: '@solarprintprocessprivatelimited', l: 'https://www.facebook.com/solarprintprocessprivatelimited' },
              { i: <Instagram size={32} />, n: 'Instagram', h: '@solarprintprocess', l: 'https://www.instagram.com/solarprintprocess' },
              { i: <Twitter size={32} />, n: 'Twitter / X', h: '@solar_process', l: 'https://x.com/solar_process' },
              { i: <Linkedin size={32} />, n: 'LinkedIn', h: 'Solar Print Process Pvt Ltd', l: 'https://www.linkedin.com/company/solar-print-process-private-limited/' },
            ].map((s, i) => (
              <a key={i} className="social-card reveal bg-white rounded-xl p-6 text-center border-[1.5px] border-gray-200 transition-all duration-200 no-underline block hover:translate-y-[-3px] hover:shadow-md" href={s.l} target="_blank" rel="noopener">
                <div className="text-[var(--primary)] mb-2.5 flex justify-center">{s.i}</div>
                <div className="font-bold text-sm text-[var(--secondary)] mb-1">{s.n}</div>
                <div className="text-xs text-[var(--primary)]">{s.h}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
