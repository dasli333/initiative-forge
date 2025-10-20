import { defineMiddleware } from "astro:middleware";

import { createSupabaseServerInstance } from "../db/supabase.client";

// ============================================================================
// PUBLIC PATHS - No authentication required
// ============================================================================

const PUBLIC_PATHS = [
  // Auth pages
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/callback",
];

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, cookies, url, request } = context;

  // Create Supabase server instance with cookie support
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Make supabase available in context.locals
  locals.supabase = supabase;

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => url.pathname.startsWith(path));

  // IMPORTANT: Always get user session first before any operations
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Set user in locals if authenticated
  if (user) {
    locals.user = {
      id: user.id,
      email: user.email!,
    };

    // Redirect authenticated users away from login page
    if (url.pathname === "/auth/login") {
      return context.redirect("/campaigns");
    }
  } else {
    // User not authenticated
    locals.user = null;

    // Redirect to login for protected routes
    if (!isPublicPath) {
      const redirectUrl = url.pathname + url.search;
      return context.redirect(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }

  return next();
});
