import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Heart, ShoppingBag, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short pointer-events-none">
      <div className="bg-[#1D1916] text-[#F6F0E6] border-2 border-[#1D1916] shadow-brutal-lg px-5 py-3.5 rounded-lg flex items-center gap-3.5 max-w-md pointer-events-auto">
        <div className="shrink-0">
          {toast.type === 'heart' && (
            <div className="w-8 h-8 rounded-full bg-[#D94A45] flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          )}
          {toast.type === 'cart' && (
            <div className="w-8 h-8 rounded-full bg-[#8FAF78] flex items-center justify-center text-[#1D1916]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'success' && (
            <div className="w-8 h-8 rounded-full bg-[#F4D35E] flex items-center justify-center text-[#1D1916]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-8 h-8 rounded-full bg-[#EDE4D5] flex items-center justify-center text-[#1D1916]">
              <Info className="w-4 h-4" />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-syne font-bold text-sm text-[#F6F0E6] tracking-tight">{toast.title}</h4>
          {toast.message && (
            <p className="font-sans text-xs text-[#E2D5C0] mt-0.5">{toast.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
