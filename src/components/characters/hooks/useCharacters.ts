import { useQuery } from "@tanstack/react-query";
import type { ListPlayerCharactersResponseDTO } from "@/types";

/**
 * Hook for fetching player characters for a campaign
 */
export const useCharacters = (campaignId: string) => {
  return useQuery({
    queryKey: ["campaigns", campaignId, "characters"],
    queryFn: async () => {
      const response = await fetch(`/api/campaigns/${campaignId}/characters`);

      if (!response.ok) {
        throw new Error("Failed to fetch characters");
      }

      const data: ListPlayerCharactersResponseDTO = await response.json();
      return data.characters;
    },
    enabled: !!campaignId,
  });
};
