import { useState, useEffect } from "react";
import type { Campaign } from "@/types";

interface UseSelectedCampaignReturn {
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
}

const STORAGE_KEY = "selectedCampaignId";

export function useSelectedCampaign(campaigns: Campaign[]): UseSelectedCampaignReturn {
  // Initialize to null to match server-side rendering
  const [selectedCampaignId, setSelectedCampaignIdState] = useState<string | null>(null);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      setSelectedCampaignIdState(storedId);
    }
  }, []);

  // Sync to localStorage when state changes
  useEffect(() => {
    if (selectedCampaignId) {
      localStorage.setItem(STORAGE_KEY, selectedCampaignId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedCampaignId]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setSelectedCampaignIdState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Validate that selectedCampaignId exists in campaigns
  useEffect(() => {
    if (selectedCampaignId && campaigns.length > 0) {
      const exists = campaigns.some((c) => c.id === selectedCampaignId);
      if (!exists) {
        // Clear invalid selection
        setSelectedCampaignIdState(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [selectedCampaignId, campaigns]);

  return {
    selectedCampaignId,
    setSelectedCampaignId: setSelectedCampaignIdState,
  };
}
