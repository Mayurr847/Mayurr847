import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Heart, Plus, Search, ShoppingBag } from 'lucide-react';
import { MENU_ITEMS } from '../data/cafeData';

export const FullMenuSection: React.FC = () => {
  const { addToCart, toggleFavorite, isFavorite, openCustomizeModal, cartCount, openCart } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'coffee', label: 'Coffee ☕' },
    { id: 'matcha', label: 'Matcha 🌿' },
    { id: 'specials', label: 'Specials ✨' },
    { id: 'pastries', label: 'Pastries 🥐' },
    { id: 'favorites', label: 'Saved ♥' },
  ];

  const dietaryFilters = ['all', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Contains Nuts'];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!isFavorite(item.id)) return false;
      } else if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (selectedDietary !== 'all') {
        if (!item.dietary?.includes(selectedDietary)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedDietary, isFavorite]);

  return (
    <section id="menu" className="py-20 lg:py-28 relative bg-[#F7F2E9] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-4 py-1 rounded-full border border-[#8FAF78] text-[#8FAF78] font-space font-bold text-xs uppercase tracking-wider mb-4">
            FULL SPREAD
          </div>

          <h2 className="font-syne font-black text-4xl sm:text-6xl text-[#1D1916] tracking-tight uppercase">
            THE MENU.
          </h2>
          <p className="mt-4 font-sans text-sm sm:text-base text-[#1D1916]/80">
            Everything is pulled fresh, whisked to order, or baked this morning with organic ingredients.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-12">
          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 rounded-full font-space font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#EED89F] text-[#1D1916] shadow-sm'
                      : 'bg-white/80 text-[#1D1916] hover:bg-white border border-[#1D1916]/10'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Dietary Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-[#1D1916]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drinks or pastries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-sans bg-white border border-[#1D1916]/15 rounded-full focus:outline-none shadow-sm placeholder:text-[#1D1916]/50"
              />
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              <span className="text-[11px] font-space font-bold text-[#1D1916]/60 uppercase shrink-0 mr-1 hidden sm:inline">
                Dietary:
              </span>
              {dietaryFilters.map((diet) => (
                <button
                  key={diet}
                  onClick={() => setSelectedDietary(diet)}
                  className={`px-3 py-1 rounded-full text-[11px] font-space font-semibold transition-all shrink-0 ${
                    selectedDietary === diet
                      ? 'bg-[#8FAF78] text-[#1D1916] font-bold shadow-sm'
                      : 'bg-white/80 text-[#1D1916]/70 border border-[#1D1916]/10 hover:bg-white'
                  }`}
                >
                  {diet === 'all' ? 'All Diets' : diet}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF6F0] rounded-2xl border-2 border-[#1D1916] shadow-brutal p-8">
            <p className="font-handwritten text-3xl text-[#1D1916] font-bold">
              Nothing found in this filter! ☕
            </p>
            <p className="font-sans text-xs text-[#5A5048] mt-2">
              Try changing your search term or category.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedDietary('all');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2 rounded-full bg-[#1D1916] text-[#F6F0E6] font-space text-xs font-bold shadow-brutal"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => {
              const isFav = isFavorite(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left group"
                >
                  <div>
                    {/* Image frame */}
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#EDE4D5] relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge */}
                      {item.badge && (
                        <span
                          className={`absolute top-2.5 left-2.5 text-[10px] font-syne font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs ${
                            item.badgeColor === 'matcha'
                              ? 'bg-[#8FAF78] text-[#1D1916]'
                              : item.badgeColor === 'cherry'
                              ? 'bg-[#D94A45] text-white'
                              : 'bg-[#F4D35E] text-[#1D1916]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Heart Button */}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                        aria-label="Toggle favorite"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'text-[#D94A45] fill-current' : 'text-[#1D1916]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Item Details */}
                    <div className="pt-3 pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-syne font-bold text-base text-[#1D1916] uppercase group-hover:text-[#8FAF78] transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-[10px] font-space font-semibold uppercase text-[#8FAF78]">
                            {item.category}
                          </span>
                        </div>
                        <span className="font-space font-extrabold text-sm text-[#1D1916] shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="mt-1 font-sans text-xs text-[#1D1916]/70 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Dietary tags */}
                      {item.dietary && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.dietary.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-space px-2 py-0.5 rounded-full bg-[#F7F2E9] text-[#1D1916]/80 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#1D1916]/10 flex items-center gap-2 mt-2">
                    {item.customizable !== false ? (
                      <button
                        onClick={() => openCustomizeModal(item)}
                        className="flex-1 py-2 px-3 rounded-full bg-[#F7F2E9] hover:bg-[#EDE4D5] text-[#1D1916] font-space font-bold text-xs transition-all"
                      >
                        Customize
                      </button>
                    ) : (
                      <span className="text-[11px] font-handwritten text-[#1D1916]/60 flex-1 text-center font-bold">
                        barista standard
                      </span>
                    )}

                    <button
                      onClick={() => addToCart(item)}
                      className="py-2 px-4 rounded-full bg-[#EFC958] hover:bg-[#E5BC44] text-[#1D1916] font-space font-bold text-xs shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Quick Cart Bar (on Mobile / Sticky when items exist) */}
        {cartCount > 0 && (
          <div className="sticky bottom-6 mt-8 z-30 flex justify-center animate-bounce-short">
            <button
              onClick={openCart}
              className="bg-[#1D1916] text-[#F6F0E6] px-6 py-3.5 rounded-full border-2 border-[#1D1916] shadow-brutal-lg flex items-center gap-4 hover:bg-[#2E2722] transition-all hover:scale-102"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#F4D35E]" />
                <span className="font-space font-bold text-sm">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in Bag
                </span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <span className="font-syne font-bold text-xs text-[#F4D35E] uppercase tracking-wider flex items-center gap-1">
                View Order →
              </span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
