import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { isSupabaseConfigured, setCustomSupabaseConfig } from '../lib/supabase';
import {
  X,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  Search,
  Settings,
  Volume2,
  AlertTriangle,
  Play,
  MessageCircle,
  Lock,
  LogOut,
  Check,
  Phone,
  User,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  KeyRound,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { isOwnerDashboardOpen, closeOwnerDashboard, allOrders, cafeSettings, updateCafeSettings } = useCart();
  const {
    user,
    isLoading: isAuthLoading,
    isAuthenticated,
    isStaffOrOwner,
    isOwner,
    isManager,
    isStaff,
    isCustomer,
    signIn,
    signOut,
    sendPasswordResetEmail,
  } = useAuth();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  // Dashboard tabs & filters
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'dine_in' | 'pickup' | 'delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cloud Supabase configuration state (for settings tab)
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>(() => {
    try {
      return localStorage.getItem('the_little_cup_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
    } catch {
      return '';
    }
  });
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>(() => {
    try {
      return localStorage.getItem('the_little_cup_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    } catch {
      return '';
    }
  });
  const [cloudSaveStatus, setCloudSaveStatus] = useState('');

  // Dialog actions
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Item temporarily sold out');
  const [messageOrderId, setMessageOrderId] = useState<string | null>(null);
  const [presetMessage, setPresetMessage] = useState('Your order is almost ready! ☕');
  const [customText, setCustomText] = useState('');

  // Current live clock for countdown calculation
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!isOwnerDashboardOpen) return;
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOwnerDashboardOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOwnerDashboardOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (rejectOrderId) {
          setRejectOrderId(null);
        } else if (messageOrderId) {
          setMessageOrderId(null);
        } else if (isForgotModalOpen) {
          setIsForgotModalOpen(false);
        } else {
          closeOwnerDashboard();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwnerDashboardOpen, rejectOrderId, messageOrderId, isForgotModalOpen, closeOwnerDashboard]);

  if (!isOwnerDashboardOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setAuthError(result.error || 'Authentication failed. Please verify your email and password.');
      } else if (result.role === 'CUSTOMER') {
        // Customer accounts are authenticated but unauthorized for owner dashboard
        setAuthError('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during login.';
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setIsResetSubmitting(true);
    setResetStatus(null);
    try {
      const { success, error } = await sendPasswordResetEmail(resetEmail);
      if (success) {
        setResetStatus('Password reset link sent to your email. Check your inbox!');
      } else {
        setResetStatus(`Failed to send reset link: ${error || 'Unknown error'}`);
      }
    } catch {
      setResetStatus('Failed to send reset email. Please try again.');
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setEmail('');
    setPassword('');
    setAuthError('');
  };

  // Order Counts
  const newOrders = allOrders.filter((o) => o.orderStatus === 'new');
  const preparingOrders = allOrders.filter(
    (o) => o.orderStatus === 'confirmed' || o.orderStatus === 'preparing' || o.orderStatus === 'delayed'
  );
  const readyOrders = allOrders.filter((o) => o.orderStatus === 'ready');
  const completedOrders = allOrders.filter((o) => o.orderStatus === 'completed');
  const cancelledOrders = allOrders.filter((o) => o.orderStatus === 'cancelled');

  // Filtered orders list for dashboard table
  const filteredOrders = allOrders.filter((order) => {
    // Status Filter
    if (statusFilter === 'new' && order.orderStatus !== 'new') return false;
    if (
      statusFilter === 'preparing' &&
      !(order.orderStatus === 'confirmed' || order.orderStatus === 'preparing' || order.orderStatus === 'delayed')
    )
      return false;
    if (statusFilter === 'ready' && order.orderStatus !== 'ready') return false;
    if (statusFilter === 'completed' && order.orderStatus !== 'completed') return false;
    if (statusFilter === 'cancelled' && order.orderStatus !== 'cancelled') return false;

    // Type filter
    if (typeFilter !== 'all' && order.orderType !== typeFilter) return false;

    // Search query (Order ID, Name, Phone, Table)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.orderId.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = (order.customerPhone || '').toLowerCase().includes(q);
      const matchTable = (order.tableNumber || '').toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchTable) return false;
    }

    return true;
  });

  // Action handlers (enforced by Supabase RLS at database layer)
  const handleAccept = (orderId: string) => {
    orderService.updateOrderStatus(orderId, 'confirmed');
  };

  const handleStartPreparing = (orderId: string) => {
    orderService.updateOrderStatus(orderId, 'preparing');
  };

  const handleMarkReady = (orderId: string) => {
    orderService.updateOrderStatus(orderId, 'ready');
    orderService.playNotificationSound();
  };

  const handleMarkCompleted = (orderId: string) => {
    orderService.updateOrderStatus(orderId, 'completed');
  };

  const handleConfirmReject = () => {
    if (rejectOrderId) {
      orderService.updateOrderStatus(rejectOrderId, 'cancelled', { cancellationReason: rejectReason });
      setRejectOrderId(null);
    }
  };

  const handleSendMessage = () => {
    if (messageOrderId) {
      const msg = customText.trim() || presetMessage;
      orderService.sendOwnerMessage(messageOrderId, msg);
      setMessageOrderId(null);
      setCustomText('');
    }
  };

  const handleAddMinutes = (orderId: string, mins: number) => {
    orderService.updateOrderStatus(orderId, 'delayed', {
      estimatedMinutesAdd: mins,
      customOwnerMessage: `Estimated time adjusted (+${mins} mins)`,
    });
  };

  const handleSeedDemoOrders = () => {
    orderService.createOrder({
      customerName: 'Maya Lin',
      customerEmail: 'maya@example.com',
      customerPhone: '(555) 019-2834',
      orderType: 'dine_in',
      tableNumber: 'Table 04',
      servingTime: 'In 15 minutes',
      items: [
        {
          cartId: 'item_1',
          menuItem: {
            id: 'matcha-latte',
            name: 'Ceremonial Uji Matcha',
            category: 'matcha',
            price: 6.75,
            description: 'First-harvest Uji ceremonial matcha with oat milk.',
            badge: 'Fan Favorite',
            image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
            calories: 140,
          },
          quantity: 2,
          options: { milk: 'Oat Milk', sweetness: 'Less Sweet', temperature: 'Iced', extras: ['Vanilla Syrup', 'Sweet Cold Foam'] },
          unitPrice: 8.25,
        },
      ],
      subtotal: 16.5,
      tax: 1.46,
      deliveryFee: 0,
      total: 17.96,
      paymentMethod: 'apple_pay',
      paymentStatus: 'paid',
      customerNotes: 'Extra hot please, no plastic lid if possible!',
      estimatedPrepMinutes: 15,
    });

    orderService.createOrder({
      customerName: 'Alex Thorne',
      customerEmail: 'alex.thorne@gmail.com',
      customerPhone: '(555) 482-9102',
      orderType: 'pickup',
      pickupTime: 'In 10 minutes',
      items: [
        {
          cartId: 'item_2',
          menuItem: {
            id: 'caramel-cloud-latte',
            name: 'Smoked Caramel Cold Foam',
            category: 'coffee',
            price: 6.95,
            description: 'House espresso over oat milk with smoked salted caramel foam.',
            badge: 'Signature',
            image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
            calories: 190,
          },
          quantity: 1,
          options: { milk: 'Oat Milk', temperature: 'Iced' },
          unitPrice: 6.95,
        },
        {
          cartId: 'item_3',
          menuItem: {
            id: 'matcha-croissant',
            name: 'Matcha Cream Croissant',
            category: 'pastries',
            price: 5.5,
            description: 'Double baked French butter croissant filled with Uji matcha custard.',
            badge: 'Bakery Fresh',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
            calories: 320,
          },
          quantity: 1,
          unitPrice: 5.5,
        },
      ],
      subtotal: 12.45,
      tax: 1.11,
      deliveryFee: 0,
      total: 13.56,
      paymentMethod: 'pickup',
      paymentStatus: 'pay_at_counter',
      customerNotes: 'Please warm up the croissant ❤️',
      estimatedPrepMinutes: 10,
    });
  };

  const getRoleBadge = () => {
    if (isOwner) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-[#F4D35E] text-[#1D1916] text-[10px] font-syne font-black uppercase flex items-center gap-1 shadow-2xs">
          👑 OWNER
        </span>
      );
    }
    if (isManager) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-[#8FAF78] text-[#1D1916] text-[10px] font-syne font-black uppercase flex items-center gap-1 shadow-2xs">
          👔 MANAGER
        </span>
      );
    }
    if (isStaff) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-[#EDE4D5] text-[#1D1916] text-[10px] font-syne font-black uppercase flex items-center gap-1 shadow-2xs">
          ☕ STAFF
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1D1916]/85 backdrop-blur-md animate-fadeIn text-left"
      role="dialog"
      aria-modal="true"
      aria-label="Staff & Owner Dashboard"
    >
      <div
        className="bg-[#F6F0E6] rounded-2xl border-3 border-[#1D1916] shadow-brutal-xl w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Bar */}
        <div className="bg-[#1D1916] text-[#F6F0E6] p-4 sm:px-6 flex items-center justify-between border-b-2 border-[#1D1916]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EFC958] text-[#1D1916] font-black flex items-center justify-center text-sm shadow-brutal">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-syne font-black text-lg tracking-tight uppercase text-white">
                  THE LITTLE CUP • STAFF & OWNER HUB
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#8FAF78] text-[#1D1916] text-[10px] font-syne font-bold uppercase">
                  {cafeSettings.isOpen ? '● Live & Open' : '○ Closed'}
                </span>
                {getRoleBadge()}
              </div>
              <p className="text-[11px] font-space text-[#A7C492]">
                Iscon Cross Roads, SG Hwy • Live Kitchen Display & Admin System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && isStaffOrOwner && (
              <>
                <button
                  type="button"
                  onClick={() => orderService.playNotificationSound()}
                  className="p-2 rounded-lg bg-[#2E2722] hover:bg-[#3D352E] text-[#F6F0E6] transition-colors text-xs flex items-center gap-1 font-space"
                  title="Test Sound Chime"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#EFC958]" />
                  <span className="hidden sm:inline">Chime</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-[#2E2722] hover:bg-[#D94A45] text-[#F6F0E6] transition-colors text-xs flex items-center gap-1 font-space"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}

            <button
              onClick={closeOwnerDashboard}
              className="p-2 rounded-full bg-[#FAF6F0] hover:bg-[#EDE4D5] text-[#1D1916] transition-transform active:scale-95"
              aria-label="Close dashboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isAuthLoading ? (
          /* Loading State (Prevents flash of dashboard content) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE4D5] border-2 border-[#1D1916] shadow-brutal flex items-center justify-center text-2xl animate-spin">
              <Loader2 className="w-8 h-8 text-[#1D1916]" />
            </div>
            <h4 className="font-syne font-black text-xl text-[#1D1916] uppercase">
              Verifying Security & Role Authorization...
            </h4>
            <p className="font-sans text-xs text-[#5A5048] max-w-sm">
              Checking database Row Level Security and authentication session with Supabase.
            </p>
          </div>
        ) : !isAuthenticated ? (
          /* Unauthenticated State: Dedicated Supabase Owner/Staff Login */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE4D5] border-2 border-[#1D1916] shadow-brutal flex items-center justify-center text-2xl mb-4">
              <Lock className="w-7 h-7 text-[#1D1916]" />
            </div>
            <h4 className="font-syne font-black text-2xl text-[#1D1916] uppercase">
              Owner & Staff Portal
            </h4>
            <p className="font-sans text-xs text-[#5A5048] mt-1 max-w-sm">
              Sign in with your authorized Supabase staff or owner account. Access is protected by server-side Row Level Security (RLS).
            </p>

            <form onSubmit={handleLoginSubmit} className="mt-5 w-full max-w-sm space-y-3.5 text-left">
              <div>
                <label className="block text-[11px] font-space font-bold text-[#1D1916] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5A5048] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="owner@thelittlecup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border-2 border-[#1D1916] rounded-xl shadow-xs focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-space font-bold text-[#1D1916]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setIsForgotModalOpen(true);
                      setResetStatus(null);
                    }}
                    className="text-[10px] font-space font-semibold text-[#5A5048] hover:text-[#1D1916] underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#5A5048] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border-2 border-[#1D1916] rounded-xl shadow-xs focus:outline-none font-sans"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-[#D94A45]/15 border border-[#D94A45] text-xs font-space font-bold text-[#D94A45] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-sm shadow-brutal hover:bg-[#2E2722] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Staff Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!isSupabaseConfigured() && (
                <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-space font-bold text-[#1D1916] flex items-center gap-1.5">
                      <span>⚡ Connect Supabase Cloud</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-syne font-bold uppercase bg-[#F4D35E] text-[#1D1916]">
                      Action Required
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A5048] font-sans">
                    Paste your Supabase URL & Anon Key (from Supabase Dashboard &gt; Project Settings &gt; API):
                  </p>
                  <div>
                    <input
                      type="text"
                      placeholder="https://your-project.supabase.co"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[11px] bg-white border border-[#1D1916]/30 rounded-lg font-mono mb-2"
                    />
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[11px] bg-white border border-[#1D1916]/30 rounded-lg font-mono"
                    />
                  </div>
                  {cloudSaveStatus && (
                    <p className="text-xs text-[#8FAF78] font-space font-bold">{cloudSaveStatus}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!supabaseUrlInput || !supabaseKeyInput) {
                        setCloudSaveStatus('Please enter both URL and Anon Key');
                        return;
                      }
                      setCustomSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
                      setCloudSaveStatus('Saved! Reloading...');
                    }}
                    className="w-full py-2 rounded-lg bg-[#1D1916] text-[#F6F0E6] text-xs font-space font-bold hover:bg-[#2E2722]"
                  >
                    Save & Reconnect Supabase →
                  </button>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#1D1916]/15 text-[11px] font-space text-[#5A5048] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8FAF78] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1D1916]">Database Authorization (RLS)</p>
                  <p className="text-[10px] text-[#5A5048]">
                    Role authorization is enforced on the database. Customers cannot access owner endpoints.
                  </p>
                </div>
              </div>
            </form>
          </div>
        ) : isCustomer ? (
          /* Logged-in Customer: Unauthorized Access Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D94A45]/15 border-2 border-[#D94A45] shadow-brutal flex items-center justify-center text-2xl">
              <ShieldAlert className="w-8 h-8 text-[#D94A45]" />
            </div>
            <h4 className="font-syne font-black text-2xl text-[#1D1916] uppercase">
              Access Denied: Customer Account
            </h4>
            <div className="max-w-md bg-white p-4 rounded-xl border-2 border-[#1D1916] shadow-sm text-xs font-space space-y-2 text-left">
              <p className="text-[#1D1916]">
                You are currently signed in as: <span className="font-bold font-mono">{user?.email}</span>
              </p>
              <p className="text-[#5A5048]">
                Assigned Role: <span className="font-bold text-[#D94A45] uppercase">CUSTOMER</span>
              </p>
              <p className="text-[11px] text-[#5A5048] border-t border-black/10 pt-2">
                This administrative section requires an authorized <span className="font-bold">STAFF</span>, <span className="font-bold">MANAGER</span>, or <span className="font-bold">OWNER</span> role. Customer accounts are strictly blocked by database Row Level Security.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeOwnerDashboard}
                className="px-5 py-2.5 rounded-xl bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs shadow-brutal hover:bg-[#2E2722]"
              >
                Return to Café Menu
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#1D1916] text-[#1D1916] font-space font-bold text-xs shadow-xs hover:bg-[#EDE4D5]"
              >
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        ) : (
          /* Authorized Dashboard: OWNER / MANAGER / STAFF */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation & Status Bar */}
            <div className="bg-[#FAF6F0] p-3 sm:px-6 border-b-2 border-[#1D1916] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all ${
                    activeTab === 'orders'
                      ? 'bg-[#1D1916] text-[#F6F0E6] shadow-brutal'
                      : 'bg-[#F6F0E6] text-[#1D1916] hover:bg-[#EDE4D5]'
                  }`}
                >
                  Live Orders ({allOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-[#1D1916] text-[#F6F0E6] shadow-brutal'
                      : 'bg-[#F6F0E6] text-[#1D1916] hover:bg-[#EDE4D5]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Café Settings</span>
                </button>
              </div>

              {/* User details and metric summary */}
              <div className="flex items-center gap-2 text-xs font-space">
                <span className="hidden md:inline-block text-[11px] text-[#5A5048]">
                  Signed in: <span className="font-bold text-[#1D1916]">{user?.email}</span>
                </span>
                <button
                  type="button"
                  onClick={handleSeedDemoOrders}
                  className="px-2.5 py-1 rounded-lg bg-[#EFC958] hover:bg-[#E5BC44] text-[#1D1916] font-bold border border-[#1D1916] shadow-2xs transition-all"
                  title="Generate sample Dine-In and Pickup orders"
                >
                  + Sample Orders
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-[#D94A45]/15 text-[#D94A45] font-bold">
                  🔔 {newOrders.length} New
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#F4D35E]/30 text-[#1D1916] font-bold">
                  ⏳ {preparingOrders.length} Prep
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#8FAF78]/30 text-[#1D1916] font-bold">
                  ★ {readyOrders.length} Ready
                </span>
              </div>
            </div>

            {activeTab === 'orders' ? (
              <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-4">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                    {[
                      { id: 'all', label: `All (${allOrders.length})` },
                      { id: 'new', label: `New (${newOrders.length})` },
                      { id: 'preparing', label: `Preparing (${preparingOrders.length})` },
                      { id: 'ready', label: `Ready (${readyOrders.length})` },
                      { id: 'completed', label: `Done (${completedOrders.length})` },
                      { id: 'cancelled', label: `Cancelled (${cancelledOrders.length})` },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStatusFilter(st.id as typeof statusFilter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-space font-bold whitespace-nowrap transition-all shrink-0 ${
                          statusFilter === st.id
                            ? 'bg-[#1D1916] text-[#F6F0E6] shadow-sm'
                            : 'bg-white/80 text-[#1D1916] hover:bg-white border border-[#1D1916]/15'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Search box & Type filter */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-[#5A5048] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search #ID, table, name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#1D1916]/20 rounded-lg font-sans focus:outline-none"
                      />
                    </div>

                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-[#1D1916]/20 rounded-lg font-space font-semibold"
                    >
                      <option value="all">All Modes</option>
                      <option value="dine_in">☕ Dine-In</option>
                      <option value="pickup">🚶 Pickup</option>
                      <option value="delivery">🛵 Delivery</option>
                    </select>
                  </div>
                </div>

                {/* Orders Grid / Cards List */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                  {filteredOrders.length === 0 ? (
                    <div className="py-16 text-center text-[#5A5048] flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-[#EDE4D5] border border-[#1D1916] flex items-center justify-center text-2xl mb-3">
                        ☕
                      </div>
                      <p className="font-syne font-bold text-lg text-[#1D1916] uppercase">
                        No orders in this category
                      </p>
                      <p className="text-xs font-sans mt-1 max-w-sm">
                        Incoming customer orders will appear here automatically with live chimes.
                      </p>
                      <button
                        type="button"
                        onClick={handleSeedDemoOrders}
                        className="mt-4 px-4 py-2 rounded-xl bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs shadow-brutal hover:bg-[#2E2722]"
                      >
                        + Create Sample Dine-In & Pickup Orders
                      </button>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const targetMs = new Date(order.estimatedReadyAt).getTime();
                      const diffSec = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
                      const isTimeExceeded =
                        nowMs > targetMs &&
                        (order.orderStatus === 'preparing' ||
                          order.orderStatus === 'confirmed' ||
                          order.orderStatus === 'new');
                      const mins = Math.floor(diffSec / 60);
                      const secs = diffSec % 60;
                      const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

                      const isDineIn = order.orderType === 'dine_in';
                      const isNew = order.orderStatus === 'new';
                      const isConfirmed = order.orderStatus === 'confirmed';
                      const isPreparing = order.orderStatus === 'preparing' || order.orderStatus === 'delayed';
                      const isReady = order.orderStatus === 'ready';

                      return (
                        <div
                          key={order.orderId}
                          className={`p-4 rounded-xl border-2 transition-all shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            isNew
                              ? 'bg-[#FAF6F0] border-[#D94A45] ring-2 ring-[#D94A45]/30'
                              : isReady
                              ? 'bg-[#F2F7EF] border-[#8FAF78]'
                              : isTimeExceeded
                              ? 'bg-[#FDF7DF] border-[#EFC958]'
                              : 'bg-[#FAF6F0] border-[#1D1916]'
                          }`}
                        >
                          {/* Order Main Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-syne font-black text-lg text-[#1D1916]">
                                #{order.orderId}
                              </span>

                              {/* Service Mode Badge */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-syne font-bold uppercase flex items-center gap-1 ${
                                  isDineIn ? 'bg-[#8FAF78] text-[#1D1916]' : 'bg-[#EFC958] text-[#1D1916]'
                                }`}
                              >
                                {isDineIn ? (
                                  <>
                                    <Utensils className="w-3 h-3" />
                                    <span>{order.tableNumber || 'Dine-In'}</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3 h-3" />
                                    <span>Pickup</span>
                                  </>
                                )}
                              </span>

                              {/* Order Status Badge */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-syne font-bold uppercase border ${
                                  isNew
                                    ? 'bg-[#D94A45] text-white border-[#D94A45] animate-pulse'
                                    : isReady
                                    ? 'bg-[#8FAF78] text-[#1D1916] border-[#1D1916]'
                                    : isPreparing
                                    ? 'bg-[#F4D35E] text-[#1D1916] border-[#1D1916]'
                                    : 'bg-white text-[#5A5048] border-black/20'
                                }`}
                              >
                                {order.orderStatus.toUpperCase()}
                              </span>

                              {isTimeExceeded && (
                                <span className="px-2 py-0.5 rounded bg-[#D94A45] text-white text-[10px] font-space font-bold uppercase flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>DELAYED</span>
                                </span>
                              )}
                            </div>

                            {/* Customer info line */}
                            <div className="flex flex-wrap items-center gap-3 text-xs font-space text-[#5A5048]">
                              <span className="font-bold text-[#1D1916] flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                {order.customerName}
                              </span>
                              {order.customerPhone && (
                                <a href={`tel:${order.customerPhone}`} className="hover:underline flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {order.customerPhone}
                                </a>
                              )}
                              <span>•</span>
                              <span>
                                {isDineIn ? `Serving: ${order.servingTime || 'ASAP'}` : `Pickup: ${order.pickupTime || 'ASAP'}`}
                              </span>
                            </div>

                            {/* Items list */}
                            <div className="text-xs font-space text-[#1D1916] bg-white/70 p-2.5 rounded-lg border border-[#1D1916]/10 space-y-0.5">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="font-medium">
                                    {it.quantity}× {it.menuItem.name}
                                    {it.options?.milk && (
                                      <span className="text-[11px] text-[#5A5048]"> ({it.options.milk})</span>
                                    )}
                                    {it.options?.extras && it.options.extras.length > 0 && (
                                      <span className="text-[10px] text-[#D94A45]"> +{it.options.extras.join(', ')}</span>
                                    )}
                                  </span>
                                  <span className="font-bold font-mono">
                                    ${(it.unitPrice * it.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              {order.customerNotes && (
                                <p className="text-[11px] text-[#D94A45] italic pt-1 border-t border-black/5">
                                  Note: “{order.customerNotes}”
                                </p>
                              )}
                              {order.customOwnerMessage && (
                                <p className="text-[11px] text-[#8FAF78] font-bold pt-1">
                                  Staff Update Sent: “{order.customOwnerMessage}”
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Controls & Timers */}
                          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                            {/* Live Countdown Clock */}
                            {(isPreparing || isNew || isConfirmed) && (
                              <div className="text-right">
                                <span className="text-[10px] font-space text-[#5A5048] block">Target Timer:</span>
                                <span
                                  className={`font-syne font-black text-base ${
                                    isTimeExceeded ? 'text-[#D94A45] animate-pulse' : 'text-[#1D1916]'
                                  }`}
                                >
                                  {isTimeExceeded ? `+${Math.abs(mins)}m overdue` : `${timeFormatted} remaining`}
                                </span>
                              </div>
                            )}

                            {/* Status Progression Buttons */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {isNew && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleAccept(order.orderId)}
                                    className="px-3 py-1.5 rounded-lg bg-[#8FAF78] text-[#1D1916] font-space font-bold text-xs shadow-2xs hover:bg-[#7D9D66] flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRejectOrderId(order.orderId)}
                                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D94A45] text-[#D94A45] font-space font-bold text-xs hover:bg-[#D94A45] hover:text-white"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {isConfirmed && (
                                <button
                                  type="button"
                                  onClick={() => handleStartPreparing(order.orderId)}
                                  className="px-3 py-1.5 rounded-lg bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs shadow-2xs hover:bg-[#2E2722] flex items-center gap-1"
                                >
                                  <Play className="w-3 h-3 text-[#EFC958]" />
                                  <span>Start Prep</span>
                                </button>
                              )}

                              {isPreparing && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleMarkReady(order.orderId)}
                                    className="px-3.5 py-1.5 rounded-lg bg-[#8FAF78] text-[#1D1916] font-space font-bold text-xs shadow-2xs hover:bg-[#7D9D66] flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Mark Ready</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setMessageOrderId(order.orderId)}
                                    className="p-1.5 rounded-lg bg-white border border-[#1D1916]/30 text-[#1D1916] text-xs hover:bg-black/5"
                                    title="Send Message to Customer"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAddMinutes(order.orderId, 5)}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-[#1D1916]/30 text-[10px] font-space font-bold text-[#1D1916] hover:bg-black/5"
                                    title="Add 5 mins delay"
                                  >
                                    +5m
                                  </button>
                                </>
                              )}

                              {isReady && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkCompleted(order.orderId)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs shadow-2xs hover:bg-[#2E2722] flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5 text-[#8FAF78]" />
                                  <span>Complete Order</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Settings Tab (Protected: OWNER / MANAGER only) */
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-2xl text-left">
                <div>
                  <h4 className="font-syne font-black text-xl text-[#1D1916] uppercase">
                    Café Operational Settings
                  </h4>
                  <p className="text-xs font-sans text-[#5A5048] mt-0.5">
                    Configure real-time kitchen behavior, service availability, prep times, and cloud synchronization.
                  </p>
                </div>

                {!isOwner && !isManager && (
                  <div className="p-3 rounded-xl bg-[#F4D35E]/20 border border-[#1D1916] text-xs font-space text-[#1D1916] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#1D1916] shrink-0" />
                    <span>
                      Notice: Store settings modifications are restricted to Owner and Manager accounts.
                    </span>
                  </div>
                )}

                {/* 1. Store Open / Closed Toggle */}
                <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-sm flex items-center justify-between">
                  <div>
                    <h5 className="font-syne font-bold text-sm uppercase text-[#1D1916]">Store Ordering Status</h5>
                    <p className="text-xs font-sans text-[#5A5048]">
                      {cafeSettings.isOpen ? 'Accepting new live orders from customers.' : 'Kitchen closed. Customers cannot place orders.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!isOwner && !isManager}
                    onClick={() => updateCafeSettings({ isOpen: !cafeSettings.isOpen })}
                    className={`px-4 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all disabled:opacity-50 ${
                      cafeSettings.isOpen ? 'bg-[#8FAF78] text-[#1D1916] shadow-sm' : 'bg-[#D94A45] text-white'
                    }`}
                  >
                    {cafeSettings.isOpen ? 'Open Now' : 'Closed'}
                  </button>
                </div>

                {/* 2. Estimated Preparation Time */}
                <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-syne font-bold text-sm uppercase text-[#1D1916]">Estimated Prep Time</h5>
                      <p className="text-xs font-sans text-[#5A5048]">Base calculation used for ASAP orders.</p>
                    </div>
                    <span className="font-syne font-black text-lg text-[#D94A45]">
                      {cafeSettings.estimatedPrepMinutes} mins
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {[10, 15, 20, 25, 30].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        disabled={!isOwner && !isManager}
                        onClick={() => updateCafeSettings({ estimatedPrepMinutes: mins })}
                        className={`flex-1 py-1.5 text-xs font-space font-bold rounded-lg border-2 disabled:opacity-50 ${
                          cafeSettings.estimatedPrepMinutes === mins
                            ? 'bg-[#1D1916] text-[#F6F0E6] border-[#1D1916]'
                            : 'bg-white text-[#1D1916] border-[#1D1916]/20'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Service Modes */}
                <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-sm space-y-3">
                  <h5 className="font-syne font-bold text-sm uppercase text-[#1D1916]">Service Channels</h5>

                  <div className="flex items-center justify-between pt-1 border-t border-black/5">
                    <span className="text-xs font-space font-bold text-[#1D1916]">☕ Dine-In Orders</span>
                    <button
                      type="button"
                      disabled={!isOwner && !isManager}
                      onClick={() => updateCafeSettings({ dineInEnabled: !cafeSettings.dineInEnabled })}
                      className={`px-3 py-1 rounded text-xs font-space font-bold disabled:opacity-50 ${
                        cafeSettings.dineInEnabled ? 'bg-[#8FAF78] text-[#1D1916]' : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {cafeSettings.dineInEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-black/5">
                    <span className="text-xs font-space font-bold text-[#1D1916]">🚶 Pickup Orders</span>
                    <button
                      type="button"
                      disabled={!isOwner && !isManager}
                      onClick={() => updateCafeSettings({ pickupEnabled: !cafeSettings.pickupEnabled })}
                      className={`px-3 py-1 rounded text-xs font-space font-bold disabled:opacity-50 ${
                        cafeSettings.pickupEnabled ? 'bg-[#8FAF78] text-[#1D1916]' : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {cafeSettings.pickupEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-black/5">
                    <div>
                      <span className="text-xs font-space font-bold text-[#1D1916]">🛵 Delivery Service</span>
                      <p className="text-[11px] text-[#5A5048]">
                        Architecture ready, kept disabled for customers per operational guidelines.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-space font-bold bg-gray-200 text-gray-600">
                      Disabled
                    </span>
                  </div>
                </div>

                {/* 4. Supabase Real-Time Cloud Connection */}
                <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#1D1916] shadow-brutal space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-syne font-bold text-sm uppercase text-[#1D1916] flex items-center gap-1.5">
                        <span>⚡ Supabase Database Connection</span>
                      </h5>
                      <p className="text-xs font-sans text-[#5A5048]">
                        Syncs orders in real time across devices using PostgreSQL and Row Level Security.
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-syne font-bold uppercase ${
                        isSupabaseConfigured() ? 'bg-[#8FAF78] text-[#1D1916]' : 'bg-[#F4D35E] text-[#1D1916]'
                      }`}
                    >
                      {isSupabaseConfigured() ? 'Connected' : 'Offline / Local'}
                    </span>
                  </div>

                  {isOwner && (
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-space font-bold text-[#1D1916] mb-1">
                          Supabase Project URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://your-project.supabase.co"
                          value={supabaseUrlInput}
                          onChange={(e) => setSupabaseUrlInput(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#1D1916]/30 rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-space font-bold text-[#1D1916] mb-1">
                          Supabase Anon / Public Key
                        </label>
                        <input
                          type="password"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          value={supabaseKeyInput}
                          onChange={(e) => setSupabaseKeyInput(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#1D1916]/30 rounded-lg font-mono"
                        />
                      </div>

                      {cloudSaveStatus && (
                        <p className="text-xs text-[#8FAF78] font-space font-bold">{cloudSaveStatus}</p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[10px] font-space text-[#5A5048]">
                          Database schema: <span className="font-mono">supabase/schema.sql</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
                            setCloudSaveStatus('Cloud credentials updated! Reconnecting...');
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#1D1916] text-[#F6F0E6] font-space font-bold text-xs shadow-sm hover:bg-[#2E2722]"
                        >
                          Save & Connect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Dialog: Forgot Password */}
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FAF6F0] p-6 rounded-2xl border-3 border-[#1D1916] shadow-brutal w-full max-w-sm space-y-4 text-left">
              <h4 className="font-syne font-bold text-base uppercase text-[#1D1916] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#8FAF78]" />
                <span>Reset Account Password</span>
              </h4>
              <p className="text-xs font-sans text-[#5A5048]">
                Enter your staff/owner email address to receive a secure password reset link via Supabase Auth:
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="owner@thelittlecup.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border-2 border-[#1D1916] rounded-xl font-sans focus:outline-none"
                />

                {resetStatus && (
                  <p
                    className={`text-xs font-space font-bold ${
                      resetStatus.includes('sent') ? 'text-[#8FAF78]' : 'text-[#D94A45]'
                    }`}
                  >
                    {resetStatus}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#1D1916] text-xs font-space font-bold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isResetSubmitting}
                    className="px-4 py-1.5 rounded-lg bg-[#1D1916] text-[#F6F0E6] text-xs font-space font-bold shadow-xs hover:bg-[#2E2722] disabled:opacity-50"
                  >
                    {isResetSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Dialog: Rejection Reason */}
        {rejectOrderId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FAF6F0] p-6 rounded-2xl border-3 border-[#D94A45] shadow-brutal w-full max-w-sm space-y-4 text-left">
              <h4 className="font-syne font-bold text-sm uppercase text-[#D94A45] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Reject Order #{rejectOrderId}</span>
              </h4>
              <p className="text-xs font-sans text-[#2E2722]">
                Select a cancellation reason to send to the customer:
              </p>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border-2 border-[#1D1916] rounded-xl font-sans"
              >
                <option value="Item temporarily sold out">Item temporarily sold out</option>
                <option value="Café at peak rush capacity">Café at peak rush capacity</option>
                <option value="Closing early today">Closing early today</option>
                <option value="Unable to fulfill custom request">Unable to fulfill custom request</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectOrderId(null)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#1D1916] text-xs font-space font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 rounded-lg bg-[#D94A45] text-white text-xs font-space font-bold shadow-xs"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Dialog: Send Customer Message */}
        {messageOrderId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FAF6F0] p-6 rounded-2xl border-3 border-[#1D1916] shadow-brutal w-full max-w-md space-y-4 text-left">
              <h4 className="font-syne font-bold text-sm uppercase text-[#1D1916] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#8FAF78]" />
                <span>Send Update to Customer (#{messageOrderId})</span>
              </h4>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-space font-bold text-[#5A5048] uppercase">
                  Quick Presets
                </label>
                <div className="space-y-1">
                  {[
                    'Your order is almost ready! ☕',
                    'Running 3-5 mins behind, thank you for your patience ❤️',
                    'Fresh milk being steamed right now ✨',
                    'Your table order is coming right over!',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPresetMessage(preset)}
                      className={`w-full text-left p-2 rounded-lg text-xs font-space border transition-all ${
                        presetMessage === preset
                          ? 'bg-[#8FAF78] text-[#1D1916] font-bold border-[#1D1916]'
                          : 'bg-white text-[#1D1916] border-black/10'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-space font-bold text-[#5A5048] uppercase mb-1">
                  Or Custom Message
                </label>
                <input
                  type="text"
                  placeholder="Type custom note for customer..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border-2 border-[#1D1916] rounded-xl font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMessageOrderId(null)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#1D1916] text-xs font-space font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="px-4 py-1.5 rounded-lg bg-[#1D1916] text-[#F6F0E6] text-xs font-space font-bold shadow-xs"
                >
                  Send Update →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
