import { HydrationBoundary, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { useState } from "react";
import { getQueryClient } from "@/lib/queryClient";
import { PlayerCharactersView } from "./PlayerCharactersView";

interface PlayerCharactersWrapperProps {
  campaignId: string;
  initialCampaignName?: string;
  dehydratedState?: DehydratedState;
}

/**
 * Wrapper component that provides React Query context to PlayerCharactersView
 * Accepts dehydrated state from server-side prefetching for SSR hydration
 *
 * Pattern: Each Astro island gets its own QueryClientProvider + HydrationBoundary
 * but all share the same singleton QueryClient instance via getQueryClient()
 */
export function PlayerCharactersWrapper({
  campaignId,
  initialCampaignName,
  dehydratedState,
}: PlayerCharactersWrapperProps) {
  // Get singleton QueryClient instance (shared across all islands)
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <PlayerCharactersView campaignId={campaignId} initialCampaignName={initialCampaignName} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
