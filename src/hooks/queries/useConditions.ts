// React Query hook for fetching D&D 5e conditions

import { useQuery } from "@tanstack/react-query";
import type { ConditionDTO, ListConditionsResponseDTO } from "@/types";

/**
 * Fetch all D&D 5e conditions
 * Conditions are static reference data, so we cache indefinitely
 * @returns React Query result with conditions array
 */
export function useConditions() {
  return useQuery({
    queryKey: ["conditions"],
    queryFn: async () => {
      const response = await fetch("/api/conditions");

      if (!response.ok) {
        throw new Error("Failed to fetch conditions");
      }

      const data: ListConditionsResponseDTO = await response.json();
      return data.conditions as ConditionDTO[];
    },
    staleTime: Infinity, // Warunki nie zmieniają się
  });
}
