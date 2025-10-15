// React Query mutation for saving combat snapshot

import { useMutation } from "@tanstack/react-query";
import type { CombatSnapshotDTO } from "@/types";

/**
 * Save combat snapshot mutation
 * @param combatId Combat UUID
 * @returns React Query mutation for saving snapshot
 */
export function useSaveSnapshot(combatId: string) {
  return useMutation({
    mutationFn: async ({ snapshot, round }: { snapshot: CombatSnapshotDTO; round: number }) => {
      const response = await fetch(`/api/combats/${combatId}/snapshot`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state_snapshot: snapshot,
          current_round: round,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save snapshot");
      }

      return response.json();
    },
  });
}
