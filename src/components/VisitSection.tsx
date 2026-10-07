import React, { useState, useEffect } from 'react';
import { Clock, Navigation, Wifi, Plug, Utensils, Star, Calendar, Phone } from 'lucide-react';
import { CAFE_INFO, GOOGLE_REVIEWS } from '../data/cafeData';

export const VisitSection: React.FC = () => {
  const [mapMode, setMapMode] = useState<'map' | 'street' | 'reviews'>('map');
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Check if currently open based on 8:00 AM to 2:00 AM (next morning) hours
  const [isOpenNow, setIsOpenNow] = useState(() => {
    const currentHour = new Date().getHours();
    return currentHour >= 8 || currentHour < 2;
  });

  useEffect(() => {
    const checkOpenStatus = () => {
      const currentHour = new Date().getHours();
      setIsOpenNow(currentHour >= 8 || currentHour < 2);
    };
    const timer = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="visit" className="py-20 lg:py-24 bg-[#F5EFE6] border-t border-[#1D1916]/10 relative overflow-hidden scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-block px-3.5 py-1 rounded-full border border-[#8FAF78] text-[#8FAF78] font-['League_Spartan'] font-bold text-xs uppercase tracking-wider mb-3">
              THE PHYSICAL SPACE
            </div>

            <h2 className="font-['League_Spartan'] font-black text-5xl sm:text-6xl text-[#1D1916] tracking-[-0.04em] uppercase leading-[0.88]">
              COME<br />
              HANG.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Google Rating Badge */}
            <div className="p-3 px-4 rounded-2xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal flex items-center gap-2.5">
              <div className="flex items-center text-[#EFC958]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#EFC958]" />
                ))}
              </div>
              <div className="text-left leading-tight">
                <span className="font-['League_Spartan'] font-black text-xs text-[#1D1916] block">
                  5.0 ★ GOOGLE RATED
                </span>
                <span className="text-[10px] text-[#5A5048] font-mono">
                  {CAFE_INFO.priceRange}
                </span>
              </div>
            </div>

            {/* Live Open Status */}
            <div className="p-3 px-4 rounded-2xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal flex items-center gap-3">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  isOpenNow ? 'bg-[#8FAF78] animate-ping' : 'bg-[#D94A45]'
                }`}
              />
              <span
                className={`w-3.5 h-3.5 rounded-full -ml-6.5 ${
                  isOpenNow ? 'bg-[#8FAF78]' : 'bg-[#D94A45]'
                }`}
              />
              <div className="text-left">
                <span className="font-['League_Spartan'] font-bold text-xs uppercase tracking-wider block text-[#1D1916]">
                  {isOpenNow ? 'Open Right Now' : 'Closed · Opens at 8 AM'}
                </span>
                <span className="text-[11px] text-[#5A5048] font-mono">
                  Daily: 8:00 AM – 2:00 AM (Late Night)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Info & Stylized Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Location & Hours Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address & Contact Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal-lg space-y-6">
              <div>
                <h3 className="font-['League_Spartan'] font-black text-2xl sm:text-3xl text-[#1D1916] uppercase">
                  {CAFE_INFO.name}
                </h3>
                <p className="mt-2 font-sans text-sm sm:text-base text-[#2E2722] font-medium leading-snug">
                  {CAFE_INFO.address.street}<br />
                  <span className="text-xs text-[#5A5048] block font-mono mt-0.5">
                    ({CAFE_INFO.address.landmark})
                  </span>
                  {CAFE_INFO.address.city}, {CAFE_INFO.address.state} {CAFE_INFO.address.zip}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#8FAF78]/15 text-[#5A5048] font-mono text-[11px]">
                    📍 Plus Code: {CAFE_INFO.address.plusCode}
                  </span>
                </div>
              </div>

              {/* Hours Table */}
              <div className="pt-4 border-t-2 border-[#1D1916]/15 space-y-3">
                <div className="flex items-center gap-2 text-xs font-['League_Spartan'] font-bold uppercase tracking-wider text-[#1D1916]">
                  <Clock className="w-4 h-4 text-[#8FAF78]" />
                  <span>Opening Hours</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  {CAFE_INFO.hours.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#F6F0E6] border border-[#1D1916]/20 font-medium"
                    >
                      <span className="text-[#1D1916] font-bold">{h.days}</span>
                      <span className="text-[#5A5048] font-mono">{h.open} – {h.close}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Action Buttons: Reserve Table & Directions */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAFE_INFO.address.reserveUrl && (
                  <a
                    href={CAFE_INFO.address.reserveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#EFC958] hover:bg-[#E5BC44] text-[#1D1916] font-sans font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border-2 border-[#1D1916] shadow-brutal hover:shadow-brutal-lg transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve a Table</span>
                  </a>
                )}
                <a
                  href={CAFE_INFO.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1D1916] hover:bg-[#2E2722] text-[#F6F0E6] font-sans font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border-2 border-[#1D1916] shadow-brutal hover:shadow-brutal-lg transition-all"
                >
                  <Navigation className="w-4 h-4 text-[#EFC958]" />
                  <span>Directions →</span>
                </a>
              </div>
            </div>

            {/* Quick Amenities Chips */}
            <div className="p-6 rounded-2xl bg-[#FDFAF5] border-2 border-[#1D1916] shadow-brutal">
              <h4 className="font-['League_Spartan'] font-bold text-xs uppercase tracking-wider text-[#1D1916] mb-3">
                Space Features
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1D1916]">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF6F0] border border-[#1D1916]/20">
                  <Wifi className="w-3.5 h-3.5 text-[#8FAF78]" />
                  <span>Free Fast Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF6F0] border border-[#1D1916]/20">
                  <Clock className="w-3.5 h-3.5 text-[#EFC958]" />
                  <span>Open Till 2:00 AM</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF6F0] border border-[#1D1916]/20">
                  <Plug className="w-3.5 h-3.5 text-[#D94A45]" />
                  <span>Laptop Outlets</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF6F0] border border-[#1D1916]/20">
                  <Utensils className="w-3.5 h-3.5 text-[#8FAF78]" />
                  <span>Dine-In & Takeaway</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Stylized Map & Google Reviews Component */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="w-full h-full min-h-[440px] rounded-2xl bg-[#EDE4D5] border-3 border-[#1D1916] shadow-brutal-lg overflow-hidden relative flex flex-col justify-between p-6">
              
              {/* Map view switcher tabs */}
              <div className="flex items-center justify-between z-20">
                <div className="flex items-center gap-2 bg-[#FAF6F0] p-1 rounded-xl border-2 border-[#1D1916] shadow-brutal">
                  <button
                    onClick={() => setMapMode('map')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-colors ${
                      mapMode === 'map'
                        ? 'bg-[#1D1916] text-[#F6F0E6]'
                        : 'text-[#1D1916] hover:bg-[#EDE4D5]'
                    }`}
                  >
                    Illustrated Map
                  </button>
                  <button
                    onClick={() => setMapMode('reviews')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-colors ${
                      mapMode === 'reviews'
                        ? 'bg-[#1D1916] text-[#F6F0E6]'
                        : 'text-[#1D1916] hover:bg-[#EDE4D5]'
                    }`}
                  >
                    Google Reviews (5.0 ★)
                  </button>
                  <button
                    onClick={() => setMapMode('street')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-colors ${
                      mapMode === 'street'
                        ? 'bg-[#1D1916] text-[#F6F0E6]'
                        : 'text-[#1D1916] hover:bg-[#EDE4D5]'
                    }`}
                  >
                    Café Front Photo
                  </button>
                </div>

                <span className="font-['Caveat'] text-lg text-[#1D1916] font-bold bg-[#EFC958] px-3 py-1 border border-[#1D1916] shadow-brutal rotate-2 hidden sm:inline-block">
                  Landmark: Next to Wide Angle
                </span>
              </div>

              {/* Map Canvas / Reviews / Visuals */}
              {mapMode === 'map' ? (
                <div className="my-auto py-8 relative flex items-center justify-center">
                  {/* Stylized Illustrated Street Grid SVG */}
                  <svg
                    className="w-full max-w-lg h-64 text-[#1D1916]/30"
                    viewBox="0 0 400 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Grid roads */}
                    <rect x="20" y="20" width="100" height="80" rx="8" fill="#F6F0E6" stroke="#1D1916" strokeWidth="2" />
                    <rect x="150" y="20" width="220" height="80" rx="8" fill="#F6F0E6" stroke="#1D1916" strokeWidth="2" />
                    <rect x="20" y="130" width="100" height="90" rx="8" fill="#F6F0E6" stroke="#1D1916" strokeWidth="2" />
                    <rect x="150" y="130" width="220" height="90" rx="8" fill="#F6F0E6" stroke="#1D1916" strokeWidth="2" />

                    {/* Street Names */}
                    <text x="70" y="118" fill="#1D1916" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      ISCON CROSS ROADS
                    </text>
                    <text x="135" y="60" fill="#1D1916" fontSize="8" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-90 135 60)">
                      S.G. HIGHWAY
                    </text>
                    <text x="260" y="118" fill="#1D1916" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      WIDE ANGLE CINEMA
                    </text>

                    {/* Trees / Park icons */}
                    <circle cx="50" cy="50" r="12" fill="#8FAF78" opacity="0.7" />
                    <circle cx="80" cy="65" r="10" fill="#8FAF78" opacity="0.6" />
                    <circle cx="330" cy="180" r="14" fill="#8FAF78" opacity="0.7" />
                  </svg>

                  {/* Cafe Location Pin Callout */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-bounce-short">
                    <div className="p-2.5 rounded-xl bg-[#1D1916] text-[#F6F0E6] border-2 border-[#FAF6F0] shadow-brutal flex items-center gap-2">
                      <span className="text-base">☕</span>
                      <div className="text-left">
                        <span className="font-['League_Spartan'] font-black text-xs uppercase block text-[#EFC958]">
                          {CAFE_INFO.name}
                        </span>
                        <span className="text-[10px] font-mono text-white/80">
                          Iscon Cross Roads, SG Hwy
                        </span>
                      </div>
                    </div>
                    {/* Pin pointer */}
                    <div className="w-3 h-3 bg-[#1D1916] rotate-45 -mt-1.5 border-r-2 border-b-2 border-[#FAF6F0]" />
                  </div>
                </div>
              ) : mapMode === 'reviews' ? (
                <div className="my-auto py-4 space-y-4">
                  {/* Google Reviews Carousel Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#EFC958] text-[#1D1916] font-bold flex items-center justify-center text-xs">
                          {GOOGLE_REVIEWS[activeReviewIdx].author[0]}
                        </div>
                        <div>
                          <h5 className="font-['League_Spartan'] font-bold text-sm text-[#1D1916]">
                            {GOOGLE_REVIEWS[activeReviewIdx].author}
                          </h5>
                          <span className="text-[10px] text-[#5A5048] font-mono">
                            {GOOGLE_REVIEWS[activeReviewIdx].role || 'Google Review'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-[#EFC958]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#EFC958]" />
                        ))}
                      </div>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-[#2E2722] italic leading-relaxed">
                      "{GOOGLE_REVIEWS[activeReviewIdx].text}"
                    </p>

                    {GOOGLE_REVIEWS[activeReviewIdx].highlight && (
                      <div className="inline-block px-2 py-0.5 rounded bg-[#8FAF78]/15 text-[#8FAF78] font-['League_Spartan'] font-bold text-[11px] uppercase tracking-wide">
                        ★ {GOOGLE_REVIEWS[activeReviewIdx].highlight}
                      </div>
                    )}
                  </div>

                  {/* Review pagination dots */}
                  <div className="flex items-center justify-center gap-1.5">
                    {GOOGLE_REVIEWS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveReviewIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          activeReviewIdx === idx
                            ? 'bg-[#1D1916] w-6'
                            : 'bg-[#1D1916]/30 hover:bg-[#1D1916]/60'
                        }`}
                        aria-label={`Go to review ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="my-auto relative rounded-xl overflow-hidden border-2 border-[#1D1916] aspect-[16/9]">
                  <img
                    src="/images/cafe_interior.jpg"
                    alt="The Little Cup café front"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#1D1916]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-white/20">
                    📍 Next to Wide Angle Cinema
                  </div>
                </div>
              )}

              {/* Bottom bar of map card */}
              <div className="z-20 bg-[#FAF6F0] p-4 rounded-xl border-2 border-[#1D1916] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#1D1916]">
                  <span className="font-bold">Need a table or ordering ahead?</span>
                  <span className="text-[#5A5048]">Walk-ins & online reservations welcomed.</span>
                </div>
                <a
                  href={`tel:${CAFE_INFO.phone.replace(/\D/g, '')}`}
                  className="font-bold text-[#D94A45] hover:underline flex items-center gap-1 font-mono"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{CAFE_INFO.phone}</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
