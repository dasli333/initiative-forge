import { CampaignsWrapper } from "./CampaignsWrapper";

/**
 * Main content component for the campaigns view
 * Delegates to CampaignsWrapper which provides React Query context
 */
export function CampaignsContent() {
  return <CampaignsWrapper />;
}
