import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Client-side Supabase client for use in React components
 * Uses PUBLIC_ prefixed environment variables that are safe to expose to the browser
 * This client uses the anon key and respects Row Level Security (RLS)
 */

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your .env file"
  );
}

export const supabaseBrowserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type SupabaseBrowserClient = typeof supabaseBrowserClient;
