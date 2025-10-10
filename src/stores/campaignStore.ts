import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { CampaignDTO } from "@/types";

interface CampaignStore {
  // State
  selectedCampaignId: string | null;
  selectedCampaign: CampaignDTO | null;

  // Actions
  setSelectedCampaignId: (id: string | null) => void;
  setSelectedCampaign: (campaign: CampaignDTO | null) => void;
  clearSelection: () => void;
}

/**
 * Global store for managing the currently selected campaign
 * This store is used across the entire application to know which campaign is active
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
        selectedCampaign: null,

        // Actions
        setSelectedCampaignId: (id) => set({ selectedCampaignId: id }, false, "setSelectedCampaignId"),

        setSelectedCampaign: (campaign) =>
          set(
            {
              selectedCampaign: campaign,
              selectedCampaignId: campaign?.id || null,
            },
            false,
            "setSelectedCampaign"
          ),

        clearSelection: () =>
          set(
            {
              selectedCampaignId: null,
              selectedCampaign: null,
            },
            false,
            "clearSelection"
          ),
      }),
      {
        name: "campaign-storage", // name for localStorage key
        partialize: (state) => ({
          // Only persist the IDs, not the full campaign object
          selectedCampaignId: state.selectedCampaignId,
        }),
      }
    ),
    {
      name: "campaign-store",
    }
  )
);
