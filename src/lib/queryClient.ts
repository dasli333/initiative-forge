import { QueryClient } from "@tanstack/react-query";

/**
 * Browser-side singleton QueryClient instance
 * This ensures cache persists across client-side navigation
 */
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Gets or creates a QueryClient instance
 *
 * Important behavior:
 * - Server-side (SSR): Always creates a NEW instance to avoid data leaking between users
 * - Browser-side: Reuses the SAME instance to persist cache across View Transitions
 *
 * This pattern ensures:
 * - SSR safety (no shared state between requests)
 * - Client-side cache persistence (no data loss on navigation)
 */
export function getQueryClient(): QueryClient {
  // Server: Always create a new QueryClient for each request
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  // Browser: Reuse existing QueryClient instance
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

/**
 * Creates a new QueryClient with optimized defaults
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 10 minutes (increased from 1 min)
        // This is safe because mutations invalidate cache when data changes
        staleTime: 10 * 60 * 1000,

        // Keep inactive data in cache for 15 minutes
        gcTime: 15 * 60 * 1000,

        // Only retry once on failure
        retry: 1,

        // Don't refetch on window focus by default
        // User mutations will invalidate queries anyway
        refetchOnWindowFocus: false,

        // Always refetch on reconnect (network recovery)
        refetchOnReconnect: "always",
      },
      mutations: {
        // Don't retry mutations by default (they should be idempotent or handled by user)
        retry: 0,
      },
    },
  });
}
