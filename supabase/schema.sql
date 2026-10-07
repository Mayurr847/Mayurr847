-- ==============================================================================
-- THE LITTLE CUP — SUPABASE SECURE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Sequence for Order Numbers (e.g. 1024, 1025...)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1024 INCREMENT BY 1;

-- 3. PROFILES TABLE (Associated with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Safely drop old constraint if present and apply case-insensitive check constraint
DO $$
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (LOWER(role) IN ('owner', 'manager', 'staff', 'customer'));
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 4. ORDERS TABLE (Core Order Entity)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL DEFAULT nextval('order_number_seq')::TEXT,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'pickup', 'delivery')),
    
    -- Service specifics
    table_number TEXT,
    serving_time TEXT,
    pickup_time TEXT,
    pickup_location TEXT DEFAULT 'The Little Cup • Iscon Cross Roads, SG Hwy',
    
    -- Order items & amounts
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Status lifecycle
    order_status TEXT NOT NULL DEFAULT 'new' CHECK (order_status IN ('new', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'delayed')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'pay_at_counter', 'refunded')),
    payment_method TEXT NOT NULL DEFAULT 'apple_pay' CHECK (payment_method IN ('apple_pay', 'card', 'pickup')),
    
    -- Notes & Messages
    customer_notes TEXT,
    owner_notes TEXT,
    custom_owner_message TEXT,
    cancellation_reason TEXT,
    
    -- Timestamps (UTC)
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    requested_serving_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    estimated_ready_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    actual_ready_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- 5. CAFÉ SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.cafe_settings (
    id INT PRIMARY KEY DEFAULT 1,
    is_open BOOLEAN NOT NULL DEFAULT true,
    estimated_prep_minutes INT NOT NULL DEFAULT 15,
    max_orders_per_slot INT NOT NULL DEFAULT 8,
    max_advance_hours INT NOT NULL DEFAULT 24,
    dine_in_enabled BOOLEAN NOT NULL DEFAULT true,
    pickup_enabled BOOLEAN NOT NULL DEFAULT true,
    delivery_enabled BOOLEAN NOT NULL DEFAULT false,
    delivery_config JSONB NOT NULL DEFAULT '{"enabled": false, "radiusKm": 5, "baseFee": 3.5, "perKmFee": 0.75, "minOrderAmount": 15.0}'::jsonb,
    auto_accept_orders BOOLEAN NOT NULL DEFAULT false,
    sound_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
    cafe_timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed Initial Settings Row
INSERT INTO public.cafe_settings (id, is_open, estimated_prep_minutes, max_orders_per_slot, dine_in_enabled, pickup_enabled, delivery_enabled)
VALUES (1, true, 15, 8, true, true, false)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 6. SECURITY HELPER FUNCTIONS (SECURITY DEFINER to safely check roles)
-- ==============================================================================

-- Helper: Get user's role from public.profiles without recursive policy triggers
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    IF user_uuid IS NULL THEN
        RETURN 'ANONYMOUS';
    END IF;
    
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = user_uuid;
    
    RETURN COALESCE(user_role, 'CUSTOMER');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper: Is user Staff, Manager, or Owner? (Case-insensitive)
CREATE OR REPLACE FUNCTION public.is_staff_or_owner(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN LOWER(public.get_user_role(user_uuid)) IN ('staff', 'manager', 'owner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper: Is user Manager or Owner? (Case-insensitive)
CREATE OR REPLACE FUNCTION public.is_owner_or_manager(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN LOWER(public.get_user_role(user_uuid)) IN ('manager', 'owner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper: Is user Owner? (Case-insensitive)
CREATE OR REPLACE FUNCTION public.is_owner(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN LOWER(public.get_user_role(user_uuid)) = 'owner';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==============================================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_settings ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY POLICIES: PROFILES TABLE
-- ==============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles read access" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update access" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insert access" ON public.profiles;
DROP POLICY IF EXISTS "Profiles delete access" ON public.profiles;

-- SELECT: Users can read their own profile; Staff/Owner can read all profiles
CREATE POLICY "Profiles read access"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id
        OR public.is_staff_or_owner(auth.uid())
    );

-- INSERT: Only self-registration with default CUSTOMER role (or system trigger)
CREATE POLICY "Profiles insert access"
    ON public.profiles FOR INSERT
    WITH CHECK (
        auth.uid() = id
        AND LOWER(role) = 'customer'
    );

-- UPDATE: Users can update their own name/email, but CANNOT escalate their own role. Only OWNER can change roles.
CREATE POLICY "Profiles update access"
    ON public.profiles FOR UPDATE
    USING (
        auth.uid() = id
        OR public.is_owner(auth.uid())
    )
    WITH CHECK (
        public.is_owner(auth.uid())
        OR (auth.uid() = id AND LOWER(role) = LOWER(public.get_user_role(auth.uid())))
    );

-- DELETE: Only Owner can delete user profiles
CREATE POLICY "Profiles delete access"
    ON public.profiles FOR DELETE
    USING (public.is_owner(auth.uid()));

-- ==============================================================================
-- 9. ROW LEVEL SECURITY POLICIES: ORDERS TABLE
-- ==============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Orders are readable by customers and staff" ON public.orders;
DROP POLICY IF EXISTS "Staff and customers can update orders" ON public.orders;
DROP POLICY IF EXISTS "Orders select policy" ON public.orders;
DROP POLICY IF EXISTS "Orders insert policy" ON public.orders;
DROP POLICY IF EXISTS "Orders update policy" ON public.orders;
DROP POLICY IF EXISTS "Orders delete policy" ON public.orders;

-- SELECT:
-- 1. Staff/Manager/Owner can view all orders.
-- 2. Authenticated customers can view their own orders (customer_id = auth.uid()).
-- 3. Unauthenticated guest checkout lookup (orders without customer_id).
CREATE POLICY "Orders select policy"
    ON public.orders FOR SELECT
    USING (
        public.is_staff_or_owner(auth.uid())
        OR (customer_id IS NOT NULL AND customer_id = auth.uid())
        OR (customer_id IS NULL)
    );

-- INSERT:
-- Anyone (guest or customer) can place a new order.
CREATE POLICY "Orders insert policy"
    ON public.orders FOR INSERT
    WITH CHECK (
        (customer_id IS NULL OR customer_id = auth.uid())
        AND order_status = 'new'
    );

-- UPDATE:
-- 1. Staff, Manager, Owner can update order status, notes, messages, timestamps.
-- 2. Customer can ONLY cancel their own order if order_status is 'new' or 'confirmed'.
CREATE POLICY "Orders update policy"
    ON public.orders FOR UPDATE
    USING (
        public.is_staff_or_owner(auth.uid())
        OR (
            (customer_id = auth.uid() OR customer_id IS NULL)
            AND order_status IN ('new', 'confirmed')
        )
    )
    WITH CHECK (
        public.is_staff_or_owner(auth.uid())
        OR (
            order_status = 'cancelled'
        )
    );

-- DELETE:
-- Only Owner can delete order history records.
CREATE POLICY "Orders delete policy"
    ON public.orders FOR DELETE
    USING (public.is_owner(auth.uid()));

-- ==============================================================================
-- 10. ROW LEVEL SECURITY POLICIES: CAFÉ SETTINGS TABLE
-- ==============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Settings are readable by all" ON public.cafe_settings;
DROP POLICY IF EXISTS "Settings are updatable by staff only" ON public.cafe_settings;
DROP POLICY IF EXISTS "Settings select policy" ON public.cafe_settings;
DROP POLICY IF EXISTS "Settings update policy" ON public.cafe_settings;

-- SELECT: Publicly readable by all users (for menu hours, prep time, service status)
CREATE POLICY "Settings select policy"
    ON public.cafe_settings FOR SELECT
    USING (true);

-- UPDATE: Only Owner and Manager can modify store parameters
CREATE POLICY "Settings update policy"
    ON public.cafe_settings FOR UPDATE
    USING (public.is_owner_or_manager(auth.uid()))
    WITH CHECK (public.is_owner_or_manager(auth.uid()));

-- ==============================================================================
-- 11. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
-- Force role = 'CUSTOMER' (case-insensitive safe).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        'CUSTOMER'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 12. ENABLE SUPABASE REALTIME REPLICATION (SAFE CONDITIONAL ADD)
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'cafe_settings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.cafe_settings;
    END IF;
END $$;
