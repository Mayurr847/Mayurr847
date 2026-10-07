import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { UserRole, UserProfile } from '../types/auth';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export const normalizeRole = (roleStr?: string | null): UserRole => {
  if (!roleStr) return 'CUSTOMER';
  const upper = roleStr.trim().toUpperCase();
  if (upper === 'OWNER') return 'OWNER';
  if (upper === 'MANAGER') return 'MANAGER';
  if (upper === 'STAFF') return 'STAFF';
  return 'CUSTOMER';
};

class AuthService {
  public async getCurrentUser(): Promise<User | null> {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) return null;

    try {
      const {
        data: { user },
        error,
      } = await client.auth.getUser();
      if (error || !user) return null;
      return user;
    } catch {
      return null;
    }
  }

  public async getCurrentProfile(): Promise<UserProfile | null> {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) return null;

    try {
      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();

      if (userError || !user) return null;

      // Query database profiles table to get server-enforced role
      const { data: profileData, error: profileError } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        // Fallback default role
        return {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
          role: 'CUSTOMER',
          createdAt: user.created_at,
        };
      }

      return {
        id: profileData.id,
        email: profileData.email,
        fullName: profileData.full_name || user.user_metadata?.full_name || '',
        role: normalizeRole(profileData.role),
        createdAt: profileData.created_at,
      };
    } catch (err) {
      console.error('Error fetching current profile from database:', err);
      return null;
    }
  }

  public async signIn(email: string, password: string): Promise<{ user: User | null; profile: UserProfile | null; error: string | null }> {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return {
        user: null,
        profile: null,
        error: 'Supabase Cloud is not configured. Please check your Supabase credentials in settings.',
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        return {
          user: null,
          profile: null,
          error: error.message || 'Invalid email or password.',
        };
      }

      if (!data.user) {
        return {
          user: null,
          profile: null,
          error: 'Authentication failed. Please check your credentials.',
        };
      }

      // Fetch the role from the profiles table
      const { data: profileRow } = await client
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: profileRow?.full_name || data.user.user_metadata?.full_name || '',
        role: normalizeRole(profileRow?.role),
        createdAt: profileRow?.created_at || data.user.created_at,
      };

      return {
        user: data.user,
        profile,
        error: null,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      return {
        user: null,
        profile: null,
        error: message,
      };
    }
  }

  public async signOut(): Promise<{ error: string | null }> {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await client.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign out.';
      return { error: message };
    }
  }

  public async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase Cloud is not configured.',
      };
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send password reset email.';
      return { success: false, error: message };
    }
  }

  public hasRole(role: UserRole | null | undefined, allowedRoles: UserRole[]): boolean {
    if (!role) return false;
    return allowedRoles.includes(role);
  }

  public onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): (() => void) {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return () => {};
    }

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}

export const authService = new AuthService();
export default authService;
