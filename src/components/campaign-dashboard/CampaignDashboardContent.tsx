import { CampaignDashboardWrapper } from "./CampaignDashboardWrapper";
import type { CampaignDashboardContentProps } from "@/types/campaign-dashboard";

/**
 * Campaign Dashboard Content
 * Delegates to CampaignDashboardWrapper which provides React Query context
 */
export function CampaignDashboardContent({ initialCampaign, initialCharactersCount }: CampaignDashboardContentProps) {
  return <CampaignDashboardWrapper initialCampaign={initialCampaign} initialCharactersCount={initialCharactersCount} />;
}
