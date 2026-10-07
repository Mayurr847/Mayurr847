import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { INSTAGRAM_POSTS, CAFE_INFO } from '../data/cafeData';

export const SocialSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F6F0E6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal text-xs font-syne font-black text-[#1D1916] uppercase tracking-wider mb-3">
              <svg className="w-3.5 h-3.5 text-[#D94A45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@thelittlecupcafe</span>
            </div>

            <h2 className="font-syne font-black text-4xl sm:text-6xl text-[#1D1916] tracking-tight uppercase leading-[0.95]">
              SEE YOU ON<br />
              <span className="text-[#8FAF78]">THE FEED.</span>
            </h2>
          </div>

          <a
            href={CAFE_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 bg-[#FAF6F0] hover:bg-[#EDE4D5] text-[#1D1916] font-space font-bold text-sm sm:text-base px-6 py-3.5 rounded-full border-2 border-[#1D1916] shadow-brutal hover:shadow-brutal-lg transition-all self-start md:self-auto"
          >
            <svg className="w-4 h-4 text-[#D94A45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Follow along →</span>
          </a>
        </div>

        {/* 6 Post Editorial Collage Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {INSTAGRAM_POSTS.map((post, idx) => {
            const rotations = ['rotate-[-1.5deg]', 'rotate-[2deg]', 'rotate-[-2deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]', 'rotate-[2deg]'];
            const rot = rotations[idx % rotations.length];

            return (
              <a
                key={post.id}
                href={CAFE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`polaroid-frame p-2.5 bg-[#FDFAF5] rounded-xl ${rot} group block transition-all duration-300 relative`}
              >
                {/* Tape detail on every alternating card */}
                {idx % 2 === 0 && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#F4D35E]/80 border border-[#1D1916]/20 rotate-[-4deg] z-10" />
                )}

                <div className="aspect-square rounded-lg overflow-hidden bg-[#EDE4D5] relative border border-[#1D1916]">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Hover Overlay with Likes & Comments */}
                  <div className="absolute inset-0 bg-[#1D1916]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white text-xs font-space">
                    <span className="text-[10px] font-handwritten text-[#F4D35E] font-bold">
                      {post.tag}
                    </span>
                    <p className="line-clamp-2 text-[11px] leading-tight text-white/90">
                      {post.caption}
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/20">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#D94A45] fill-current" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="font-handwritten text-xs text-[#1D1916] font-bold block truncate">
                    {post.tag}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Tagline note */}
        <div className="mt-10 text-center">
          <p className="font-handwritten text-xl text-[#1D1916] font-bold">
            tag <span className="text-[#D94A45]">#TheLittleCup</span> to be featured on our bulletin board 📌
          </p>
        </div>

      </div>
    </section>
  );
};
