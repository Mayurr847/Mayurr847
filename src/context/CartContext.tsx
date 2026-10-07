/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { MenuItem, JournalArticle } from '../data/cafeData';
import type {
  CafeOrder,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  CafeSettings,
} from '../types/order';
import { orderService } from '../services/orderService';

export interface CartItemOption {
  milk?: string;
  sweetness?: string;
  temperature?: string;
  extras?: string[];
  specialInstructions?: string;
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  options?: CartItemOption;
  unitPrice: number;
}

export interface OrderCheckoutPayload {
  orderType: OrderType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableNumber?: string;
  servingTime?: string;
  pickupTime?: string;
  customerNotes?: string;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
}

export interface ToastInfo {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'heart' | 'cart' | 'warning';
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  addToCart: (item: MenuItem, options?: CartItemOption, qty?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;

  // Cart Drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Checkout Modal
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Order Placement & Live Tracking
  activeOrder: CafeOrder | null;
  activeOrderId: string | null;
  allOrders: CafeOrder[];
  customerOrders: CafeOrder[];
  placeOrder: (payload: OrderCheckoutPayload) => CafeOrder;
  reorder: (order: CafeOrder) => void;
  cancelOrder: (orderId: string, reason?: string) => boolean;
  dismissOrderNotification: (orderId: string) => void;
  trackOrder: (orderId: string) => void;
  isTrackingModalOpen: boolean;
  openTrackingModal: () => void;
  closeTrackingModal: () => void;

  // Customer "My Orders" History Modal
  isMyOrdersOpen: boolean;
  openMyOrders: () => void;
  closeMyOrders: () => void;

  // Staff / Owner Dashboard Modal
  isOwnerDashboardOpen: boolean;
  openOwnerDashboard: () => void;
  closeOwnerDashboard: () => void;
  cafeSettings: CafeSettings;
  updateCafeSettings: (newSettings: Partial<CafeSettings>) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  // Modals & Article Reader
  activeArticle: JournalArticle | null;
  openArticle: (article: JournalArticle) => void;
  closeArticle: () => void;

  isStoryModalOpen: boolean;
  openStoryModal: () => void;
  closeStoryModal: () => void;

  customizingItem: MenuItem | null;
  openCustomizeModal: (item: MenuItem) => void;
  closeCustomizeModal: () => void;

  // Toast
  toast: ToastInfo | null;
  showToast: (
    title: string,
    message?: string,
    type?: 'success' | 'info' | 'heart' | 'cart' | 'warning'
  ) => void;
}

const CART_STORAGE_KEY = 'the_little_cup_cart_v1';
const FAVORITES_STORAGE_KEY = 'the_little_cup_favorites_v1';
const ACTIVE_ORDER_ID_KEY = 'the_little_cup_active_order_id_v2';
const CUSTOMER_ORDERS_IDS_KEY = 'the_little_cup_customer_order_ids_v2';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!saved) return ['matcha-latte', 'cherry-cold-foam'];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : ['matcha-latte', 'cherry-cold-foam'];
    } catch {
      return ['matcha-latte', 'cherry-cold-foam'];
    }
  });

  // Tracked customer order IDs for this client
  const [customerOrderIds, setCustomerOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_ORDERS_IDS_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Active Order ID
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_ORDER_ID_KEY);
    } catch {
      return null;
    }
  });

  // Realtime synced orders list from orderService
  const [allOrders, setAllOrders] = useState<CafeOrder[]>(() => orderService.getAllOrders());
  const [cafeSettings, setCafeSettings] = useState<CafeSettings>(() => orderService.getSettings());

  // UI Modal State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Subscribe to real-time order updates & settings updates
  useEffect(() => {
    const unsubOrders = orderService.subscribeToOrders((orders) => {
      setAllOrders(orders);
    });
    const unsubSettings = orderService.subscribeToSettings((settings) => {
      setCafeSettings(settings);
    });
    return () => {
      unsubOrders();
      unsubSettings();
    };
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Save active order ID
  useEffect(() => {
    try {
      if (activeOrderId) {
        localStorage.setItem(ACTIVE_ORDER_ID_KEY, activeOrderId);
      } else {
        localStorage.removeItem(ACTIVE_ORDER_ID_KEY);
      }
    } catch (e) {
      console.error('Failed to save active order id', e);
    }
  }, [activeOrderId]);

  // Save customer order IDs
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_ORDERS_IDS_KEY, JSON.stringify(customerOrderIds));
    } catch (e) {
      console.error('Failed to save customer order IDs', e);
    }
  }, [customerOrderIds]);

  // Lock background scroll when any modal or drawer is active
  useEffect(() => {
    const isAnyModalActive = Boolean(
      isCartOpen ||
      isCheckoutOpen ||
      isTrackingModalOpen ||
      isMyOrdersOpen ||
      isOwnerDashboardOpen ||
      activeArticle ||
      isStoryModalOpen ||
      customizingItem
    );

    if (isAnyModalActive) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [
    isCartOpen,
    isCheckoutOpen,
    isTrackingModalOpen,
    isMyOrdersOpen,
    isOwnerDashboardOpen,
    activeArticle,
    isStoryModalOpen,
    customizingItem,
  ]);

  // Active Order resolution
  const activeOrder = useMemo(() => {
    if (!activeOrderId) return null;
    return allOrders.find((o) => o.orderId === activeOrderId || o.id === activeOrderId) || null;
  }, [activeOrderId, allOrders]);

  // Customer's order history
  const customerOrders = useMemo(() => {
    return allOrders.filter(
      (o) => customerOrderIds.includes(o.orderId) || customerOrderIds.includes(o.id)
    );
  }, [allOrders, customerOrderIds]);

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const cartTax = cartSubtotal * 0.08875; // NYC sales tax rate
  const cartTotal = cartSubtotal + cartTax;

  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'heart' | 'cart' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const addToCart = (item: MenuItem, options?: CartItemOption, qty: number = 1) => {
    let extraPrice = 0;
    if (options?.milk?.includes('Almond') || options?.milk?.includes('Coconut')) extraPrice += 0.75;
    if (options?.milk?.includes('Pistachio')) extraPrice += 1.00;
    if (options?.extras) {
      options.extras.forEach((ex) => {
        if (ex.includes('Shot')) extraPrice += 1.25;
        if (ex.includes('Cold Foam')) extraPrice += 1.50;
        if (ex.includes('Vanilla') || ex.includes('Lavender')) extraPrice += 0.75;
        if (ex.includes('Whipped')) extraPrice += 0.50;
      });
    }

    const unitPrice = item.price + extraPrice;
    const cartId = `${item.id}-${options?.milk || 'default'}-${options?.temperature || 'default'}-${options?.sweetness || 'default'}-${(options?.extras || []).sort().join(',')}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartId === cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { cartId, menuItem: item, quantity: qty, options, unitPrice }];
    });

    showToast(
      `Added to Bag ☕`,
      `${qty}x ${item.name} ($${(unitPrice * qty).toFixed(2)})`,
      'cart'
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      if (exists) {
        showToast('Removed from Favorites ♡');
        return prev.filter((id) => id !== itemId);
      } else {
        showToast('Saved to Favorites! ♥', 'View your saved items anytime in the menu.', 'heart');
        return [...prev, itemId];
      }
    });
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  const placeOrder = (payload: OrderCheckoutPayload): CafeOrder => {
    const paymentStatus: PaymentStatus =
      payload.paymentMethod === 'pickup' ? 'pay_at_counter' : 'paid';

    const newOrder = orderService.createOrder({
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      orderType: payload.orderType,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      deliveryFee: 0,
      total: cartTotal,
      tableNumber: payload.tableNumber,
      servingTime: payload.servingTime,
      pickupTime: payload.pickupTime,
      pickupLocation: 'The Little Cup • Iscon Cross Roads, SG Hwy',
      customerNotes: payload.customerNotes,
      paymentMethod: payload.paymentMethod,
      paymentStatus,
      estimatedPrepMinutes: cafeSettings.estimatedPrepMinutes || 15,
    });

    // Update customer tracked IDs and active ID
    setCustomerOrderIds((prev) => [newOrder.orderId, ...prev]);
    setActiveOrderId(newOrder.orderId);

    // Clear cart and close checkout
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsTrackingModalOpen(true);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#8FAF78', '#F4D35E', '#D94A45', '#1D1916'],
      });
    } catch (e) {
      console.error(e);
    }

    showToast(
      'Order Placed! ☕',
      `Order #${newOrder.orderId} received. We're getting it ready!`,
      'success'
    );

    return newOrder;
  };

  const reorder = (order: CafeOrder) => {
    order.items.forEach((item) => {
      addToCart(item.menuItem, item.options, item.quantity);
    });
    setIsMyOrdersOpen(false);
    setIsCartOpen(true);
    showToast('Items added to Bag! 🥐', `Reordered from Order #${order.orderId}`, 'cart');
  };

  const cancelOrder = (orderId: string, reason = 'Customer requested cancellation'): boolean => {
    const success = orderService.cancelOrderByCustomer(orderId, reason);
    if (success) {
      showToast('Order Cancelled', `Order #${orderId} was cancelled.`, 'warning');
    } else {
      showToast('Cannot Cancel Order', 'This order is already being prepared or completed.', 'warning');
    }
    return success;
  };

  const dismissOrderNotification = (orderId: string) => {
    orderService.dismissCustomerNotification(orderId);
    setIsTrackingModalOpen(false);
  };

  const trackOrder = (orderId: string) => {
    setActiveOrderId(orderId);
    setIsTrackingModalOpen(true);
    setIsMyOrdersOpen(false);
  };

  const updateCafeSettings = (newSettings: Partial<CafeSettings>) => {
    const updated = orderService.updateSettings(newSettings);
    setCafeSettings(updated);
    showToast('Settings Updated ✨', 'Café parameters updated successfully.', 'success');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartTax,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),

        isCheckoutOpen,
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),

        activeOrder,
        activeOrderId,
        allOrders,
        customerOrders,
        placeOrder,
        reorder,
        cancelOrder,
        dismissOrderNotification,
        trackOrder,
        isTrackingModalOpen,
        openTrackingModal: () => setIsTrackingModalOpen(true),
        closeTrackingModal: () => setIsTrackingModalOpen(false),

        isMyOrdersOpen,
        openMyOrders: () => setIsMyOrdersOpen(true),
        closeMyOrders: () => setIsMyOrdersOpen(false),

        isOwnerDashboardOpen,
        openOwnerDashboard: () => setIsOwnerDashboardOpen(true),
        closeOwnerDashboard: () => setIsOwnerDashboardOpen(false),
        cafeSettings,
        updateCafeSettings,

        favorites,
        toggleFavorite,
        isFavorite,

        activeArticle,
        openArticle: (art) => setActiveArticle(art),
        closeArticle: () => setActiveArticle(null),

        isStoryModalOpen,
        openStoryModal: () => setIsStoryModalOpen(true),
        closeStoryModal: () => setIsStoryModalOpen(false),

        customizingItem,
        openCustomizeModal: (item) => setCustomizingItem(item),
        closeCustomizeModal: () => setCustomizingItem(null),

        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
