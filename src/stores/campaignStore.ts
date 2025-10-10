import { create } from "zustand";
import { devtools } from "zustand/middleware";
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
 * Important: This store is only used on the client side, not during SSR
 */
export const useCampaignStore = create<CampaignStore>()(
  devtools(
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
      name: "campaign-store",
    }
  )
);
