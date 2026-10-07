import React from 'react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    '★ GOOD COFFEE. BAD DECISIONS.',
    '✦ CEREMONIAL GRADE UJI MATCHA',
    '☺ FREE OAT MILK SWAPS ALWAYS',
    '★ BAKED FRESH EVERY 7AM',
    '✦ DOGS WELCOME & PUP CUPS',
    '★ VINYL RECORDS & GOOD BANTER',
    '☺ NO CORPORATE BEIGE DRINKS',
    '✦ 100% ETHICALLY SOURCED BEANS',
  ];

  return (
    <div className="w-full bg-[#1D1916] text-[#F6F0E6] py-3.5 border-y-2 border-[#1D1916] overflow-hidden select-none -rotate-1 shadow-brutal my-8">
      <div className="flex w-fit whitespace-nowrap animate-marquee">
        {/* Render 3 copies for seamless infinite ticker loop */}
        {[0, 1, 2].map((loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-8 shrink-0 px-4">
            {items.map((text, idx) => (
              <span
                key={`${loopIdx}-${idx}`}
                className="font-syne font-bold text-sm tracking-wider uppercase flex items-center gap-4 text-[#F6F0E6]"
              >
                <span>{text}</span>
                <span className="text-[#F4D35E]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
