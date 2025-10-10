import { useQuery } from "@tanstack/react-query";
import type { ListPlayerCharactersResponseDTO, PlayerCharacterDTO } from "@/types";

/**
 * React Query hook for fetching characters in a campaign
 * @param campaignId - The ID of the campaign
 * @param options - Additional query options
 */
export function useCampaignCharactersQuery(
  campaignId: string | null | undefined,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["campaign", campaignId, "characters"],
    queryFn: async (): Promise<PlayerCharacterDTO[]> => {
      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      const response = await fetch(`/api/campaigns/${campaignId}/characters`, {
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
        // Campaign not found or no characters
        return [];
      }

      if (!response.ok) {
        throw new Error("Failed to fetch characters");
      }

      const data: ListPlayerCharactersResponseDTO = await response.json();
      return data.characters;
    },
    enabled: !!campaignId && (options?.enabled ?? true),
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}
