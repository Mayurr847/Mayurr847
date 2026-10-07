import React from 'react';

interface HeroProps {
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu }) => {
  return (
    <section id="hero" className="relative pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-12 overflow-visible">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center relative">

          {/* Left Column: Stacked Headlines + Subtitle + Button */}
          <div className="lg:col-span-6 z-10 text-left">
            <h1 className="font-['League_Spartan'] font-black text-5xl sm:text-7xl md:text-8xl lg:text-[96px] xl:text-[108px] leading-[0.85] tracking-[-0.04em] text-[#1D1916] uppercase select-none">
              <span className="block">GOOD</span>
              <span className="block">COFFEE.</span>
              <span className="block">BAD</span>
              <span className="block">DECISIONS.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 font-sans text-xs sm:text-sm text-[#1D1916]/80 max-w-xs leading-relaxed">
              Specialty coffee, matcha, and a cozy space for your best (and worst) ideas.
            </p>

            {/* Explore Menu Button */}
            <div className="mt-5">
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 bg-[#EFC958] hover:bg-[#E5BC44] text-[#1D1916] font-sans font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-xs transition-all hover:scale-102 active:scale-98"
              >
                <span>Explore Menu</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Matcha Cup with Accents Locked Directly to Cup Positions */}
          <div className="lg:col-span-6 relative mt-4 lg:-mt-12 xl:-mt-16 flex justify-center items-center lg:-ml-6 xl:-ml-10">

            {/* Direct Relative Wrapper for the Cup & its Accents */}
            <div className="relative w-64 sm:w-80 md:w-[390px] lg:w-[440px] xl:w-[480px]">

              {/* 1. Green 3-Strokes: Placed at Top-Left of Cup Lid */}
              <div className="absolute top-[34%] left-[4%] sm:left-[8%] z-20 pointer-events-none">
                <svg className="w-8 h-8 text-[#8FAF78] rotate-[-8deg]" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                  <line x1="8" y1="28" x2="2" y2="18" />
                  <line x1="22" y1="20" x2="16" y2="8" />
                  <line x1="38" y1="22" x2="36" y2="10" />
                </svg>
              </div>

              {/* 2. Handwritten Note: "Same energy, different drinks." + Arrow to Cup Lid */}
              <div className="absolute top-[20%] right-[22%] sm:right-[26%] z-30 pointer-events-none text-right">
                <div className="font-['Caveat'] text-base sm:text-lg lg:text-xl text-[#1D1916] font-bold leading-tight rotate-[2deg]">
                  Same<br />
                  energy,<br />
                  different<br />
                  drinks.
                </div>
                {/* Hand-drawn curved arrow pointing to cup lid */}
                <svg
                  className="w-10 h-8 text-[#1D1916] ml-auto mt-0.5 rotate-[15deg]"
                  viewBox="0 0 60 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M45,5 C35,20 15,25 8,40" />
                  <path d="M5,30 L7,42 L18,38" />
                </svg>
              </div>

              {/* 3. Yellow Circular Sticker: "OPEN DAILY ☺" (Placed at Right of Straw/Lid) */}
              <div className="absolute top-[22%] -right-2 sm:-right-6 z-30 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#EFC958] flex flex-col items-center justify-center rotate-12 pointer-events-none select-none shadow-sm border border-[#1D1916]/10">
                <span className="font-['League_Spartan'] font-black text-[10px] sm:text-xs text-[#1D1916] tracking-tight leading-tight uppercase text-center">
                  OPEN<br />DAILY
                </span>
                <span className="font-['Caveat'] text-lg text-[#1D1916] font-bold leading-none -mt-0.5">
                  ☺
                </span>
              </div>

              {/* 4. Green 2-Strokes: Placed at Top-Right of Cup Lid */}
              <div className="absolute top-[37%] right-[6%] sm:right-[10%] z-20 pointer-events-none">
                <svg className="w-7 h-9 text-[#8FAF78] rotate-[8deg]" viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                  <line x1="8" y1="12" x2="22" y2="6" />
                  <line x1="4" y1="32" x2="24" y2="24" />
                </svg>
              </div>

              {/* Centerpiece Floating Matcha Cup */}
              <div className="relative z-10 w-full rotate-[10deg] transition-transform duration-500 hover:rotate-[7deg]">
                <img
                  src="/images/hero_matcha_cutout.png"
                  alt="The Little Cup Iced Matcha Latte"
                  className="w-full h-auto mix-blend-multiply select-none pointer-events-none"
                />
              </div>

              {/* 5. Right Side Polaroid: Cafe Corner Photo */}
              <div className="absolute top-[46%] -right-4 sm:-right-8 md:-right-12 z-20 w-28 sm:w-34 md:w-40 bg-white p-2 sm:p-2.5 pb-2.5 sm:pb-3 shadow-md rotate-[4deg] text-left">
                <div className="aspect-[3/4] bg-[#EDE4D5] overflow-hidden">
                  <img
                    src="/images/cafe_corner_polaroid.jpg"
                    alt="Good vibes cafe table"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-1.5 sm:pt-2 flex items-center justify-between font-['Caveat'] text-[11px] sm:text-xs md:text-sm text-[#1D1916] font-bold">
                  <span className="leading-tight">good vibes<br />better coffee</span>
                  <span className="text-xs">♡</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
