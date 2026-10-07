import React from 'react';
import { useCart } from '../context/CartContext';
import { Heart } from 'lucide-react';
import { MENU_ITEMS } from '../data/cafeData';

interface MenuPreviewProps {
  onViewFullMenu: () => void;
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ onViewFullMenu }) => {
  const { toggleFavorite, isFavorite, openCustomizeModal } = useCart();

  const previewCards = [
    {
      id: 'iced-latte',
      name: 'Iced Latte',
      priceFormatted: '$5.5',
      image: '/images/iced_latte_togo.jpg',
      rotation: '-rotate-1',
      sparksColor: '#F4D35E',
      sparksSide: 'left',
    },
    {
      id: 'matcha-latte',
      name: 'Matcha Latte',
      priceFormatted: '$5.5',
      image: '/images/matcha_latte_togo.jpg',
      rotation: 'rotate-0',
      badge: 'BEST\nSELLER',
      badgeColor: '#8FAF78',
    },
    {
      id: 'cherry-cold-foam',
      name: 'Cherry Cold Foam',
      priceFormatted: '$6',
      image: '/images/cherry_coldfoam_cup.jpg',
      rotation: 'rotate-1',
      sparksColor: '#D94A45',
      sparksSide: 'right',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F5EFE6] relative overflow-visible">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-4 text-left pt-2">
            {/* Hand-drawn Green Star Outline + FAN FAVORITES */}
            <div className="flex items-center gap-1.5 mb-3">
              <svg className="w-5 h-5 text-[#8FAF78]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="font-['League_Spartan'] font-bold text-xs uppercase tracking-wider text-[#8FAF78]">
                FAN FAVORITES
              </span>
            </div>

            {/* Large Heading: WHAT'S BREWING? */}
            <h2 className="font-['League_Spartan'] font-black text-5xl sm:text-6xl text-[#1D1916] tracking-[-0.04em] uppercase leading-[0.88]">
              WHAT’S<br />
              BREWING?
            </h2>

            {/* Subtitle */}
            <p className="mt-5 font-sans text-xs sm:text-sm text-[#1D1916]/80 leading-relaxed max-w-xs">
              From classic espresso to creamy matcha, we’ve got something for every mood.
            </p>

            {/* Underlined Link: View Full Menu → */}
            <div className="mt-8">
              <button
                onClick={onViewFullMenu}
                className="font-sans font-semibold text-xs sm:text-sm text-[#1D1916] hover:text-[#5A5048] underline underline-offset-8 transition-colors flex items-center gap-1.5 focus:outline-none"
              >
                <span>View Full Menu</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3 Polaroid Product Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 relative">
            {previewCards.map((card) => {
              const fullItem = MENU_ITEMS.find((m) => m.id === card.id) || MENU_ITEMS[0];
              const isFav = isFavorite(card.id);

              return (
                <div key={card.id} className="relative group">
                  
                  {/* Left Yellow Sparks (on Iced Latte) */}
                  {card.sparksSide === 'left' && (
                    <div className="absolute top-1/3 -left-5 z-20 pointer-events-none hidden sm:block">
                      <svg className="w-5 h-7 text-[#F4D35E]" viewBox="0 0 30 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="20" y1="8" x2="4" y2="4" />
                        <line x1="24" y1="20" x2="8" y2="20" />
                        <line x1="20" y1="32" x2="4" y2="36" />
                      </svg>
                    </div>
                  )}

                  {/* Right Red Sparks (on Cherry Cold Foam) */}
                  {card.sparksSide === 'right' && (
                    <div className="absolute top-1/3 -right-5 z-20 pointer-events-none hidden sm:block">
                      <svg className="w-5 h-7 text-[#D94A45]" viewBox="0 0 30 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="4" y1="8" x2="20" y2="4" />
                        <line x1="2" y1="20" x2="18" y2="20" />
                        <line x1="4" y1="32" x2="20" y2="36" />
                      </svg>
                    </div>
                  )}

                  {/* Top-Right Round Green Sticker (BEST SELLER on Matcha) */}
                  {card.badge && (
                    <div className="absolute -top-3.5 -right-2.5 z-30 w-14 h-14 rounded-full bg-[#8FAF78] text-[#1D1916] flex flex-col items-center justify-center font-['League_Spartan'] font-black text-[9px] leading-tight text-center uppercase rotate-6 pointer-events-none select-none">
                      <span>BEST</span>
                      <span>SELLER</span>
                    </div>
                  )}

                  {/* Polaroid Card Frame */}
                  <div className={`bg-white p-2.5 pb-3 rounded-lg shadow-md ${card.rotation} group-hover:rotate-0 transition-transform duration-300 text-left`}>
                    {/* Photo */}
                    <div
                      onClick={() => openCustomizeModal(fullItem)}
                      className="aspect-[3/4] bg-[#EDE4D5] rounded overflow-hidden cursor-pointer relative"
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom Info: Title, Price, Heart */}
                    <div className="pt-2 px-1 flex items-end justify-between">
                      <div>
                        <h3 className="font-['Caveat'] text-base sm:text-lg font-bold text-[#1D1916] leading-tight">
                          {card.name}
                        </h3>
                        <p className="font-['Caveat'] text-sm sm:text-base text-[#1D1916] font-bold mt-0.5">
                          {card.priceFormatted}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Heart Like Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(card.id);
                          }}
                          className="p-1 text-[#1D1916] hover:text-[#D94A45] transition-colors focus:outline-none"
                          aria-label="Toggle favorite"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-all ${
                              isFav ? 'text-[#D94A45] fill-current' : 'text-[#1D1916]'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
