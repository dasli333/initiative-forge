import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePlayerCharacterCommand, PlayerCharacterDTO } from "@/types";

/**
 * Hook for creating a new player character
 */
export const useCreateCharacter = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePlayerCharacterCommand) => {
      const response = await fetch(`/api/campaigns/${campaignId}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json() as Promise<PlayerCharacterDTO>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns", campaignId, "characters"],
      });
    },
  });
};
