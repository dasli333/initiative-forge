import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================================================
// TESTING MODE: Comment/uncomment the appropriate client below
// ============================================================================

// 🔧 FOR TESTING: Uses service role key, bypasses RLS
// Uncomment this when you want to test without authentication/RLS
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 🔒 FOR PRODUCTION: Uses anon key, respects RLS
// Comment out the testing version above and uncomment this for normal use
// export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ============================================================================

export type SupabaseClient = typeof supabaseClient;

export const DEFAULT_USER_ID = "a461901c-a6c8-4167-8073-085424bc2dca";
