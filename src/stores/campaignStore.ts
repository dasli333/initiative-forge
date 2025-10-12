import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CampaignStore {
  // State - only store the ID, not the full campaign object
  // Use React Query (useCampaignQuery) to fetch the actual campaign data
  selectedCampaignId: string | null;

  // Actions
  setSelectedCampaignId: (id: string | null) => void;
  clearSelection: () => void;
}

/**
 * Global store for managing the currently selected campaign ID
 * This store is used across the entire application to know which campaign is active
 *
 * Design decisions:
 * - Only stores the campaign ID, not the full campaign object
 * - Full campaign data should be fetched using React Query's useCampaignQuery(selectedCampaignId)
 * - This prevents data staleness issues and keeps a single source of truth (React Query cache)
 *
 * Uses localStorage persistence to sync state across different React islands in Astro
 * Important: This store is only used on the client side, not during SSR
 */
export const useCampaignStore = create<CampaignStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedCampaignId: null,

        // Actions
        setSelectedCampaignId: (id) => set({ selectedCampaignId: id }, false, "setSelectedCampaignId"),

        clearSelection: () => set({ selectedCampaignId: null }, false, "clearSelection"),
      }),
      {
        name: "campaign-storage", // name for localStorage key
        partialize: (state) => ({
          // Persist only the ID
          selectedCampaignId: state.selectedCampaignId,
        }),
      }
    ),
    {
      name: "campaign-store",
    }
  )
);
