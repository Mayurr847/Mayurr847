import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or fallback local storage config
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (
    envUrl &&
    envKey &&
    !envUrl.includes('your-project-id') &&
    !envUrl.includes('your-project.supabase.co') &&
    !envKey.includes('your-anon-key-here')
  ) {
    return { url: envUrl.trim().replace(/\/+$/, ''), key: envKey.trim() };
  }

  // Also check local runtime configuration if owner set it in settings
  try {
    const customUrl = localStorage.getItem('the_little_cup_supabase_url');
    const customKey = localStorage.getItem('the_little_cup_supabase_key');
    if (customUrl && customKey) {
      return { url: customUrl.trim().replace(/\/+$/, ''), key: customKey.trim() };
    }
  } catch {
    // ignore
  }

  return { url: '', key: '' };
};

export const isSupabaseConfigured = (): boolean => {
  const current = getSupabaseConfig();
  return Boolean(current.url && current.key && current.url.startsWith('https://'));
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (clientInstance) return clientInstance;
  const config = getSupabaseConfig();
  if (config.url && config.key && config.url.startsWith('https://')) {
    clientInstance = createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    return clientInstance;
  }
  return null;
};

export const supabase = getSupabaseClient();

export const setCustomSupabaseConfig = (url: string, key: string) => {
  try {
    if (url && key) {
      localStorage.setItem('the_little_cup_supabase_url', url.trim());
      localStorage.setItem('the_little_cup_supabase_key', key.trim());
    } else {
      localStorage.removeItem('the_little_cup_supabase_url');
      localStorage.removeItem('the_little_cup_supabase_key');
    }
    clientInstance = null;
    window.location.reload();
  } catch (e) {
    console.error('Failed to save custom supabase config', e);
  }
};
