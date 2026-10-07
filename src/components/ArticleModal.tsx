import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Clock, Calendar, Heart, Share2, BookOpen } from 'lucide-react';

export const ArticleModal: React.FC = () => {
  const { activeArticle, closeArticle, showToast } = useCart();
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!activeArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeArticle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle, closeArticle]);

  if (!activeArticle) return null;

  const currentLikes = (activeArticle.likes || 120) + (hasLiked ? 1 : 0);

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      showToast('Loved this story! ♡', 'Thanks for reading The Little Cup Journal.', 'heart');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! 📋', 'Share with your fellow coffee lovers.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1D1916]/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={activeArticle.title}
    >
      <div
        className="bg-[#F6F0E6] rounded-2xl border-3 border-[#1D1916] shadow-brutal-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#FAF6F0] px-6 py-4 border-b-2 border-[#1D1916] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-syne font-bold uppercase tracking-wider text-[#1D1916]">
            <BookOpen className="w-4 h-4 text-[#8FAF78]" />
            <span>THE LITTLE CUP JOURNAL • ISSUE #14</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] shadow-sm text-[#1D1916] transition-transform active:scale-95"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeArticle}
              className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] shadow-sm text-[#1D1916] transition-transform active:scale-95"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 text-left">
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#8FAF78] text-[#1D1916] font-syne font-bold text-xs uppercase border border-[#1D1916] shadow-brutal">
              {activeArticle.category}
            </span>
            <div className="flex items-center gap-2 text-xs font-space text-[#5A5048]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeArticle.date}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{activeArticle.readTime}</span>
            </div>
          </div>

          {/* Article Title */}
          <h1 className="font-syne font-black text-3xl sm:text-5xl text-[#1D1916] tracking-tight leading-[1.05]">
            {activeArticle.title}
          </h1>

          {/* Author Byline */}
          <div className="flex items-center gap-3 py-3 border-y border-[#1D1916]/15">
            <img
              src={activeArticle.author.avatar}
              alt={activeArticle.author.name}
              className="w-10 h-10 rounded-full object-cover border border-[#1D1916]"
            />
            <div>
              <p className="font-space font-bold text-xs sm:text-sm text-[#1D1916]">
                Written by {activeArticle.author.name}
              </p>
              <p className="text-[11px] font-sans text-[#5A5048]">
                {activeArticle.author.role}
              </p>
            </div>
          </div>

          {/* Featured Image in Polaroid Frame */}
          <div className="polaroid-frame p-3 bg-[#FAF6F0] rounded-xl tape-effect">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-72 sm:h-96 object-cover rounded-lg border border-[#1D1916]"
            />
          </div>

          {/* Excerpt Pull Quote */}
          <div className="p-5 rounded-xl bg-[#FAF6F0] border-l-4 border-[#D94A45] border-y border-r border-[#1D1916]/20">
            <p className="font-syne font-bold text-lg text-[#1D1916] italic leading-snug">
              “{activeArticle.excerpt}”
            </p>
          </div>

          {/* Article Paragraphs */}
          <div className="space-y-5 text-base sm:text-lg text-[#2E2722] font-sans leading-relaxed">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Tags */}
          <div className="pt-6 border-t border-[#1D1916]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {activeArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#EDE4D5] text-[#1D1916] text-xs font-space font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Like Reaction Button */}
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#1D1916] font-space font-bold text-xs transition-all shadow-brutal active:scale-95 ${
                hasLiked
                  ? 'bg-[#FCEBEA] text-[#D94A45] border-[#D94A45]'
                  : 'bg-[#FAF6F0] text-[#1D1916] hover:bg-[#FCEBEA]'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{currentLikes} claps & hearts</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF6F0] border-t-2 border-[#1D1916] flex items-center justify-between">
          <span className="font-handwritten text-lg text-[#5A5048] font-bold">
            written over an iced latte at table 4 ☕
          </span>
          <button
            onClick={closeArticle}
            className="px-5 py-2 rounded-xl bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs"
          >
            Done Reading
          </button>
        </div>

      </div>
    </div>
  );
};
