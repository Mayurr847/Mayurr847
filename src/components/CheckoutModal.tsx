import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Clock, CreditCard, User, Sparkles, Utensils, ShoppingBag, Truck, MapPin } from 'lucide-react';
import type { OrderType, PaymentMethod } from '../types/order';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, cart, cartSubtotal, cartTax, cartTotal, placeOrder, cafeSettings } = useCart();

  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState('Table 04');
  const [customTable, setCustomTable] = useState('');
  const [servingTime, setServingTime] = useState(`ASAP (~${cafeSettings.estimatedPrepMinutes || 15} mins)`);
  const [pickupTime, setPickupTime] = useState(`ASAP (~${cafeSettings.estimatedPrepMinutes || 15} mins)`);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; table?: string }>({});

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, closeCheckout]);

  if (!isCheckoutOpen) return null;

  const quickTables = ['Table 01', 'Table 02', 'Table 03', 'Table 04', 'Table 05', 'Table 06', 'Table 07', 'Table 08', 'Bar Stool A', 'Bar Stool B'];

  const dineInServingOptions = [
    `ASAP (~${cafeSettings.estimatedPrepMinutes || 15} mins)`,
    'In 10 minutes',
    'In 15 minutes',
    'In 20 minutes',
    'In 30 minutes',
  ];

  const pickupTimeOptions = [
    `ASAP (~${cafeSettings.estimatedPrepMinutes || 15} mins)`,
    'In 15 minutes',
    'In 20 minutes',
    'In 30 minutes',
    'In 45 minutes',
    'In 1 hour',
  ];

  const validate = () => {
    const errs: { name?: string; email?: string; phone?: string; table?: string } = {};
    if (!name.trim()) errs.name = 'Please provide your name for the order';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Please provide a valid email for your digital receipt';
    if (orderType === 'dine_in') {
      const selectedTable = customTable.trim() || tableNumber;
      if (!selectedTable) {
        errs.table = 'Please select or enter your table number';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submission
    if (!validate()) return;

    setIsSubmitting(true);
    const resolvedTable = customTable.trim() || tableNumber;

    setTimeout(() => {
      try {
        placeOrder({
          orderType,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          tableNumber: orderType === 'dine_in' ? resolvedTable : undefined,
          servingTime: orderType === 'dine_in' ? servingTime : undefined,
          pickupTime: orderType === 'pickup' ? pickupTime : undefined,
          customerNotes: orderNotes.trim() || undefined,
          paymentMethod,
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1D1916]/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="The Little Cup Checkout"
    >
      <div
        className="bg-[#F6F0E6] rounded-2xl border-3 border-[#1D1916] shadow-brutal-xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FAF6F0] p-5 border-b-2 border-[#1D1916] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8FAF78] text-[#1D1916] flex items-center justify-center font-bold text-sm shadow-brutal">
              ☕
            </div>
            <div>
              <h3 className="font-syne font-black text-xl text-[#1D1916] uppercase">
                EXPRESS CAFÉ ORDER
              </h3>
              <span className="font-space text-xs text-[#5A5048]">
                {cart.length} items • Total ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] border border-[#1D1916] shadow-sm text-[#1D1916] transition-transform active:scale-95"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* STEP 1: How would you like your order? */}
          <div className="space-y-3">
            <h4 className="font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] flex items-center justify-between">
              <span>1. How would you like your order?</span>
              <span className="text-[10px] font-space font-normal text-[#8FAF78] font-bold">Select service type</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option A: DINE-IN */}
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                  orderType === 'dine_in'
                    ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916] shadow-brutal'
                    : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#8FAF78]/20 flex items-center justify-center">
                  <Utensils className={`w-4 h-4 ${orderType === 'dine_in' ? 'text-[#F4D35E]' : 'text-[#1D1916]'}`} />
                </div>
                <span className="font-syne font-extrabold text-xs uppercase">☕ Dine-In</span>
                <span className={`text-[10px] font-space ${orderType === 'dine_in' ? 'text-white/80' : 'text-[#5A5048]'}`}>
                  Served at table
                </span>
              </button>

              {/* Option B: PICKUP */}
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                  orderType === 'pickup'
                    ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916] shadow-brutal'
                    : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#F4D35E]/20 flex items-center justify-center">
                  <ShoppingBag className={`w-4 h-4 ${orderType === 'pickup' ? 'text-[#F4D35E]' : 'text-[#1D1916]'}`} />
                </div>
                <span className="font-syne font-extrabold text-xs uppercase">🚶 Pickup</span>
                <span className={`text-[10px] font-space ${orderType === 'pickup' ? 'text-white/80' : 'text-[#5A5048]'}`}>
                  Collect at counter
                </span>
              </button>

              {/* Option C: DELIVERY (Disabled - Architecture Ready) */}
              <div
                className="p-3.5 rounded-xl border-2 border-[#1D1916]/15 bg-[#EDE4D5]/40 opacity-60 cursor-not-allowed flex flex-col items-center text-center gap-1.5 select-none relative"
                title="Delivery is not available yet"
              >
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-500">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-syne font-extrabold text-xs uppercase text-[#5A5048]">🛵 Delivery</span>
                <span className="text-[9px] font-space text-[#D94A45] font-bold bg-[#FCEBEA] px-1.5 py-0.5 rounded">
                  Coming Soon
                </span>
              </div>
            </div>

            {/* Notice for delivery */}
            <p className="text-[11px] font-space text-[#5A5048]">
              {orderType === 'dine_in' && '☕ We will prepare your drinks and bring them fresh to your seated table.'}
              {orderType === 'pickup' && '🚶 Grab & Go: pick up straight from the barista bar without waiting in queue.'}
            </p>
          </div>

          {/* STEP 2: Configure Service Mode (Table # or Pickup Location) */}
          {orderType === 'dine_in' ? (
            <div className="p-4 rounded-xl bg-[#FDFAF5] border-2 border-[#1D1916] shadow-brutal space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-syne font-bold text-xs uppercase text-[#1D1916]">
                  Where are you sitting? *
                </span>
                <span className="font-handwritten text-sm text-[#8FAF78] font-bold">
                  table service ready
                </span>
              </div>

              {/* Table selection chips */}
              <div className="flex flex-wrap gap-1.5">
                {quickTables.map((tbl) => (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => {
                      setTableNumber(tbl);
                      setCustomTable('');
                      if (errors.table) setErrors((prev) => ({ ...prev, table: undefined }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-space font-semibold border-2 transition-all ${
                      tableNumber === tbl && !customTable
                        ? 'bg-[#8FAF78] text-[#1D1916] border-[#1D1916] shadow-sm font-bold'
                        : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/20 hover:border-[#1D1916]'
                    }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Or type custom table (e.g. Patio Table 4, Corner Couch)..."
                  value={customTable}
                  onChange={(e) => {
                    setCustomTable(e.target.value);
                    if (errors.table) setErrors((prev) => ({ ...prev, table: undefined }));
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border-2 border-[#1D1916] rounded-lg font-sans focus:outline-none"
                />
              </div>

              {errors.table && (
                <p className="text-[10px] text-[#D94A45] font-space font-bold">{errors.table}</p>
              )}

              {/* Desired Serving Time for Dine-in */}
              <div className="pt-2 border-t border-[#1D1916]/15 space-y-2">
                <label className="block font-syne font-bold text-[11px] uppercase tracking-wider text-[#1D1916]">
                  Desired Serving Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {dineInServingOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setServingTime(opt)}
                      className={`p-2 text-[11px] font-space font-semibold rounded-lg border-2 text-left transition-all ${
                        servingTime === opt
                          ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916] shadow-sm'
                          : 'bg-white text-[#1D1916] border-[#1D1916]/20 hover:border-[#1D1916]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#FDFAF5] border-2 border-[#1D1916] shadow-brutal space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-syne font-bold text-xs uppercase text-[#1D1916] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D94A45]" />
                    <span>Pickup Location:</span>
                  </span>
                  <p className="text-xs font-sans text-[#2E2722] mt-0.5">
                    The Little Cup • Iscon Cross Roads, SG Hwy, Ahmedabad
                  </p>
                </div>
                <span className="font-handwritten text-sm text-[#EFC958] font-bold shrink-0">
                  ready at counter
                </span>
              </div>

              {/* Desired Pickup Time for Pickup */}
              <div className="pt-2 border-t border-[#1D1916]/15 space-y-2">
                <label className="block font-syne font-bold text-[11px] uppercase tracking-wider text-[#1D1916] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8FAF78]" />
                  <span>Desired Pickup Time</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {pickupTimeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPickupTime(opt)}
                      className={`p-2 text-[11px] font-space font-semibold rounded-lg border-2 text-left transition-all ${
                        pickupTime === opt
                          ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916] shadow-sm'
                          : 'bg-white text-[#1D1916] border-[#1D1916]/20 hover:border-[#1D1916]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Details */}
          <div className="space-y-3">
            <h4 className="font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] flex items-center gap-2">
              <User className="w-4 h-4 text-[#D94A45]" />
              <span>2. Contact Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-space font-semibold text-[#1D1916] mb-1">
                  Name for the Cup *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-xs bg-[#FAF6F0] border-2 rounded-xl font-sans focus:bg-white focus:outline-none ${
                    errors.name ? 'border-[#D94A45]' : 'border-[#1D1916]'
                  }`}
                />
                {errors.name && (
                  <p className="text-[10px] text-[#D94A45] font-space font-medium mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-space font-semibold text-[#1D1916] mb-1">
                  Email (for live tracking receipt) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-xs bg-[#FAF6F0] border-2 rounded-xl font-sans focus:bg-white focus:outline-none ${
                    errors.email ? 'border-[#D94A45]' : 'border-[#1D1916]'
                  }`}
                />
                {errors.email && (
                  <p className="text-[10px] text-[#D94A45] font-space font-medium mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-space font-semibold text-[#1D1916] mb-1">
                Phone Number (for SMS & ready alert)
              </label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border-2 border-[#1D1916] rounded-xl font-sans focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 4: Payment Simulation */}
          <div className="space-y-3">
            <h4 className="font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#F4D35E]" />
              <span>3. Payment Method</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-2.5 text-xs font-space font-semibold rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916] shadow-brutal'
                    : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                }`}
              >
                <span> Apple / GPay</span>
                <span className="text-[10px] opacity-70">1-Touch</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 text-xs font-space font-semibold rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916] shadow-brutal'
                    : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                }`}
              >
                <span>Credit Card</span>
                <span className="text-[10px] opacity-70">Online</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pickup')}
                className={`p-2.5 text-xs font-space font-semibold rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  paymentMethod === 'pickup'
                    ? 'bg-[#8FAF78] text-[#1D1916] border-[#1D1916] shadow-brutal'
                    : 'bg-[#FAF6F0] text-[#1D1916] border-[#1D1916]/30 hover:border-[#1D1916]'
                }`}
              >
                <span>Pay at Café</span>
                <span className="text-[10px] opacity-70">Cash / UPI</span>
              </button>
            </div>
          </div>

          {/* STEP 5: Special Barista Notes */}
          <div>
            <label className="block text-[11px] font-space font-semibold text-[#1D1916] mb-1">
              Any special notes or dietary requirements?
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Extra hot, please bring drinks together, allergic to hazelnuts..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border-2 border-[#1D1916] rounded-xl font-sans focus:bg-white focus:outline-none"
            />
          </div>

          {/* Summary Breakdown */}
          <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] space-y-1.5 text-xs font-space">
            <div className="flex justify-between text-[#5A5048]">
              <span>Items Subtotal ({cart.length} items)</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#5A5048]">
              <span>Taxes & Café Fees (8.875%)</span>
              <span>${cartTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-syne font-black text-sm text-[#1D1916] pt-1.5 border-t border-[#1D1916]/15">
              <span>ORDER TOTAL</span>
              <span className="text-base text-[#D94A45]">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button with duplicate click guard */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1D1916] hover:bg-[#2E2722] disabled:opacity-75 text-[#F6F0E6] font-space font-bold text-base py-4 rounded-xl border-2 border-[#1D1916] shadow-brutal hover:shadow-brutal-lg flex items-center justify-center gap-3 transition-all active:translate-y-0.5"
          >
            {isSubmitting ? (
              <span>Brewing your order ticket...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F4D35E]" />
                <span>
                  Place {orderType === 'dine_in' ? 'Dine-In' : 'Pickup'} Order (${cartTotal.toFixed(2)}) →
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
