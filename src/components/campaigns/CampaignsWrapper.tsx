import { AppProviders } from "@/providers/AppProviders";
import { CampaignsContentReactQuery } from "./CampaignsContentReactQuery";

/**
 * Wrapper component that provides React Query context to CampaignsContent
 * This is needed because Astro mounts React components independently
 */
export function CampaignsWrapper() {
  return (
    <AppProviders>
      <CampaignsContentReactQuery />
    </AppProviders>
  );
}
