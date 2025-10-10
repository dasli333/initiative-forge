import { useState, useEffect } from "react";
import type { ActiveCombatViewModel } from "@/types";

interface UseActiveCombatReturn {
  activeCombat: ActiveCombatViewModel | null;
  isLoading: boolean;
  error: Error | null;
}

export function useActiveCombat(selectedCampaignId: string | null): UseActiveCombatReturn {
  const [activeCombat, setActiveCombat] = useState<ActiveCombatViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedCampaignId) {
      setActiveCombat(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchActiveCombat() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/combats?campaign_id=${selectedCampaignId}&status=active`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          // Normal case - no active combat
          setActiveCombat(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch active combat");
        }

        const data = await response.json();
        const combat = data.combats?.[0];

        if (combat) {
          setActiveCombat({
            combat_id: combat.id,
            campaign_id: combat.campaign_id,
            status: "active",
          });
        } else {
          setActiveCombat(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request cancelled - ignore
          return;
        }
        // Silent fail - show disabled state for Combat nav item
        setActiveCombat(null);
        setError(err instanceof Error ? err : new Error("Failed to load active combat"));
        console.error("Error loading active combat:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveCombat();

    return () => {
      controller.abort();
    };
  }, [selectedCampaignId]);

  return {
    activeCombat,
    isLoading,
    error,
  };
}
