import type { CafeOrder, OrderStatus, CafeSettings } from '../types/order';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const ORDERS_STORAGE_KEY = 'the_little_cup_orders_db_v2';
const SETTINGS_STORAGE_KEY = 'the_little_cup_settings_v2';
const LAST_ORDER_NUM_KEY = 'the_little_cup_last_order_seq_v2';
const SYNC_CHANNEL_NAME = 'the_little_cup_realtime_orders';

// Helper to generate a valid v4 UUID compliant with PostgreSQL UUID type
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const DEFAULT_CAFE_SETTINGS: CafeSettings = {
  isOpen: true,
  estimatedPrepMinutes: 15,
  maxOrdersPerSlot: 8,
  maxAdvanceHours: 24,
  dineInEnabled: true,
  pickupEnabled: true,
  deliveryConfig: {
    enabled: false,
    radiusKm: 5,
    baseFee: 3.5,
    perKmFee: 0.75,
    minOrderAmount: 15.0,
  },
  autoAcceptOrders: false,
  soundAlertsEnabled: true,
  cafeTimezone: 'Asia/Kolkata', // Configurable timezone
};

type OrderListener = (orders: CafeOrder[]) => void;
type SettingsListener = (settings: CafeSettings) => void;

class OrderService {
  private channel: BroadcastChannel | null = null;
  private orderListeners: Set<OrderListener> = new Set();
  private settingsListeners: Set<SettingsListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Local Cross-Tab Channel
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            if (event.data?.type === 'ORDERS_UPDATED') {
              this.notifyOrderListeners();
            } else if (event.data?.type === 'SETTINGS_UPDATED') {
              this.notifySettingsListeners();
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }

      // Storage event listener
      window.addEventListener('storage', (event) => {
        if (event.key === ORDERS_STORAGE_KEY) {
          this.notifyOrderListeners();
        } else if (event.key === SETTINGS_STORAGE_KEY) {
          this.notifySettingsListeners();
        }
      });

