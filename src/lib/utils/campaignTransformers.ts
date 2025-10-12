import type { CampaignDTO } from "@/types";
import type { CampaignViewModel } from "@/types/campaigns";

/**
 * Transforms a CampaignDTO to CampaignViewModel
 *
 * This utility provides a centralized place for campaign data transformation,
 * ensuring consistency across SSR (Astro pages) and client-side (React Query hooks).
 *
 * Note: Currently sets aggregated data (characterCount, combatCount, hasActiveCombat)
 * to default values. These could be populated from API in the future if needed.
 *
 * @param campaign - The campaign DTO from API
 * @returns CampaignViewModel with default aggregated data
 */
export function transformToCampaignViewModel(campaign: CampaignDTO): CampaignViewModel {
  return {
    ...campaign,
    characterCount: 0,
    combatCount: 0,
    hasActiveCombat: false,
  };
}

/**
 * Transforms an array of CampaignDTOs to CampaignViewModels
 *
 * @param campaigns - Array of campaign DTOs from API
 * @returns Array of CampaignViewModels with default aggregated data
 */
export function transformToCampaignViewModels(campaigns: CampaignDTO[]): CampaignViewModel[] {
  return campaigns.map(transformToCampaignViewModel);
}
