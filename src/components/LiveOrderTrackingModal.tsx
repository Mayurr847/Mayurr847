import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Clock, X, Utensils, ShoppingBag, AlertTriangle, MessageCircle } from 'lucide-react';

export const LiveOrderTrackingModal: React.FC = () => {
  const {
    activeOrder,
    isTrackingModalOpen,
    closeTrackingModal,
    dismissOrderNotification,
    cancelOrder,
  } = useCart();

  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');

  // Update clock every second for dynamic timestamp comparison
  useEffect(() => {
    if (!isTrackingModalOpen || !activeOrder) return;
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isTrackingModalOpen, activeOrder]);

  // Escape key handler
  useEffect(() => {
    if (!isTrackingModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCancelConfirm) {
          setShowCancelConfirm(false);
        } else {
          closeTrackingModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrackingModalOpen, showCancelConfirm, closeTrackingModal]);

  if (!isTrackingModalOpen || !activeOrder) return null;

  // Calculate live countdown based on real timestamps
  const targetMs = new Date(activeOrder.estimatedReadyAt).getTime();
  const diffSec = Math.max(0, Math.floor((targetMs - currentTime) / 1000));
  const isTimeExceeded = currentTime > targetMs && (activeOrder.orderStatus === 'preparing' || activeOrder.orderStatus === 'confirmed' || activeOrder.orderStatus === 'new');

  const minutes = Math.floor(diffSec / 60);
  const seconds = diffSec % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const isDineIn = activeOrder.orderType === 'dine_in';
  const isReady = activeOrder.orderStatus === 'ready';
  const isCompleted = activeOrder.orderStatus === 'completed';
  const isCancelled = activeOrder.orderStatus === 'cancelled';
  const isDelayed = isTimeExceeded || activeOrder.orderStatus === 'delayed';

  const canCancel = activeOrder.orderStatus === 'new' || activeOrder.orderStatus === 'confirmed';

  const handleConfirmCancel = () => {
    cancelOrder(activeOrder.orderId, cancelReason);
    setShowCancelConfirm(false);
  };

  const handleDismiss = () => {
    dismissOrderNotification(activeOrder.orderId);
  };

  // Timeline step helper
  const getStepState = (step: 'received' | 'confirmed' | 'preparing' | 'ready' | 'completed') => {
    const orderStatus = activeOrder.orderStatus;
    const steps = ['received', 'confirmed', 'preparing', 'ready', 'completed'];
    const currentIdx =
      orderStatus === 'new'
        ? 0
        : orderStatus === 'confirmed'
        ? 1
        : orderStatus === 'preparing' || orderStatus === 'delayed'
        ? 2
        : orderStatus === 'ready'
        ? 3
        : orderStatus === 'completed'
        ? 4
        : -1;

    const stepIdx = steps.indexOf(step);
    if (orderStatus === 'cancelled') return 'cancelled';
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1D1916]/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Order #${activeOrder.orderId} Live Tracking`}
    >
      <div
        className="bg-[#F6F0E6] rounded-2xl border-3 border-[#1D1916] shadow-brutal-xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with status banner */}
        <div
          className={`p-6 text-center border-b-2 border-[#1D1916] relative ${
            isCancelled
              ? 'bg-[#D94A45] text-white'
              : isReady
              ? 'bg-[#8FAF78] text-[#1D1916]'
              : isDelayed
              ? 'bg-[#F4D35E] text-[#1D1916]'
              : 'bg-[#EDE4D5] text-[#1D1916]'
          }`}
        >
          {/* Dismiss (X) button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FAF6F0] border border-[#1D1916] shadow-sm hover:bg-[#EDE4D5] text-[#1D1916] transition-transform active:scale-95"
            aria-label="Close notification"
            title="Dismiss tracking card"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Service badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#1D1916] shadow-xs text-[11px] font-syne font-bold uppercase tracking-wider mb-2">
            {isDineIn ? (
              <>
                <Utensils className="w-3.5 h-3.5 text-[#8FAF78]" />
                <span>Dine-In • {activeOrder.tableNumber || 'Table Seated'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#EFC958]" />
                <span>Pickup Counter</span>
              </>
            )}
          </div>

          <h3 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight">
            {isCancelled
              ? 'Order Cancelled'
              : isCompleted
              ? 'Order Completed ☕'
              : isReady
              ? '☕ Order is Ready!'
              : isDelayed
              ? 'Running a little behind ⏳'
              : 'Order in Progress ☕'}
          </h3>

          <p className="font-sans font-semibold text-xs sm:text-sm mt-1 opacity-90">
            {isCancelled
              ? activeOrder.cancellationReason || 'This order was cancelled.'
              : isCompleted
              ? 'Enjoy your coffee & have a great day!'
              : isReady
              ? isDineIn
                ? `Our team is bringing your order to ${activeOrder.tableNumber || 'your table'}!`
                : 'Your drinks are ready at the pickup counter!'
              : isDelayed
              ? 'Brewing extra fresh. Thanks for your patience!'
              : isDineIn
              ? `Preparing fresh for ${activeOrder.tableNumber || 'your table'}`
              : 'Baristas are grinding beans & steaming milk'}
          </p>
        </div>

        {/* Scrollable Tracking Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Timer Card / Ready Announcement */}
          {!isCancelled && !isCompleted && (
            <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock
                  className={`w-6 h-6 ${
                    isReady ? 'text-[#8FAF78]' : isDelayed ? 'text-[#D94A45] animate-bounce' : 'text-[#D94A45] animate-pulse'
                  }`}
                />
                <div>
                  <p className="text-[10px] font-space font-bold uppercase text-[#5A5048]">
                    {isReady
                      ? 'Status'
                      : isDelayed
                      ? 'Estimated Ready Time'
                      : isDineIn
                      ? 'Estimated Serving Time'
                      : 'Estimated Pickup Time'}
                  </p>
                  <p className="font-syne font-black text-2xl text-[#1D1916]">
                    {isReady ? (
                      <span className="text-[#8FAF78]">READY NOW</span>
                    ) : isDelayed ? (
                      <span className="text-[#D94A45] text-xl">Almost ready...</span>
                    ) : diffSec < 60 ? (
                      <span className="text-[#D94A45]">Under 1 min</span>
                    ) : (
                      <>
                        {timeFormatted} <span className="text-xs font-sans font-normal text-[#5A5048]">mins</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#EFC958] border border-[#1D1916] text-[10px] font-syne font-bold uppercase shadow-sm">
                  #{activeOrder.orderId}
                </span>
                <p className="text-[10px] font-space text-[#5A5048] mt-1">
                  {isDineIn ? activeOrder.servingTime || 'ASAP' : activeOrder.pickupTime || 'ASAP'}
                </p>
              </div>
            </div>
          )}

          {/* Owner Message Callout (if staff pushed an update) */}
          {activeOrder.customOwnerMessage && (
            <div className="p-3.5 rounded-xl bg-[#FDFAF5] border-2 border-[#8FAF78] shadow-sm flex items-start gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#8FAF78] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-syne font-bold text-[#1D1916] uppercase">
                  Message from Café Barista
                </p>
                <p className="text-xs font-sans text-[#2E2722] mt-0.5">
                  “{activeOrder.customOwnerMessage}”
                </p>
              </div>
            </div>
          )}

          {/* Live Progress Timeline */}
          {!isCancelled && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-space font-bold uppercase text-[#1D1916]">
                <span className={getStepState('received') === 'active' || getStepState('received') === 'done' ? 'text-[#8FAF78]' : 'text-[#5A5048]'}>
                  ✓ Received
                </span>
                <span className={getStepState('confirmed') === 'active' || getStepState('confirmed') === 'done' ? 'text-[#8FAF78]' : 'text-[#5A5048]'}>
                  {getStepState('confirmed') === 'active' ? '● Confirmed' : 'Confirmed'}
                </span>
                <span className={getStepState('preparing') === 'active' ? 'text-[#D94A45] animate-pulse font-extrabold' : getStepState('preparing') === 'done' ? 'text-[#8FAF78]' : 'text-[#5A5048]'}>
                  {getStepState('preparing') === 'active' ? '● Preparing' : 'Preparing'}
                </span>
                <span className={getStepState('ready') === 'active' || getStepState('ready') === 'done' ? 'text-[#8FAF78] font-extrabold' : 'text-[#5A5048]'}>
                  {getStepState('ready') === 'active' ? '★ Ready!' : 'Ready'}
                </span>
                <span className={getStepState('completed') === 'done' || getStepState('completed') === 'active' ? 'text-[#8FAF78]' : 'text-[#5A5048]'}>
                  Completed
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-[#EDE4D5] h-2.5 rounded-full border border-[#1D1916] overflow-hidden">
                <div
                  className="bg-[#8FAF78] h-full transition-all duration-700 ease-out"
                  style={{
                    width:
                      activeOrder.orderStatus === 'new'
                        ? '20%'
                        : activeOrder.orderStatus === 'confirmed'
                        ? '40%'
                        : activeOrder.orderStatus === 'preparing' || activeOrder.orderStatus === 'delayed'
                        ? '70%'
                        : activeOrder.orderStatus === 'ready'
                        ? '90%'
                        : activeOrder.orderStatus === 'completed'
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            </div>
          )}

          {/* Customer & Serving Details Box */}
          <div className="p-4 rounded-xl bg-[#FDFAF5] border-2 border-[#1D1916] shadow-sm space-y-2 text-xs font-space">
            <div className="flex justify-between">
              <span className="text-[#5A5048]">Customer Name:</span>
              <span className="font-bold text-[#1D1916]">{activeOrder.customerName}</span>
            </div>
            {isDineIn ? (
              <div className="flex justify-between">
                <span className="text-[#5A5048]">Seated At:</span>
                <span className="font-bold text-[#8FAF78]">{activeOrder.tableNumber || 'Dine-In Table'}</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-[#5A5048]">Pickup At:</span>
                <span className="font-bold text-[#1D1916]">{activeOrder.pickupLocation || 'Main Barista Counter'}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#5A5048]">Contact Email:</span>
              <span className="font-bold text-[#1D1916]">{activeOrder.customerEmail}</span>
            </div>
            {activeOrder.customerNotes && (
              <div className="pt-2 border-t border-[#1D1916]/10 text-[#5A5048]">
                <span className="font-bold text-[#1D1916]">Special Request: </span>
                {activeOrder.customerNotes}
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="space-y-2.5">
            <h4 className="font-syne font-bold text-xs uppercase tracking-wider text-[#1D1916]">
              Items in this Order ({activeOrder.items.length})
            </h4>

            <div className="space-y-2">
              {activeOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#FAF6F0] border border-[#1D1916]/25 text-xs font-space"
                >
                  <div>
                    <span className="font-bold text-[#1D1916]">
                      {item.quantity}× {item.menuItem.name}
                    </span>
                    {item.options?.milk && (
                      <span className="text-[11px] text-[#5A5048] block">
                        {item.options.milk} {item.options.temperature && `• ${item.options.temperature}`}
                        {item.options.sweetness && ` • ${item.options.sweetness}`}
                      </span>
                    )}
                    {item.options?.extras && item.options.extras.length > 0 && (
                      <span className="text-[10px] text-[#D94A45] block">
                        +{item.options.extras.join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#1D1916]">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 font-syne font-black text-sm text-[#1D1916]">
              <span>TOTAL</span>
              <span className="text-base text-[#D94A45]">${activeOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Cancellation Option (Modal toggle) */}
          {canCancel && !showCancelConfirm && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                className="text-xs font-space font-semibold text-[#5A5048] hover:text-[#D94A45] underline transition-colors"
              >
                Need to cancel this order?
              </button>
            </div>
          )}

          {/* In-modal Cancel Confirmation */}
          {showCancelConfirm && (
            <div className="p-4 rounded-xl bg-[#FCEBEA] border-2 border-[#D94A45] shadow-brutal space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#D94A45]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <h5 className="font-syne font-bold text-xs uppercase">Cancel Order #{activeOrder.orderId}?</h5>
              </div>
              <p className="text-[11px] font-sans text-[#2E2722]">
                Are you sure? This will notify the baristas to stop preparing your ticket.
              </p>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D94A45] rounded-lg font-sans"
              >
                <option value="Change of plans">Change of plans</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Wait time too long">Wait time too long</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#1D1916] font-space text-xs font-bold"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-3 py-1.5 rounded-lg bg-[#D94A45] text-white font-space text-xs font-bold shadow-xs"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Primary Action */}
        <div className="p-5 bg-[#FAF6F0] border-t-2 border-[#1D1916] flex items-center justify-between gap-3">
          <p className="text-[11px] font-handwritten text-[#5A5048] font-bold">
            {isReady
              ? '✨ Freshly made with organic ingredients'
              : '☕ You can close this; tracking remains active in top bar'}
          </p>
          <button
            onClick={handleDismiss}
            className="px-6 py-3 rounded-xl bg-[#1D1916] hover:bg-[#2E2722] text-[#F6F0E6] font-space font-bold text-xs sm:text-sm border-2 border-[#1D1916] shadow-brutal flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <span>{isReady ? 'Got it, thank you! ☕' : 'Close Notification'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveOrderTrackingModal;
