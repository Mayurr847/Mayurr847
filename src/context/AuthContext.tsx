/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import type { UserRole, UserProfile } from '../types/auth';
import { authService, normalizeRole } from '../services/authService';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isStaffOrOwner: boolean;
  isOwner: boolean;
  isManager: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error: string | null; role?: UserRole }>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; error: string | null }>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfileForUser = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setUser(authUser);
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: data.email || authUser.email || '',
          fullName: data.full_name || authUser.user_metadata?.full_name || '',
          role: normalizeRole(data.role),
          createdAt: data.created_at,
        });
      } else {
        // If profile row doesn't exist yet or query had an error, fallback safely to CUSTOMER
        setProfile({
          id: authUser.id,
          email: authUser.email || '',
          fullName: authUser.user_metadata?.full_name || '',
          role: 'CUSTOMER',
          createdAt: authUser.created_at,
        });
      }
    } catch (err) {
      console.error('Error in fetchProfileForUser:', err);
      setProfile({
        id: authUser.id,
        email: authUser.email || '',
        fullName: authUser.user_metadata?.full_name || '',
        role: 'CUSTOMER',
        createdAt: authUser.created_at,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) return;
    try {
      const {
        data: { user: currentUser },
      } = await client.auth.getUser();
      await fetchProfileForUser(currentUser);
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  }, [fetchProfileForUser]);

  // Initial auth check & onAuthStateChange subscription
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const client = getSupabaseClient();
      if (!client || !isSupabaseConfigured()) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const {
          data: { user: currentUser },
        } = await client.auth.getUser();
        if (mounted) {
          await fetchProfileForUser(currentUser);
        }
      } catch (e) {
        console.error('Error during initial auth check:', e);
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    const unsub = authService.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      } else if (session?.user) {
        await fetchProfileForUser(session.user);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [fetchProfileForUser]);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    const result = await authService.signIn(email, pass);
    if (result.error || !result.user) {
      setIsLoading(false);
      return { success: false, error: result.error || 'Authentication failed' };
    }

    setUser(result.user);
    setProfile(result.profile);
    setIsLoading(false);
    return {
      success: true,
      error: null,
      role: result.profile?.role || 'CUSTOMER',
    };
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  const sendPasswordResetEmail = async (email: string) => {
    return authService.sendPasswordResetEmail(email);
  };

  const role = profile?.role || null;
  const isAuthenticated = Boolean(user && profile);
  const isStaffOrOwner = useMemo(() => {
    return role === 'OWNER' || role === 'MANAGER' || role === 'STAFF';
  }, [role]);
  const isOwner = role === 'OWNER';
  const isManager = role === 'MANAGER';
  const isStaff = role === 'STAFF';
  const isCustomer = role === 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        isAuthenticated,
        isStaffOrOwner,
        isOwner,
        isManager,
        isStaff,
        isCustomer,
        signIn,
        signOut,
        sendPasswordResetEmail,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
