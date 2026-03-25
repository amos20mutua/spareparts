import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient = null;

function isLikelySupabaseUrl(value) {
  return typeof value === 'string' && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value.trim());
}

function isLikelySupabaseKey(value) {
  return typeof value === 'string' && value.trim().length > 40;
}

export const isSupabaseConfigured = isLikelySupabaseUrl(supabaseUrl) && isLikelySupabaseKey(supabaseAnonKey);

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.error('Supabase client initialization failed.', error);
    supabaseClient = null;
  }
} else if (supabaseUrl || supabaseAnonKey) {
  console.error('Supabase environment variables are present but invalid. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = supabaseClient;

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  return supabase;
}
