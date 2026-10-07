import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Award, Disc3, Users } from 'lucide-react';

export const StoryModal: React.FC = () => {
  const { isStoryModalOpen, closeStoryModal } = useCart();

  useEffect(() => {
    if (!isStoryModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStoryModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryModalOpen, closeStoryModal]);

  if (!isStoryModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1D1916]/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="The Little Cup Origin Story"
    >
      <div
        className="bg-[#F6F0E6] rounded-2xl border-3 border-[#1D1916] shadow-brutal-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF6F0] p-6 border-b-2 border-[#1D1916] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8FAF78] text-[#1D1916] flex items-center justify-center font-bold text-base shadow-brutal">
              ☕
            </div>
            <div>
              <h3 className="font-syne font-black text-xl text-[#1D1916] uppercase">
                THE LITTLE CUP ORIGIN STORY
              </h3>
              <span className="font-handwritten text-base text-[#D94A45] font-bold">
                est. 2024 in a tiny garage in Brooklyn
              </span>
            </div>
          </div>

          <button
            onClick={closeStoryModal}
            className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] shadow-sm text-[#1D1916] transition-transform active:scale-95"
            aria-label="Close story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Story */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 text-left">
          {/* Main Headline */}
          <div className="space-y-3">
            <span className="font-syne font-bold text-xs uppercase tracking-widest text-[#8FAF78] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#1D1916] shadow-sm inline-block">
              FOUNDER'S NOTE
            </span>
            <h2 className="font-syne font-black text-3xl sm:text-4xl text-[#1D1916] uppercase leading-tight">
              “WE JUST WANTED A CAFÉ THAT FELT LIKE A WARM HUG INSTEAD OF A TECH OFFICE.”
            </h2>
          </div>

          {/* Photo Collage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="polaroid-frame p-3 bg-[#FAF6F0] rounded-xl rotate-[-2deg]">
              <img
                src="/images/cafe_interior.jpg"
                alt="Café founding days"
                className="w-full h-48 object-cover rounded-lg border border-[#1D1916]"
              />
              <p className="font-handwritten text-base text-[#1D1916] font-bold pt-2 text-center">
                the day we installed the vinyl shelf 🎵
              </p>
            </div>

            <div className="polaroid-frame p-3 bg-[#FAF6F0] rounded-xl rotate-[2deg]">
              <img
                src="/images/hero_matcha.jpg"
                alt="Matcha testing"
                className="w-full h-48 object-cover rounded-lg border border-[#1D1916]"
              />
              <p className="font-handwritten text-base text-[#1D1916] font-bold pt-2 text-center">
                batch #42 of our ceremonial matcha float ✨
              </p>
            </div>
          </div>

          {/* Story Copy */}
          <div className="space-y-4 font-sans text-base sm:text-lg text-[#2E2722] leading-relaxed">
            <p>
              Hey! We’re Maya and Leo. We started The Little Cup in our early twenties after spending way too much time in cafés that made us feel self-conscious about asking for oat milk, caramel syrup, or wanting to sit and draw for two hours without getting side-eyed.
            </p>
            <p>
              We believe specialty coffee should be delicious, ethical, and fun. We work directly with small cooperative coffee farms in Colombia and Ethiopia, and source our first-harvest ceremonial matcha directly from family-run fields in Uji, Kyoto.
            </p>
            <p>
              Most importantly, we built this space for <span className="font-bold underline decoration-[#F4D35E] decoration-wavy">you</span>. Whether you're working on your first screenplay, crying over a breakup, reading a paperback, or catching up with your best friend—our door is open.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1D1916]/15">
            <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal text-center">
              <Award className="w-6 h-6 text-[#8FAF78] mx-auto mb-2" />
              <h4 className="font-syne font-bold text-sm text-[#1D1916] uppercase">No Upcharges</h4>
              <p className="text-xs text-[#5A5048] mt-1 font-sans">Oat milk is a right, not a tax.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal text-center">
              <Disc3 className="w-6 h-6 text-[#D94A45] mx-auto mb-2 animate-spin-slow" />
              <h4 className="font-syne font-bold text-sm text-[#1D1916] uppercase">Curated Sound</h4>
              <p className="text-xs text-[#5A5048] mt-1 font-sans">Handpicked vinyl playlists every day.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal text-center">
              <Users className="w-6 h-6 text-[#F4D35E] mx-auto mb-2" />
              <h4 className="font-syne font-bold text-sm text-[#1D1916] uppercase">Community First</h4>
              <p className="text-xs text-[#5A5048] mt-1 font-sans">Free books, art swaps, and open mic nights.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#FAF6F0] border-t-2 border-[#1D1916] flex items-center justify-between">
          <span className="font-handwritten text-xl text-[#1D1916] font-bold">
            with love, Maya & Leo ♡
          </span>
          <button
            onClick={closeStoryModal}
            className="px-6 py-2.5 rounded-xl bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs shadow-brutal"
          >
            Back to Café
          </button>
        </div>
      </div>
    </div>
  );
};
