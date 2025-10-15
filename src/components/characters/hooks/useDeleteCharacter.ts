import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for deleting a player character
 * Uses simplified endpoint without campaign_id in URL
 */
export const useDeleteCharacter = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterId: string) => {
      const response = await fetch(`/api/characters/${characterId}`, { method: "DELETE" });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns", campaignId, "characters"],
      });
    },
  });
};
