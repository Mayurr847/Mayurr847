import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartTax,
    cartTotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCheckout,
  } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1D1916]/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F6F0E6] border-l-3 border-[#1D1916] shadow-brutal-xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 bg-[#FAF6F0] border-b-2 border-[#1D1916] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1D1916] text-[#F4D35E] flex items-center justify-center font-bold text-base shadow-brutal">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-syne font-black text-xl text-[#1D1916] uppercase tracking-tight">
                  YOUR ORDER
                </h3>
                <span className="font-handwritten text-sm text-[#8FAF78] font-bold">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-space font-semibold text-[#5A5048] hover:text-[#D94A45] p-1.5 transition-colors"
                  title="Clear Cart"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] shadow-sm text-[#1D1916] transition-transform active:scale-95"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body: Cart Items List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#EDE4D5] border-2 border-[#1D1916] shadow-brutal flex items-center justify-center text-3xl mb-4">
                  ☕
                </div>
                <h4 className="font-syne font-bold text-xl text-[#1D1916] uppercase">
                  Your cup is empty!
                </h4>
                <p className="font-sans text-xs text-[#5A5048] mt-2 max-w-xs leading-relaxed">
                  Head back to the menu and treat yourself to an iced matcha latte or warm banana bread.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs uppercase tracking-wider shadow-brutal hover:bg-[#2E2722]"
                >
                  Explore Drinks →
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartId}
                  className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal flex gap-3.5 relative group"
                >
                  {/* Item Image */}
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-lg object-cover border border-[#1D1916] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-syne font-bold text-sm text-[#1D1916] uppercase truncate">
                        {item.menuItem.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-[#5A5048] hover:text-[#D94A45] p-1 transition-colors"
                        aria-label={`Remove ${item.menuItem.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Options summary */}
                    <div className="text-[11px] text-[#5A5048] font-sans space-y-0.5 mt-1">
                      {item.options?.temperature && (
                        <p>• {item.options.temperature}</p>
                      )}
                      {item.options?.milk && (
                        <p>• {item.options.milk}</p>
                      )}
                      {item.options?.sweetness && item.options.sweetness !== 'Regular Sweet (100%)' && (
                        <p>• {item.options.sweetness}</p>
                      )}
                      {item.options?.extras && item.options.extras.length > 0 && (
                        <p className="text-[#D94A45]">• +{item.options.extras.join(', ')}</p>
                      )}
                      {item.options?.specialInstructions && (
                        <p className="italic text-[10px] text-[#8FAF78]">
                          "{item.options.specialInstructions}"
                        </p>
                      )}
                    </div>

                    {/* Quantity + Price */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1D1916]/10">
                      <div className="flex items-center bg-[#F6F0E6] border border-[#1D1916] rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="p-1 px-2 text-xs hover:bg-[#EDE4D5] rounded-l"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-space font-bold text-xs text-[#1D1916]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="p-1 px-2 text-xs hover:bg-[#EDE4D5] rounded-r"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-space font-bold text-sm text-[#1D1916]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FAF6F0] border-t-2 border-[#1D1916] space-y-4">
              <div className="space-y-1.5 text-xs font-space">
                <div className="flex justify-between text-[#5A5048]">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5A5048]">
                  <span>Estimated Tax (8.875%)</span>
                  <span>${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-syne font-black text-base text-[#1D1916] pt-2 border-t border-[#1D1916]/20">
                  <span>TOTAL</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full bg-[#1D1916] hover:bg-[#2E2722] text-[#F6F0E6] font-space font-bold text-base py-4 rounded-xl border-2 border-[#1D1916] shadow-brutal hover:shadow-brutal-lg flex items-center justify-center gap-3 transition-all active:translate-y-0.5"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#F4D35E]" />
              </button>

              <p className="text-[11px] text-center font-handwritten text-[#5A5048] font-bold">
                ☕ Pick up fresh at 123 Coffee Street within 15 mins
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
