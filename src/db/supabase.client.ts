import type { AstroCookies } from "astro";
import { createServerClient, createBrowserClient } from "@supabase/ssr";
import type { CookieOptionsWithName } from "@supabase/ssr";

import type { Database } from "./database.types";

// ============================================================================
// COOKIE OPTIONS
// ============================================================================

export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

// ============================================================================
// HELPER FUNCTION: Parse Cookie Header
// ============================================================================

function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

// ============================================================================
// SERVER CLIENT (SSR) - For Astro middleware and pages
// ============================================================================

export const createSupabaseServerInstance = (context: { headers: Headers; cookies: AstroCookies }) => {
  const supabase = createServerClient<Database>(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => context.cookies.set(name, value, options));
      },
    },
  });

  return supabase;
};

// ============================================================================
// BROWSER CLIENT - For React components
// ============================================================================

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const createSupabaseBrowserClient = () => {
  // Singleton pattern - reuse client in browser
  if (typeof window !== "undefined" && browserClient) {
    return browserClient;
  }

  const client = createBrowserClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  if (typeof window !== "undefined") {
    browserClient = client;
  }

  return client;
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SupabaseClient = ReturnType<typeof createSupabaseServerInstance>;
