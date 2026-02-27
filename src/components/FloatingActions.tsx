import React from 'react';
import { Phone, MessageSquare, MessageCircle } from 'lucide-react';
import { SITE } from '../constants';

interface FloatingActionsProps {
  onOpenModal: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenModal }) => {
  return (
    <>
      <div className="sticky-contact">
        <button className="sticky-btn flex items-center gap-2" onClick={() => window.location.href = `tel:${SITE.tel}`}>
          <Phone size={16} /> Call Now
        </button>
        <button className="sticky-btn flex items-center gap-2" onClick={onOpenModal}>
          <MessageSquare size={16} /> Enquiry
        </button>
      </div>
      <a 
        className="whatsapp-float flex items-center gap-2" 
        href={`https://wa.me/${SITE.whatsapp}?text=Hello!%20I%20want%20to%20enquire%20about%20your%20printing%20%26%20packaging%20services.`} 
        target="_blank" 
        rel="noopener"
      >
        <MessageCircle size={20} /> WhatsApp Us
      </a>
    </>
  );
};
