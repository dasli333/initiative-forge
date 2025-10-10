import { useState, useEffect } from "react";
import type { Campaign, ListCampaignsResponseDTO } from "@/types";

interface UseCampaignsReturn {
  campaigns: Campaign[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCampaigns(): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = async () => {
    console.log("[useCampaigns] Starting fetch...");
    setIsLoading(true);
    setError(null);

    try {
      console.log("[useCampaigns] Fetching /api/campaigns...");
      const response = await fetch("/api/campaigns?limit=100&offset=0", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("[useCampaigns] Response status:", response.status);

      if (response.status === 401) {
        console.log("[useCampaigns] Unauthorized, redirecting to login");
        // Redirect to login (może być handled przez middleware)
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const data: ListCampaignsResponseDTO = await response.json();
      console.log("[useCampaigns] Campaigns loaded:", data.campaigns.length, "campaigns");
      setCampaigns(data.campaigns);
    } catch (err) {
      console.error("[useCampaigns] Error loading campaigns:", err);
      setError(err instanceof Error ? err : new Error("Failed to load campaigns"));
    } finally {
      console.log("[useCampaigns] Fetch complete, setting isLoading to false");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("[useCampaigns] Hook mounted, calling fetchCampaigns");
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    isLoading,
    error,
    refetch: fetchCampaigns,
  };
}
