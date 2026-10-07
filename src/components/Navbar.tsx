import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu as MenuIcon, X, Clock, ReceiptText, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const {
    cartCount,
    openCart,
    activeOrder,
    openTrackingModal,
    openMyOrders,
    openOwnerDashboard,
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live timer for active order pill
  useEffect(() => {
    if (!activeOrder) return;
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  // Escape key and scroll lock for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About' },
    { id: 'journal', label: 'Journal' },
    { id: 'visit', label: 'Visit' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  // Compute active order label
  const isOrderActive =
    activeOrder &&
    (activeOrder.orderStatus === 'new' ||
      activeOrder.orderStatus === 'confirmed' ||
      activeOrder.orderStatus === 'preparing' ||
      activeOrder.orderStatus === 'delayed' ||
      activeOrder.orderStatus === 'ready');

  let activeOrderLabel = '';
  let activeOrderColorClass = 'bg-[#1D1916] text-[#F4D35E] border-[#1D1916]';

  if (activeOrder && isOrderActive) {
    if (activeOrder.orderStatus === 'ready') {
      activeOrderLabel = `#${activeOrder.orderId} • READY!`;
      activeOrderColorClass = 'bg-[#8FAF78] text-[#1D1916] border-[#1D1916] animate-bounce-short';
    } else {
      const targetMs = new Date(activeOrder.estimatedReadyAt).getTime();
      const diffSec = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
      const mins = Math.floor(diffSec / 60);
      if (nowMs > targetMs) {
        activeOrderLabel = `#${activeOrder.orderId} • DELAYED`;
        activeOrderColorClass = 'bg-[#F4D35E] text-[#1D1916] border-[#1D1916]';
      } else {
        activeOrderLabel = `#${activeOrder.orderId} • ${mins}m`;
      }
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? 'bg-[#F5EFE6]/95 backdrop-blur-md py-4'
          : 'bg-transparent py-7 sm:py-9'
          }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between">
            {/* Exact Logo */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('hero');
              }}
              className="group flex flex-col items-start select-none focus:outline-none"
            >
              <div className="flex items-center gap-1">
                <span className="font-['League_Spartan'] font-black text-2xl tracking-tight text-[#1D1916] leading-none">
                  the
                </span>
                {/* Hand-drawn Green Crown */}
                <svg
                  className="w-12 h-8 text-[#8FAF78] -mt-2 ml-1 rotate-12 transform origin-bottom-left transition-transform group-hover:rotate-[16deg]"
                  viewBox="0 0 28 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 15L5 4L11 10L14 3L17 10L23 4L25 15H3Z" />
                </svg>
              </div>
              <span className="font-['League_Spartan'] font-black text-2xl tracking-tight text-[#1D1916] leading-none -mt-0.5">
                little cup
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`font-sans text-xs sm:text-sm transition-all relative py-1 px-3 rounded-full focus:outline-none ${isActive
                      ? 'bg-[#EED89F] font-semibold text-[#1D1916]'
                      : 'font-normal text-[#1D1916] hover:text-[#5A5048]'
                      }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              {/* My Orders Button */}
              <button
                onClick={openMyOrders}
                className="font-sans text-xs sm:text-sm font-semibold text-[#1D1916] hover:text-[#5A5048] flex items-center gap-1 py-1 px-2.5 rounded-full hover:bg-black/5 transition-all"
                title="View order history"
              >
                <ReceiptText className="w-3.5 h-3.5 text-[#8FAF78]" />
                <span>Orders</span>
              </button>
            </nav>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Persistent Active Order Indicator Pill */}
              {isOrderActive && (
                <button
                  onClick={openTrackingModal}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-space font-bold border shadow-brutal transition-transform hover:scale-103 active:scale-97 ${activeOrderColorClass}`}
                  title="View Live Order Status"
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[120px]">{activeOrderLabel}</span>
                </button>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full hover:bg-black/5 text-[#1D1916] transition-transform active:scale-95"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D94A45] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Exact Butter Yellow "Order Now →" Pill Button */}
              <button
                onClick={openCart}
                className="inline-flex items-center gap-2 bg-[#EFC958] hover:bg-[#E5BC44] text-[#1D1916] font-sans font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-full transition-all hover:scale-102 active:scale-98"
              >
                <span>Order Now</span>
                <span>→</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-[#1D1916] hover:bg-black/5 focus:outline-none"
                aria-label="Toggle Menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-30 bg-[#F5EFE6] flex flex-col justify-between pt-24 pb-8 px-6 md:hidden animate-fadeIn"
        >
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="flex items-center justify-between text-left py-2.5 border-b border-[#1D1916]/10 group"
              >
                <span className="font-['League_Spartan'] font-black text-2xl text-[#1D1916] group-hover:text-[#8FAF78]">
                  {link.label}
                </span>
                <span className="text-[#1D1916] font-bold">→</span>
              </button>
            ))}

            {/* My Orders option in mobile menu */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openMyOrders();
              }}
              className="flex items-center justify-between text-left py-2.5 border-b border-[#1D1916]/10 group"
            >
              <div className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-[#8FAF78]" />
                <span className="font-['League_Spartan'] font-black text-2xl text-[#1D1916] group-hover:text-[#8FAF78]">
                  My Orders
                </span>
              </div>
              <span className="text-[#1D1916] font-bold">→</span>
            </button>

            {/* Staff Hub link in mobile menu */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openOwnerDashboard();
              }}
              className="flex items-center justify-between text-left py-2.5 border-b border-[#1D1916]/10 text-[#5A5048]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8FAF78]" />
                <span className="font-space font-bold text-sm">
                  Staff & Owner Hub
                </span>
              </div>
              <span className="text-xs font-mono font-bold">Portal →</span>
            </button>
          </nav>

          <div className="space-y-3">
            {isOrderActive && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openTrackingModal();
                }}
                className="w-full bg-[#1D1916] text-[#F4D35E] font-space font-bold text-sm py-3.5 rounded-full shadow-brutal flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Track Active Order ({activeOrderLabel}) →</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCart();
              }}
              className="w-full bg-[#EFC958] text-[#1D1916] font-sans font-bold text-base py-4 rounded-full shadow-sm flex items-center justify-center gap-2"
            >
              <span>Order Now ({cartCount} items) →</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
