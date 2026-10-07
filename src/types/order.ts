import type { MenuItem } from '../data/cafeData';

export interface CartItemOption {
  milk?: string;
  sweetness?: string;
  temperature?: string;
  extras?: string[];
  specialInstructions?: string;
}

export type OrderType = 'dine_in' | 'pickup' | 'delivery';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'delayed';

export type PaymentStatus = 'unpaid' | 'paid' | 'pay_at_counter' | 'refunded';

export type PaymentMethod = 'apple_pay' | 'card' | 'pickup';

export interface OrderItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  options?: CartItemOption;
  unitPrice: number;
}

export interface DeliveryDetails {
  address: string;
  apartmentOrSuite?: string;
  instructions?: string;
  distanceKm?: number;
  deliveryFee?: number;
  estimatedDeliveryMinutes?: number;
  deliveryStatus?: 'assigned' | 'out_for_delivery' | 'delivered';
}

export interface DeliveryConfig {
  enabled: boolean;
  radiusKm: number;
  baseFee: number;
  perKmFee: number;
  minOrderAmount: number;
}

export interface CafeSettings {
  isOpen: boolean;
  estimatedPrepMinutes: number; // e.g. 15 mins (busy: 25 mins)
  maxOrdersPerSlot: number; // capacity control (e.g. 8 per 15 min)
  maxAdvanceHours: number; // e.g. 24 hours
  dineInEnabled: boolean;
  pickupEnabled: boolean;
  deliveryConfig: DeliveryConfig;
  autoAcceptOrders: boolean;
  soundAlertsEnabled: boolean;
  cafeTimezone: string;
}

export interface CafeOrder {
  orderId: string; // e.g. '1024'
  id: string; // unique UUID / key
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  orderType: OrderType;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;

  // Dine-in specifics
  tableNumber?: string; // e.g. "Table 04"
  servingTime?: string; // e.g. "ASAP (~15 mins)" or "4:30 PM"

  // Pickup specifics
  pickupTime?: string; // e.g. "ASAP (~15 mins)" or "Today, 4:30 PM"
  pickupLocation?: string;

  // Delivery specifics (future ready)
  delivery?: DeliveryDetails;

  // Timing & Timestamps (ISO Strings in UTC)
  createdAt: string;
  requestedServingAt: string; // ISO timestamp
  estimatedReadyAt: string; // ISO timestamp for live countdown
  actualReadyAt?: string;
  completedAt?: string;
  cancelledAt?: string;

  // Status & Notes
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
  ownerNotes?: string;
  cancellationReason?: string;
  customOwnerMessage?: string; // e.g. "Running 5 mins behind, thank you for waiting!"

  // Notification state
  isCustomerDismissed?: boolean;
}

export interface CustomerNotification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'delay' | 'ready';
  timestamp: string;
  read: boolean;
}
