import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdatePlayerCharacterCommand, PlayerCharacterDTO } from "@/types";

/**
 * Hook for updating an existing player character
 */
export const useUpdateCharacter = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      data,
    }: {
      characterId: string;
      data: UpdatePlayerCharacterCommand;
    }) => {
      const response = await fetch(
        `/api/campaigns/${campaignId}/characters/${characterId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

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
