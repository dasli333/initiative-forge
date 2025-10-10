import { AppProviders } from "@/providers/AppProviders";
import { CampaignDashboardContentReactQuery } from "./CampaignDashboardContentReactQuery";
import type { CampaignDashboardContentProps } from "@/types/campaign-dashboard";

/**
 * Wrapper component that provides React Query context to CampaignDashboard
 * This is needed because Astro mounts React components independently
 */
export function CampaignDashboardWrapper({ initialCampaign, initialCharactersCount }: CampaignDashboardContentProps) {
  return (
    <AppProviders>
      <CampaignDashboardContentReactQuery
        initialCampaign={initialCampaign}
        initialCharactersCount={initialCharactersCount}
      />
    </AppProviders>
  );
}
