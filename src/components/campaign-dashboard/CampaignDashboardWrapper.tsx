import { HydrationBoundary, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { useState } from "react";
import { getQueryClient } from "@/lib/queryClient";
import { CampaignDashboardContentReactQuery } from "./CampaignDashboardContentReactQuery";
import type { CampaignDashboardContentProps } from "@/types/campaign-dashboard";

interface CampaignDashboardWrapperProps extends CampaignDashboardContentProps {
  dehydratedState?: DehydratedState;
}

/**
 * Wrapper component that provides React Query context to CampaignDashboard
 * Accepts dehydrated state from server-side prefetching for SSR hydration
 *
 * Pattern: Each Astro island gets its own QueryClientProvider + HydrationBoundary
 * but all share the same singleton QueryClient instance via getQueryClient()
 */
export function CampaignDashboardWrapper({
  initialCampaign,
  initialCharactersCount,
  dehydratedState,
}: CampaignDashboardWrapperProps) {
  // Get singleton QueryClient instance (shared across all islands)
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <CampaignDashboardContentReactQuery
          initialCampaign={initialCampaign}
          initialCharactersCount={initialCharactersCount}
        />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
