import { useEffect } from "react";
import { initAuthListener, useAuthStore } from "@/stores/authStore";

/**
 * AuthInitializer component
 *
 * Initializes authentication state management on app mount:
 * 1. Sets up Supabase auth state change listener for real-time sync
 * 2. Checks current auth session and hydrates store
 * 3. Enables multi-tab synchronization
 *
 * This component renders nothing (invisible infrastructure).
 * Should be mounted once in MainLayout with client:only="react"
 */
export function AuthInitializer() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Initialize the auth state change listener (multi-tab sync)
    initAuthListener();

    // Check current session and hydrate store
    checkAuth();
  }, [checkAuth]);

  // No UI - this is infrastructure only
  return null;
}
