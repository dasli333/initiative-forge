import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queryClient";
import { CombatsListView } from "./CombatsListView";

interface CombatsListWrapperProps {
  campaignId: string;
  campaignName: string;
  dehydratedState: DehydratedState;
}

export function CombatsListWrapper({ campaignId, campaignName, dehydratedState }: CombatsListWrapperProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <CombatsListView campaignId={campaignId} campaignName={campaignName} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
