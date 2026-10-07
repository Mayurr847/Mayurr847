import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Check, Heart } from 'lucide-react';
import { MILK_OPTIONS, SWEETNESS_OPTIONS, TEMP_OPTIONS, EXTRA_OPTIONS } from '../data/cafeData';
import type { MenuItem } from '../data/cafeData';

interface DrinkCustomizeDialogProps {
  item: MenuItem;
  onClose: () => void;
}

const DrinkCustomizeDialog: React.FC<DrinkCustomizeDialogProps> = ({ item, onClose }) => {
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const [selectedMilk, setSelectedMilk] = useState(MILK_OPTIONS[0].label);
  const [selectedSweetness, setSelectedSweetness] = useState(SWEETNESS_OPTIONS[0]);
  const [selectedTemp, setSelectedTemp] = useState(TEMP_OPTIONS[0]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isCustomizable = item.customizable !== false;
  const isFav = isFavorite(item.id);

  // Calculate dynamic extra cost
  let extraCost = 0;
  if (selectedMilk.includes('Almond') || selectedMilk.includes('Coconut')) extraCost += 0.75;
  if (selectedMilk.includes('Pistachio')) extraCost += 1.00;
  selectedExtras.forEach((extra) => {
    if (extra.includes('Shot')) extraCost += 1.25;
    if (extra.includes('Cold Foam')) extraCost += 1.50;
    if (extra.includes('Vanilla') || extra.includes('Lavender')) extraCost += 0.75;
    if (extra.includes('Whipped')) extraCost += 0.50;
  });

  const unitPrice = item.price + extraCost;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extraLabel: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraLabel)
        ? prev.filter((i) => i !== extraLabel)
        : [...prev, extraLabel]
    );
  };

  const handleAdd = () => {
    addToCart(
      item,
      {
        milk: isCustomizable ? selectedMilk : undefined,
        sweetness: isCustomizable ? selectedSweetness : undefined,
        temperature: isCustomizable ? selectedTemp : undefined,
        extras: isCustomizable && selectedExtras.length > 0 ? selectedExtras : undefined,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      quantity
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1D1916]/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${item.name}`}
    >
      <div
        className="bg-[#F6F0E6] rounded-2xl border-3 border-[#1D1916] shadow-brutal-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image preview */}
        <div className="relative bg-[#FAF6F0] p-5 border-b-2 border-[#1D1916] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-[#1D1916] shadow-brutal shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-syne font-black uppercase px-2 py-0.5 rounded bg-[#8FAF78] text-[#1D1916] border border-[#1D1916]">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-syne font-black uppercase px-2 py-0.5 rounded bg-[#F4D35E] text-[#1D1916] border border-[#1D1916]">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="font-syne font-black text-xl text-[#1D1916] uppercase mt-1">
                {item.name}
              </h3>
              <p className="font-space font-extrabold text-sm text-[#D94A45]">
                ${unitPrice.toFixed(2)} each
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(item.id)}
              className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#FCEBEA] border border-[#1D1916] shadow-sm transition-transform active:scale-95"
              aria-label="Save to favorites"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFav ? 'text-[#D94A45] fill-current' : 'text-[#1D1916]'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] shadow-sm text-[#1D1916] transition-transform active:scale-95"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          <p className="font-sans text-xs text-[#5A5048] leading-relaxed">
            {item.description}
          </p>

          {isCustomizable ? (
            <>
              {/* Temperature / Ice */}
              <div>
                <label className="block font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] mb-2.5">
                  1. Temperature & Ice
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TEMP_OPTIONS.map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setSelectedTemp(temp)}
                      className={`p-2.5 text-xs font-space font-semibold rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                        selectedTemp === temp
                          ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916] shadow-brutal'
                          : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                      }`}
                    >
                      <span>{temp}</span>
                      {selectedTemp === temp && <Check className="w-3.5 h-3.5 text-[#F4D35E]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Choice */}
              <div>
                <label className="block font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] mb-2.5">
                  2. Milk Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MILK_OPTIONS.map((milk) => (
                    <button
                      key={milk.label}
                      type="button"
                      onClick={() => setSelectedMilk(milk.label)}
                      className={`p-2.5 text-xs font-space font-semibold rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                        selectedMilk === milk.label
                          ? 'bg-[#8FAF78] text-[#1D1916] border-[#1D1916] shadow-brutal'
                          : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                      }`}
                    >
                      <span>{milk.label}</span>
                      {milk.price > 0 && (
                        <span className="text-[11px] font-bold text-[#1D1916]/70">
                          +${milk.price.toFixed(2)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <label className="block font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] mb-2.5">
                  3. Sweetness Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {SWEETNESS_OPTIONS.map((sweet) => (
                    <button
                      key={sweet}
                      type="button"
                      onClick={() => setSelectedSweetness(sweet)}
                      className={`px-3 py-1.5 text-xs font-space font-semibold rounded-lg border-2 transition-all ${
                        selectedSweetness === sweet
                          ? 'bg-[#F4D35E] text-[#1D1916] border-[#1D1916] shadow-brutal'
                          : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                      }`}
                    >
                      {sweet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons & Extras */}
              <div>
                <label className="block font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] mb-2.5">
                  4. Extra Goodies (Optional)
                </label>
                <div className="space-y-2">
                  {EXTRA_OPTIONS.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.label);
                    return (
                      <button
                        key={extra.label}
                        type="button"
                        onClick={() => toggleExtra(extra.label)}
                        className={`w-full p-2.5 text-xs font-space font-semibold rounded-xl border-2 transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FCEBEA] text-[#1D1916] border-[#D94A45] shadow-brutal'
                            : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#D94A45] border-[#D94A45] text-white'
                                : 'border-[#1D1916]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                          <span>{extra.label}</span>
                        </div>
                        <span className="font-bold text-[#D94A45]">
                          +${extra.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] text-xs text-[#5A5048]">
              ✨ This artisanal item is crafted according to our head barista’s exact recipe for peak freshness.
            </div>
          )}

          {/* Barista Notes */}
          <div>
            <label className="block font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] mb-1.5">
              Special Notes for Barista
            </label>
            <input
              type="text"
              placeholder="e.g. Extra hot, splash of cinnamon, oat foam on side..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border-2 border-[#1D1916] rounded-xl font-sans focus:bg-white focus:outline-none shadow-sm"
              maxLength={120}
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-5 bg-[#FAF6F0] border-t-2 border-[#1D1916] flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center bg-[#F6F0E6] border-2 border-[#1D1916] rounded-xl shadow-brutal">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2.5 text-[#1D1916] hover:bg-[#EDE4D5] rounded-l-lg focus:outline-none"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-space font-extrabold text-sm text-[#1D1916]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2.5 text-[#1D1916] hover:bg-[#EDE4D5] rounded-r-lg focus:outline-none"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#1D1916] hover:bg-[#2E2722] text-[#F6F0E6] font-space font-bold text-sm sm:text-base py-3 px-6 rounded-xl border-2 border-[#1D1916] shadow-brutal hover:shadow-brutal-lg flex items-center justify-between transition-all active:translate-y-0.5"
          >
            <span>Add to Order</span>
            <span className="text-[#F4D35E]">${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DrinkCustomizeModal: React.FC = () => {
  const { customizingItem, closeCustomizeModal } = useCart();

  useEffect(() => {
    if (!customizingItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCustomizeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customizingItem, closeCustomizeModal]);

  if (!customizingItem) return null;

  return (
    <DrinkCustomizeDialog
      key={customizingItem.id}
      item={customizingItem}
      onClose={closeCustomizeModal}
    />
  );
};
