import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";
import { AppProviders } from "@/providers/AppProviders";
import { CampaignsContentReactQuery } from "./CampaignsContentReactQuery";

interface CampaignsWrapperProps {
  dehydratedState?: DehydratedState;
}

/**
 * Wrapper component that provides React Query context to CampaignsContent
 * Accepts dehydrated state from server-side prefetching for SSR hydration
 */
export function CampaignsWrapper({ dehydratedState }: CampaignsWrapperProps) {
  return (
    <AppProviders>
      <HydrationBoundary state={dehydratedState}>
        <CampaignsContentReactQuery />
      </HydrationBoundary>
    </AppProviders>
  );
}
