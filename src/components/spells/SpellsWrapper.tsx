import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { getQueryClient } from "@/lib/queryClient";
import { SpellsLibraryView } from "./SpellsLibraryView";

/**
 * Wrapper component that provides React Query context to SpellsLibraryView
 *
 * Pattern: Each Astro island gets its own QueryClientProvider
 * but all share the same singleton QueryClient instance via getQueryClient()
 *
 * This ensures:
 * - React Query hooks work properly (QueryClient is available in context)
 * - Cache persists across client-side navigation
 * - SSR safety (new instance per request on server)
 */
export function SpellsWrapper() {
  // Get singleton QueryClient instance (shared across all islands)
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SpellsLibraryView />
    </QueryClientProvider>
  );
}
