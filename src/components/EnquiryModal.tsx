import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, Send, Loader2, CheckCircle, X } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, initialProduct }) => {
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
        setTimeout(() => {
          setStatus('idle');
          onClose();
        }, 2000);
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
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div 
            className="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button className="modal-close flex items-center justify-center" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
            <h2 id="modalTitle" className="flex items-center gap-2">
              <ClipboardList className="text-[var(--primary)]" /> Send Enquiry
            </h2>
            <form className="enquiry-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" placeholder="Your Full Name" required />
              </div>
              <div className="form-group">
                <label>Mobile *</label>
                <input type="tel" name="mobile" placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="you@company.com" />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" name="company" placeholder="Company / Brand Name" />
              </div>
              <div className="form-group">
                <label>Product *</label>
                <select name="product" defaultValue={initialProduct || ""}>
                  <option value="">Select Product Category</option>
                  <option value="Rigid Boxes / Gift Boxes">Rigid Boxes / Gift Boxes</option>
                  <option value="Mono Cartons / Pharma Packaging">Mono Cartons / Pharma Packaging</option>
                  <option value="Food Packaging">Food Packaging</option>
                  <option value="3D Display Units">3D Display Units</option>
                  <option value="Commercial Printing">Commercial Printing</option>
                  <option value="Brochures / Catalogs">Brochures / Catalogs</option>
                  <option value="Design Services">Design Services</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>
              <div className="form-group">
                <label>Requirement</label>
                <textarea name="message" placeholder="Describe qty, size, material, deadline..."></textarea>
              </div>
              <button 
                type="submit" 
                className={`submit-btn flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-600' : ''}`}
                disabled={status !== 'idle'}
              >
                {status === 'idle' && <><Send size={16} /> Submit Enquiry</>}
                {status === 'sending' && <><Loader2 size={16} className="animate-spin" /> Sending...</>}
                {status === 'success' && <><CheckCircle size={16} /> Submitted Successfully!</>}
              </button>
              <p className="form-note flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-600" /> We respond within 2 working hours
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