      // 2. Supabase Cloud Realtime Connection
      this.initSupabaseSync();
    }
  }

  public async initSupabaseSync() {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) return;

    try {
      // Fetch initial remote orders
      const { data: remoteOrders, error: orderError } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!orderError && remoteOrders) {
        const mappedOrders: CafeOrder[] = remoteOrders.map((ro) => this.mapSupabaseToOrder(ro));
        this.saveOrdersLocally(mappedOrders);
      } else if (orderError) {
        console.warn('Supabase fetch orders error:', orderError.message);
      }

      // Fetch remote settings
      const { data: remoteSettings, error: settingsError } = await client
        .from('cafe_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!settingsError && remoteSettings) {
        const mappedSettings: CafeSettings = {
          isOpen: remoteSettings.is_open,
          estimatedPrepMinutes: remoteSettings.estimated_prep_minutes,
          maxOrdersPerSlot: remoteSettings.max_orders_per_slot,
          maxAdvanceHours: remoteSettings.max_advance_hours || 24,
          dineInEnabled: remoteSettings.dine_in_enabled,
          pickupEnabled: remoteSettings.pickup_enabled,
          deliveryConfig: remoteSettings.delivery_config || DEFAULT_CAFE_SETTINGS.deliveryConfig,
          autoAcceptOrders: remoteSettings.auto_accept_orders || false,
          soundAlertsEnabled: remoteSettings.sound_alerts_enabled ?? true,
          cafeTimezone: remoteSettings.cafe_timezone || 'Asia/Kolkata',
        };
        this.saveSettingsLocally(mappedSettings);
      }

      // Subscribe to Realtime postgres_changes
      client
        .channel('realtime_orders_room')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newOrder = this.mapSupabaseToOrder(payload.new);
              const current = this.getAllOrders();
              if (!current.some((o) => o.id === newOrder.id || o.orderId === newOrder.orderId)) {
                const updated = [newOrder, ...current];
                this.saveOrdersLocally(updated);
                this.playNotificationSound();
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedOrder = this.mapSupabaseToOrder(payload.new);
              const current = this.getAllOrders();
              const updated = current.map((o) =>
                o.id === updatedOrder.id || o.orderId === updatedOrder.orderId ? updatedOrder : o
              );
              this.saveOrdersLocally(updated);
            } else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id;
              const current = this.getAllOrders();
              const updated = current.filter((o) => o.id !== deletedId);
              this.saveOrdersLocally(updated);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cafe_settings' },
          (payload) => {
            const row = payload.new as Record<string, any>;
            if (row && Object.keys(row).length > 0) {
              const mappedSettings: CafeSettings = {
                isOpen: Boolean(row.is_open),
                estimatedPrepMinutes: Number(row.estimated_prep_minutes || 15),
                maxOrdersPerSlot: Number(row.max_orders_per_slot || 8),
                maxAdvanceHours: Number(row.max_advance_hours || 24),
                dineInEnabled: Boolean(row.dine_in_enabled),
                pickupEnabled: Boolean(row.pickup_enabled),
                deliveryConfig: row.delivery_config || DEFAULT_CAFE_SETTINGS.deliveryConfig,
                autoAcceptOrders: Boolean(row.auto_accept_orders),
                soundAlertsEnabled: row.sound_alerts_enabled ?? true,
                cafeTimezone: row.cafe_timezone || 'Asia/Kolkata',
              };
              this.saveSettingsLocally(mappedSettings);
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Supabase real-time connection notice:', e);
    }
  }

  public isConnectedToCloud(): boolean {
    return isSupabaseConfigured();
  }

  // --- Orders CRUD ---

  public getAllOrders(): CafeOrder[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public getOrderById(orderId: string): CafeOrder | undefined {
    const orders = this.getAllOrders();
    return orders.find((o) => o.orderId === orderId || o.id === orderId);
  }

  public getNextOrderNumber(): string {
    try {
      const seq = localStorage.getItem(LAST_ORDER_NUM_KEY);
      const nextNum = seq ? parseInt(seq, 10) + 1 : 1024;
      localStorage.setItem(LAST_ORDER_NUM_KEY, nextNum.toString());
      return nextNum.toString();
    } catch {
      return Math.floor(1000 + Math.random() * 9000).toString();
    }
  }

  public createOrder(
    orderPayload: Omit<
      CafeOrder,
      'orderId' | 'id' | 'createdAt' | 'estimatedReadyAt' | 'requestedServingAt' | 'orderStatus'
    > & {
      requestedServingAt?: string;
      orderStatus?: OrderStatus;
      estimatedPrepMinutes?: number;
    }
  ): CafeOrder {
    const orders = this.getAllOrders();
    const orderId = this.getNextOrderNumber();
    const id = generateUUID(); // RFC4122 compliant UUID for PostgreSQL
    const now = new Date();
    const prepMinutes = orderPayload.estimatedPrepMinutes || this.getSettings().estimatedPrepMinutes || 15;

    // Calculate requestedServingAt and estimatedReadyAt timestamps
    const createdAt = now.toISOString();
    let requestedServingAt = createdAt;

    if (orderPayload.servingTime || orderPayload.pickupTime) {
      const timeStr = orderPayload.servingTime || orderPayload.pickupTime || '';
      if (timeStr.includes('10 min')) {
        requestedServingAt = new Date(now.getTime() + 10 * 60000).toISOString();
      } else if (timeStr.includes('15 min')) {
        requestedServingAt = new Date(now.getTime() + 15 * 60000).toISOString();
      } else if (timeStr.includes('20 min')) {
        requestedServingAt = new Date(now.getTime() + 20 * 60000).toISOString();
      } else if (timeStr.includes('30 min')) {
        requestedServingAt = new Date(now.getTime() + 30 * 60000).toISOString();
      } else if (timeStr.includes('45 min')) {
        requestedServingAt = new Date(now.getTime() + 45 * 60000).toISOString();
      } else if (timeStr.includes('1 hour')) {
        requestedServingAt = new Date(now.getTime() + 60 * 60000).toISOString();
      } else {
        requestedServingAt = new Date(now.getTime() + prepMinutes * 60000).toISOString();
      }
    } else {
      requestedServingAt = new Date(now.getTime() + prepMinutes * 60000).toISOString();
    }

    const estimatedReadyAt = new Date(
      Math.max(now.getTime() + prepMinutes * 60000, new Date(requestedServingAt).getTime())
    ).toISOString();

    const newOrder: CafeOrder = {
      ...orderPayload,
      orderId,
      id,
      createdAt,
      requestedServingAt,
      estimatedReadyAt,
      orderStatus: 'new',
      isCustomerDismissed: false,
    };

    const updated = [newOrder, ...orders];
    this.saveOrdersLocally(updated);
    this.broadcast({ type: 'ORDERS_UPDATED' });
    this.playNotificationSound();

    // Async push to Supabase with valid UUID
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      client.auth.getUser().then(({ data: authData }) => {
        const authUserId = authData?.user?.id || null;
        client
          .from('orders')
          .insert({
            id: newOrder.id,
            order_id: newOrder.orderId,
            customer_id: authUserId,
            customer_name: newOrder.customerName,
            customer_email: newOrder.customerEmail,
            customer_phone: newOrder.customerPhone || null,
            order_type: newOrder.orderType,
            table_number: newOrder.tableNumber || null,
            serving_time: newOrder.servingTime || null,
            pickup_time: newOrder.pickupTime || null,
            pickup_location: newOrder.pickupLocation || 'The Little Cup • Iscon Cross Roads, SG Hwy',
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            tax: newOrder.tax,
            delivery_fee: newOrder.deliveryFee || 0,
            total: newOrder.total,
            order_status: newOrder.orderStatus,
            payment_status: newOrder.paymentStatus,
            payment_method: newOrder.paymentMethod,
            customer_notes: newOrder.customerNotes || null,
            created_at: newOrder.createdAt,
            requested_serving_at: newOrder.requestedServingAt,
            estimated_ready_at: newOrder.estimatedReadyAt,
          })
          .then(({ data, error }) => {
            if (error) {
              console.error('⚠️ Supabase order insert error:', error.message, error);
            } else {
              console.log('✅ Order synced to Supabase Cloud:', newOrder.orderId, data);
            }
          });
      });
    }

    return newOrder;
  }

  public updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    metadata?: {
      cancellationReason?: string;
      customOwnerMessage?: string;
      estimatedMinutesAdd?: number;
    }
  ): CafeOrder | undefined {
    const orders = this.getAllOrders();
    let updatedOrder: CafeOrder | undefined;

    const updated = orders.map((order) => {
      if (order.orderId === orderId || order.id === orderId) {
        const nowIso = new Date().toISOString();
        const changes: Partial<CafeOrder> = { orderStatus: newStatus };

        if (newStatus === 'ready') {
          changes.actualReadyAt = nowIso;
        } else if (newStatus === 'completed') {
          changes.completedAt = nowIso;
        } else if (newStatus === 'cancelled') {
          changes.cancelledAt = nowIso;
          if (metadata?.cancellationReason) {
            changes.cancellationReason = metadata.cancellationReason;
          }
        }

        if (metadata?.customOwnerMessage) {
          changes.customOwnerMessage = metadata.customOwnerMessage;
        }

        if (metadata?.estimatedMinutesAdd) {
          const currentEstimated = new Date(order.estimatedReadyAt).getTime();
          changes.estimatedReadyAt = new Date(
            currentEstimated + metadata.estimatedMinutesAdd * 60000
          ).toISOString();
        }

        updatedOrder = { ...order, ...changes };
        return updatedOrder;
      }
      return order;
    });

    if (updatedOrder) {
      this.saveOrdersLocally(updated);
      this.broadcast({ type: 'ORDERS_UPDATED' });

      // Async update to Supabase
      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        const payload: Record<string, unknown> = {
          order_status: newStatus,
        };
        if (updatedOrder.actualReadyAt) payload.actual_ready_at = updatedOrder.actualReadyAt;
        if (updatedOrder.completedAt) payload.completed_at = updatedOrder.completedAt;
        if (updatedOrder.cancelledAt) payload.cancelled_at = updatedOrder.cancelledAt;
        if (updatedOrder.cancellationReason) payload.cancellation_reason = updatedOrder.cancellationReason;
        if (updatedOrder.customOwnerMessage) payload.custom_owner_message = updatedOrder.customOwnerMessage;
        if (updatedOrder.estimatedReadyAt) payload.estimated_ready_at = updatedOrder.estimatedReadyAt;

        client
          .from('orders')
          .update(payload)
          .or(`order_id.eq.${orderId},id.eq.${orderId}`)
          .then(({ error }) => {
            if (error) console.warn('Supabase update notice:', error);
          });
      }
    }

    return updatedOrder;
  }

  public sendOwnerMessage(orderId: string, message: string): void {
    const orders = this.getAllOrders();
    const updated = orders.map((order) => {
      if (order.orderId === orderId || order.id === orderId) {
        return {
          ...order,
          customOwnerMessage: message,
          orderStatus: order.orderStatus === 'preparing' ? 'delayed' : order.orderStatus,
        };
      }
      return order;
    });
    this.saveOrdersLocally(updated);
    this.broadcast({ type: 'ORDERS_UPDATED' });

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      client
        .from('orders')
        .update({ custom_owner_message: message })
        .or(`order_id.eq.${orderId},id.eq.${orderId}`)
        .then();
    }
  }

  public dismissCustomerNotification(orderId: string): void {
    const orders = this.getAllOrders();
    const updated = orders.map((order) => {
      if (order.orderId === orderId || order.id === orderId) {
        return { ...order, isCustomerDismissed: true };
      }
      return order;
    });
    this.saveOrdersLocally(updated);
    this.broadcast({ type: 'ORDERS_UPDATED' });
  }

  public cancelOrderByCustomer(orderId: string, reason = 'Customer requested cancellation'): boolean {
    const order = this.getOrderById(orderId);
    if (!order) return false;

    if (order.orderStatus === 'new' || order.orderStatus === 'confirmed') {
      this.updateOrderStatus(orderId, 'cancelled', { cancellationReason: reason });
      return true;
    }
    return false;
  }

  private saveOrdersLocally(orders: CafeOrder[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      this.notifyOrderListeners();
    } catch (e) {
      console.error('Failed to save orders locally', e);
    }
  }

  private saveSettingsLocally(settings: CafeSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      this.notifySettingsListeners();
    } catch (e) {
      console.error('Failed to save settings locally', e);
    }
  }

  // --- Settings ---

  public getSettings(): CafeSettings {
    if (typeof window === 'undefined') return DEFAULT_CAFE_SETTINGS;
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return DEFAULT_CAFE_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_CAFE_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_CAFE_SETTINGS;
    }
  }

  public updateSettings(newSettings: Partial<CafeSettings>): CafeSettings {
    const current = this.getSettings();
    const merged = { ...current, ...newSettings };
    this.saveSettingsLocally(merged);
    this.broadcast({ type: 'SETTINGS_UPDATED' });

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      client
        .from('cafe_settings')
        .upsert({
          id: 1,
          is_open: merged.isOpen,
          estimated_prep_minutes: merged.estimatedPrepMinutes,
          max_orders_per_slot: merged.maxOrdersPerSlot,
          dine_in_enabled: merged.dineInEnabled,
          pickup_enabled: merged.pickupEnabled,
          delivery_enabled: merged.deliveryConfig.enabled,
          delivery_config: merged.deliveryConfig,
          auto_accept_orders: merged.autoAcceptOrders,
          sound_alerts_enabled: merged.soundAlertsEnabled,
          cafe_timezone: merged.cafeTimezone,
        })
        .then();
    }

    return merged;
  }

  // --- Subscriptions ---

  public subscribeToOrders(listener: OrderListener): () => void {
    this.orderListeners.add(listener);
    listener(this.getAllOrders());
    return () => {
      this.orderListeners.delete(listener);
    };
  }

  public subscribeToSettings(listener: SettingsListener): () => void {
    this.settingsListeners.add(listener);
    listener(this.getSettings());
    return () => {
      this.settingsListeners.delete(listener);
    };
  }

  private notifyOrderListeners() {
    const orders = this.getAllOrders();
    this.orderListeners.forEach((listener) => {
      try {
        listener(orders);
      } catch (e) {
        console.error('Error in order listener', e);
      }
    });
  }

  private notifySettingsListeners() {
    const settings = this.getSettings();
    this.settingsListeners.forEach((listener) => {
      try {
        listener(settings);
      } catch (e) {
        console.error('Error in settings listener', e);
      }
    });
  }

  private broadcast(message: { type: string; payload?: unknown }) {
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('Broadcast error', e);
      }
    }
  }

  // Helper: map Supabase DB row to CafeOrder
  private mapSupabaseToOrder(row: any): CafeOrder {
    return {
      orderId: row.order_id || row.order_number?.toString() || row.id?.slice(0, 4) || '1024',
      id: row.id,
      customerId: row.customer_id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone || '',
      customerEmail: row.customer_email,
      orderType: row.order_type,
      tableNumber: row.table_number,
      servingTime: row.serving_time,
      pickupTime: row.pickup_time,
      pickupLocation: row.pickup_location,
      items: row.items || [],
      subtotal: Number(row.subtotal || 0),
      tax: Number(row.tax || 0),
      deliveryFee: Number(row.delivery_fee || 0),
      total: Number(row.total || 0),
      orderStatus: row.order_status,
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      customerNotes: row.customer_notes,
      ownerNotes: row.owner_notes,
      customOwnerMessage: row.custom_owner_message,
      cancellationReason: row.cancellation_reason,
      createdAt: row.created_at,
      requestedServingAt: row.requested_serving_at || row.created_at,
      estimatedReadyAt: row.estimated_ready_at || row.created_at,
      actualReadyAt: row.actual_ready_at,
      completedAt: row.completed_at,
      cancelledAt: row.cancelled_at,
      isCustomerDismissed: false,
    };
  }

  // --- Audio Chime ---

  public playNotificationSound(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(830.61, now + 0.15);
      gain2.gain.setValueAtTime(0.12, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.55);
    } catch {
      // Audio autoplay policy
    }
  }
}

export const orderService = new OrderService();
export default orderService;
