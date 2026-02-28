import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { EnquiryModal } from './components/EnquiryModal';
import { useSettings, swrConfig } from './hooks/useApi';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Products = React.lazy(() => import('./pages/Products'));
const Packaging = React.lazy(() => import('./pages/Packaging'));
const Printing = React.lazy(() => import('./pages/Printing'));
const DisplayUnits = React.lazy(() => import('./pages/DisplayUnits'));
const Services = React.lazy(() => import('./pages/Services'));
const Industries = React.lazy(() => import('./pages/Industries'));
const Sitemap = React.lazy(() => import('./pages/Sitemap'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const DEFAULT_LOGO = "https://static.wixstatic.com/media/895e2c_99457844de4b481da7005c3e882ca1ec~mv2.jpg";

function AppContent() {
  const { settings } = useSettings();
  const logoUrl = settings?.logo_url || DEFAULT_LOGO;
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalProduct, setModalProduct] = React.useState<string | undefined>(undefined);

  const openModal = (product?: string) => {
    setModalProduct(product);
    setIsModalOpen(true);
  };

  return (
    <Router>
      <ScrollToTop />
      <Header onOpenModal={openModal} logoUrl={logoUrl} />
      <main>
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--primary)] rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home onOpenModal={openModal} />} />
            <Route path="/about" element={<About onOpenModal={openModal} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products onOpenModal={openModal} />} />
            <Route path="/packaging" element={<Packaging onOpenModal={openModal} />} />
            <Route path="/printing" element={<Printing onOpenModal={openModal} />} />
            <Route path="/display-units" element={<DisplayUnits onOpenModal={openModal} />} />
            <Route path="/services" element={<Services onOpenModal={openModal} />} />
            <Route path="/industries" element={<Industries onOpenModal={openModal} />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </React.Suspense>
      </main>
      <Footer logoUrl={logoUrl} />
      <FloatingActions onOpenModal={() => openModal()} />
      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialProduct={modalProduct} 
      />
    </Router>
  );
}

export default function App() {
  return (
    <SWRConfig value={swrConfig}>
      <AppContent />
    </SWRConfig>
  );
}
