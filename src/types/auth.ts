import type { User } from '@supabase/supabase-js';

export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'CUSTOMER';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthState {
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
}
