// React Query hook for fetching combat data

import { useQuery } from "@tanstack/react-query";
import type { CombatDTO } from "@/types";

/**
 * Fetch combat by ID
 * @param combatId Combat UUID
 * @returns React Query result with combat data
 */
export function useCombat(combatId: string) {
  return useQuery({
    queryKey: ["combat", combatId],
    queryFn: async () => {
      const response = await fetch(`/api/combats/${combatId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch combat");
      }

      return response.json() as Promise<CombatDTO>;
    },
    staleTime: 0, // Zawsze świeże (real-time state)
    refetchOnWindowFocus: false, // Nie refetch przy focus (mamy Zustand)
  });
}
