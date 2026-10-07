import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Clock, RotateCcw, Utensils, ArrowRight } from 'lucide-react';
import type { CafeOrder } from '../types/order';

export const MyOrdersModal: React.FC = () => {
  const {
    isMyOrdersOpen,
    closeMyOrders,
    customerOrders,
    trackOrder,
    reorder,
    openCart,
  } = useCart();

  useEffect(() => {
    if (!isMyOrdersOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMyOrders();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMyOrdersOpen, closeMyOrders]);

  if (!isMyOrdersOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1D1916]/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="My Café Orders"
    >
      <div
        className="bg-[#F6F0E6] rounded-2xl border-3 border-[#1D1916] shadow-brutal-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF6F0] p-5 border-b-2 border-[#1D1916] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1D1916] text-[#F4D35E] flex items-center justify-center font-bold text-base shadow-brutal">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-syne font-black text-xl text-[#1D1916] uppercase">
                MY ORDERS & HISTORY
              </h3>
              <span className="font-space text-xs text-[#5A5048]">
                {customerOrders.length} {customerOrders.length === 1 ? 'order' : 'orders'} placed
              </span>
            </div>
          </div>

          <button
            onClick={closeMyOrders}
            className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] shadow-sm text-[#1D1916] transition-transform active:scale-95"
            aria-label="Close My Orders"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {customerOrders.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#EDE4D5] border-2 border-[#1D1916] shadow-brutal flex items-center justify-center text-3xl mb-4">
                ☕
              </div>
              <h4 className="font-syne font-bold text-xl text-[#1D1916] uppercase">
                No orders yet!
              </h4>
              <p className="font-sans text-xs text-[#5A5048] mt-2 max-w-xs leading-relaxed">
                Treat yourself to an iced matcha latte, fresh espresso, or warm bakery croissant.
              </p>
              <button
                onClick={() => {
                  closeMyOrders();
                  openCart();
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs uppercase tracking-wider shadow-brutal hover:bg-[#2E2722]"
              >
                Browse Menu →
              </button>
            </div>
          ) : (
            customerOrders.map((order: CafeOrder) => {
              const isActive =
                order.orderStatus === 'new' ||
                order.orderStatus === 'confirmed' ||
                order.orderStatus === 'preparing' ||
                order.orderStatus === 'delayed' ||
                order.orderStatus === 'ready';

              const isDineIn = order.orderType === 'dine_in';

              return (
                <div
                  key={order.orderId}
                  className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal space-y-3"
                >
                  {/* Top card bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D1916]/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-syne font-black text-base text-[#1D1916]">
                        Order #{order.orderId}
                      </span>
                      <span
                        className={`text-[10px] font-syne font-bold uppercase px-2 py-0.5 rounded-full border ${
                          order.orderStatus === 'ready'
                            ? 'bg-[#8FAF78] text-[#1D1916] border-[#1D1916]'
                            : order.orderStatus === 'preparing' || order.orderStatus === 'delayed'
                            ? 'bg-[#F4D35E] text-[#1D1916] border-[#1D1916]'
                            : order.orderStatus === 'completed'
                            ? 'bg-[#EDE4D5] text-[#1D1916] border-[#1D1916]/30'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-[#FCEBEA] text-[#D94A45] border-[#D94A45]'
                            : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]'
                        }`}
                      >
                        {order.orderStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-space text-[#5A5048]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Mode & Table Info */}
                  <div className="flex items-center justify-between text-xs font-space">
                    <span className="flex items-center gap-1 font-bold text-[#1D1916]">
                      {isDineIn ? (
                        <>
                          <Utensils className="w-3.5 h-3.5 text-[#8FAF78]" />
                          <span>Dine-In • {order.tableNumber || 'Table'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#EFC958]" />
                          <span>Pickup Counter</span>
                        </>
                      )}
                    </span>
                    <span className="text-[#5A5048]">
                      {isDineIn ? `Serving: ${order.servingTime || 'ASAP'}` : `Pickup: ${order.pickupTime || 'ASAP'}`}
                    </span>
                  </div>

                  {/* Items breakdown snippet */}
                  <div className="text-xs font-space text-[#5A5048] space-y-1 bg-[#F6F0E6] p-2.5 rounded-lg border border-[#1D1916]/10">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.quantity}× {item.menuItem.name} {item.options?.milk && `(${item.options.milk})`}
                        </span>
                        <span className="font-bold text-[#1D1916]">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card bottom actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-syne font-black text-sm text-[#1D1916]">
                      Total: <span className="text-[#D94A45]">${order.total.toFixed(2)}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => reorder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] text-xs font-space font-bold transition-all"
                        title="Reorder these items"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#8FAF78]" />
                        <span>Reorder</span>
                      </button>

                      {isActive && (
                        <button
                          type="button"
                          onClick={() => trackOrder(order.orderId)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#1D1916] text-[#F6F0E6] hover:bg-[#2E2722] text-xs font-space font-bold shadow-xs transition-all"
                        >
                          <span>Live Track</span>
                          <ArrowRight className="w-3 h-3 text-[#F4D35E]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF6F0] border-t-2 border-[#1D1916] flex items-center justify-between text-xs font-space">
          <span className="text-[#5A5048]">
            Need help with an order? Call us at (082380 00335)
          </span>
          <button
            onClick={closeMyOrders}
            className="px-4 py-2 rounded-xl bg-[#1D1916] text-[#F6F0E6] font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersModal;
