import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { AboutSection } from './components/AboutSection';
import { MenuPreview } from './components/MenuPreview';
import { FullMenuSection } from './components/FullMenuSection';
import { VisitSection } from './components/VisitSection';
import { JournalSection } from './components/JournalSection';
import { SocialSection } from './components/SocialSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveOrderTrackingModal } from './components/LiveOrderTrackingModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { DrinkCustomizeModal } from './components/DrinkCustomizeModal';
import { ArticleModal } from './components/ArticleModal';
import { StoryModal } from './components/StoryModal';
import { Toast } from './components/Toast';

const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { openOwnerDashboard, openMyOrders, openTrackingModal } = useCart();

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'menu', 'about', 'journal', 'visit'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = React.useCallback(
    (sectionId: string, pushHistory = true) => {
      const normalized = sectionId.toLowerCase().replace(/^#+/, '').replace(/^\/+/, '');
      if (
        normalized === 'owner' ||
        normalized.startsWith('owner/') ||
        normalized === 'staff' ||
        normalized.startsWith('staff/') ||
        normalized === 'admin' ||
        normalized.startsWith('admin/') ||
        normalized === 'kitchen'
      ) {
        openOwnerDashboard();
        return;
      }
      if (sectionId === 'orders' || sectionId === 'my-orders') {
        openMyOrders();
        return;
      }
      if (sectionId === 'track') {
        openTrackingModal();
        return;
      }

      setActiveSection(sectionId);
      if (pushHistory && window.location.hash !== `#${sectionId}`) {
        window.history.pushState(null, '', `#${sectionId}`);
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [openOwnerDashboard, openMyOrders, openTrackingModal]
  );

  // Handle browser back/forward and initial URL hash
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        handleNavigate(hash, false);
      } else {
        handleNavigate('hero', false);
      }
    };

    if (window.location.hash) {
      const initialHash = window.location.hash.replace('#', '');
      setTimeout(() => {
        handleNavigate(initialHash, false);
      }, 100);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleNavigate]);

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#1D1916] flex flex-col justify-between selection:bg-[#F4D35E] selection:text-[#1D1916]">
      {/* Sticky Navbar */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Editorial Hero */}
        <Hero
          onExploreMenu={() => handleNavigate('menu')}
        />

        {/* Marquee Ticker 1 */}
        <MarqueeTicker />

        {/* About / Our Vibe Section */}
        <AboutSection />

        {/* Menu Fan Favorites Preview */}
        <MenuPreview onViewFullMenu={() => handleNavigate('menu')} />

        {/* Full Comprehensive Menu */}
        <FullMenuSection />

        {/* Physical Visit / Location Section */}
        <VisitSection />

        {/* Editorial Journal Articles */}
        <JournalSection />

        {/* Instagram / Social Media Grid */}
        <SocialSection />

        {/* Newsletter Signup */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-over Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <LiveOrderTrackingModal />
      <MyOrdersModal />
      <OwnerDashboard />
      <DrinkCustomizeModal />
      <ArticleModal />
      <StoryModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
