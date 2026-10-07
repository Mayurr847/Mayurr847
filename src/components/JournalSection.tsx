import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight, Clock } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/cafeData';

export const JournalSection: React.FC = () => {
  const { openArticle } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', 'CAFÉ CULTURE', 'DEEP DIVE', 'FOOD & TASTE', 'LIFESTYLE'];

  const filteredArticles = activeFilter === 'all'
    ? JOURNAL_ARTICLES
    : JOURNAL_ARTICLES.filter((a) => a.category === activeFilter);

  return (
    <section id="journal" className="py-20 lg:py-24 bg-[#F5EFE6] border-t border-[#1D1916]/10 relative overflow-hidden scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-block px-3.5 py-1 rounded-full border border-[#8FAF78] text-[#8FAF78] font-['League_Spartan'] font-bold text-xs uppercase tracking-wider mb-3">
              JOURNAL
            </div>

            <h2 className="font-['League_Spartan'] font-black text-4xl sm:text-5xl text-[#1D1916] tracking-[-0.04em] uppercase leading-[0.88]">
              ESSAYS, RANTS &<br />
              BAD ADVICE.
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-space font-bold uppercase transition-all shrink-0 border-2 border-[#1D1916] ${
                  activeFilter === cat
                    ? 'bg-[#1D1916] text-[#F6F0E6] shadow-brutal'
                    : 'bg-[#F6F0E6] text-[#1D1916] hover:bg-[#EDE4D5]'
                }`}
              >
                {cat === 'all' ? 'All Stories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Editorial Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredArticles.map((article, idx) => {
            const rotations = ['rotate-[-1deg]', 'rotate-[1.5deg]', 'rotate-[-1.5deg]', 'rotate-[1deg]'];
            const rotation = rotations[idx % rotations.length];

            return (
              <article
                key={article.id}
                onClick={() => openArticle(article)}
                className={`polaroid-frame p-4 bg-[#FDFAF5] rounded-2xl ${rotation} group cursor-pointer flex flex-col justify-between transition-all duration-300 relative`}
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#EDE4D5] relative border-2 border-[#1D1916]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#1D1916] text-[#F6F0E6] text-[10px] font-syne font-bold uppercase px-2.5 py-0.5 rounded border border-white/20">
                      {article.category}
                    </div>
                  </div>

                  {/* Article Metadata & Headline */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-[11px] font-space text-[#5A5048] mb-2">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-syne font-extrabold text-lg sm:text-xl text-[#1D1916] uppercase leading-snug group-hover:text-[#D94A45] transition-colors">
                      {article.title}
                    </h3>

                    <p className="mt-2 font-sans text-xs text-[#5A5048] line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-4 mt-4 border-t border-[#1D1916]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#1D1916]"
                    />
                    <span className="font-space font-bold text-[11px] text-[#1D1916]">
                      {article.author.name}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-space font-bold text-[#1D1916] group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight className="w-3.5 h-3.5 text-[#D94A45]" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <span className="font-handwritten text-xl text-[#5A5048] font-bold">
            want to submit a guest piece? email editorial@thelittlecup.cafe ✍️
          </span>
        </div>

      </div>
    </section>
  );
};
