import React from 'react';
import { useCart } from '../context/CartContext';

export const AboutSection: React.FC = () => {
  const { openStoryModal } = useCart();

  return (
    <section id="about" className="py-20 lg:py-28 relative bg-[#F5EFE6] overflow-visible">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Café Front Window with Bench & Green Stool */}
          <div className="lg:col-span-5 relative">
            {/* Hand-drawn Red Heart Doodle on Left */}
            <div className="absolute top-1/3 -left-5 sm:-left-7 z-20 pointer-events-none">
              <svg className="w-8 h-8 text-[#D94A45] -rotate-12" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M25,40 C15,30 5,20 10,10 C15,2 23,6 25,12 C27,6 35,2 40,10 C45,20 35,30 25,40 Z" />
              </svg>
            </div>

            {/* Main Photo Frame */}
            <div className="relative rounded-lg overflow-hidden shadow-md bg-white p-2 sm:p-2.5 -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/5] overflow-hidden rounded bg-[#EDE4D5] relative">
                <img
                  src="/images/cafe_front_bench.jpg"
                  alt="The Little Cup café storefront with window lettering and wooden bench"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy + Handwritten Notes Bracket */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-start justify-between gap-8 text-left">
            
            {/* Main Text Content */}
            <div className="max-w-sm">
              {/* Green Outline Pill: OUR VIBE */}
              <div className="inline-block px-3.5 py-1 rounded-full border border-[#8FAF78] text-[#8FAF78] font-['League_Spartan'] font-bold text-xs uppercase tracking-wider mb-4">
                OUR VIBE
              </div>

              {/* Large Headline: MORE THAN JUST COFFEE. */}
              <h2 className="font-['League_Spartan'] font-black text-5xl sm:text-6xl lg:text-7xl text-[#1D1916] tracking-[-0.04em] leading-[0.88] uppercase">
                MORE THAN<br />
                JUST COFFEE.
              </h2>

              {/* Body Copy */}
              <p className="mt-6 font-sans text-xs sm:text-sm text-[#1D1916]/80 leading-relaxed">
                The Little Cup is a Gen-Z owned café built for daydreamers, overthinkers, creatives, and anyone who believes good coffee makes life a little softer (and a lot more fun).
              </p>

              {/* Underlined Link: Our Story → */}
              <div className="mt-8">
                <button
                  onClick={openStoryModal}
                  className="font-sans font-semibold text-xs sm:text-sm text-[#1D1916] hover:text-[#5A5048] underline underline-offset-8 transition-colors flex items-center gap-1.5 focus:outline-none"
                >
                  <span>Our Story</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right Side: Handwritten Green Annotations & Bracket */}
            <div className="flex items-start gap-3 pt-2 sm:pt-6 select-none">
              {/* Vertical Green Line */}
              <div className="w-[1.2px] h-32 bg-[#8FAF78]/60 mt-1" />

              {/* Handwritten notes */}
              <div className="font-['Caveat'] text-lg sm:text-xl text-[#8FAF78] font-bold space-y-1.5 leading-tight">
                <div>great<br />coffee</div>
                <div className="text-center text-xs opacity-60">·</div>
                <div>cool people</div>
                <div className="text-center text-xs opacity-60">·</div>
                <div>random<br />conversations</div>
                <div className="text-sm opacity-60">...</div>
                <div className="text-xl pt-0.5">☺</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
