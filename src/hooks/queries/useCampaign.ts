import { useQuery } from "@tanstack/react-query";
import type { CampaignDTO } from "@/types";

/**
 * React Query hook for fetching a single campaign
 * @param campaignId - The ID of the campaign to fetch
 * @param options - Additional query options
 */
export function useCampaignQuery(
  campaignId: string | null | undefined,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async (): Promise<CampaignDTO> => {
      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (response.status === 404) {
        throw new Error("Campaign not found");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch campaign");
      }

      return await response.json();
    },
    enabled: !!campaignId && (options?.enabled ?? true),
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}
