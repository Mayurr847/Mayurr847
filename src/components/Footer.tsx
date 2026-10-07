import React from 'react';
import { Music, ArrowUp } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About' },
    { id: 'journal', label: 'Journal' },
    { id: 'visit', label: 'Visit' },
    { id: 'orders', label: 'My Orders' },
    { id: 'owner', label: 'Staff & Owner Portal' },
  ];

  return (
    <footer className="bg-[#1D1916] text-[#F6F0E6] pt-16 pb-12 border-t-3 border-[#1D1916] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Row: Brand & Navigation & Social */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-white/15">

          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="font-['League_Spartan'] font-black text-2xl text-[#F6F0E6] tracking-tight lowercase">
                the little cup
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#E2D5C0] max-w-sm leading-relaxed">
              Specialty coffee, ceremonial Uji matcha, and a warm corner for daydreamers and overthinkers.
            </p>

            <div className="pt-2">
              <span className="font-['Caveat'] text-2xl text-[#F4D35E] font-bold rotate-[-1deg] inline-block">
                “GOOD COFFEE. BAD DECISIONS.”
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 text-left">
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-[#8FAF78] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 font-space text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-[#E2D5C0] hover:text-[#F4D35E] transition-colors focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Hours */}
          <div className="md:col-span-4 text-left space-y-4">
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-[#8FAF78] mb-4">
              Connect & Listen
            </h4>

            <div className="flex items-center gap-3">
              <a
                href={CAFE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#2E2722] hover:bg-[#8FAF78] text-[#F6F0E6] hover:text-[#1D1916] border border-white/10 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={CAFE_INFO.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#2E2722] hover:bg-[#F4D35E] text-[#F6F0E6] hover:text-[#1D1916] border border-white/10 transition-all font-space font-bold text-xs"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <a
                href={CAFE_INFO.spotifyPlaylistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#2E2722] hover:bg-[#D94A45] text-[#F6F0E6] border border-white/10 transition-all flex items-center gap-1.5 text-xs font-space"
                aria-label="Spotify Café Playlist"
              >
                <Music className="w-3.5 h-3.5 text-[#8FAF78]" />
                <span>Café Playlist</span>
              </a>
            </div>

            <div className="pt-2 text-xs font-sans text-[#E2D5C0] space-y-1">
              <p className="font-bold text-[#F6F0E6] font-['League_Spartan'] uppercase tracking-wider">{CAFE_INFO.name} • Ahmedabad</p>
              <p>{CAFE_INFO.address.street}, {CAFE_INFO.address.city}</p>
              <p className="text-[#8FAF78]">Open Daily 8:00 AM – 2:00 AM (Late Night)</p>
              <p className="font-mono text-[#F4D35E]">Tel: {CAFE_INFO.phone}</p>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-space text-[#A7C492]/80">
          <p className="text-[#E2D5C0]">
            © 2026 The Little Cup. All rights reserved.
          </p>

          <span className="font-handwritten text-lg text-[#F4D35E] font-bold">
            made with oat milk & love ♡
          </span>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-space font-bold text-[#E2D5C0] hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
