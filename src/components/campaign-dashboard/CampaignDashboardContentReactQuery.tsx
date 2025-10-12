import React, { useEffect, useRef } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { CampaignHeader } from "./CampaignHeader";
import { StatsOverview } from "./StatsOverview";
import { QuickActionsSection } from "./QuickActionsSection";
import { useCampaignQuery } from "@/hooks/queries/useCampaign";
import { useCampaignCharactersQuery } from "@/hooks/queries/useCampaignCharacters";
import { useUpdateCampaignMutation } from "@/hooks/queries/useCampaigns";
import { useCampaignStore } from "@/stores/campaignStore";
import type { CampaignDashboardContentProps } from "@/types/campaign-dashboard";

/**
 * Campaign Dashboard Content with React Query
 * Main React component for campaign dashboard with breadcrumb, header, stats, and quick actions
 */
export function CampaignDashboardContentReactQuery({
  initialCampaign,
  initialCharactersCount,
}: CampaignDashboardContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setSelectedCampaign } = useCampaignStore();

  // Use React Query for data fetching
  const { data: campaign = initialCampaign } = useCampaignQuery(initialCampaign.id, {
    enabled: true,
  });

  const { data: characters = [] } = useCampaignCharactersQuery(initialCampaign.id, {
    enabled: true,
  });

  const updateCampaignMutation = useUpdateCampaignMutation();

  // Update the selected campaign in the global store (for Sidebar display)
  useEffect(() => {
    setSelectedCampaign(campaign);
  }, [campaign, setSelectedCampaign]);

  // Focus on container for accessibility
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const updateCampaignName = async (name: string) => {
    await updateCampaignMutation.mutateAsync({ id: campaign.id, name });
  };

  const charactersCount = characters.length || initialCharactersCount;
  const isUpdating = updateCampaignMutation.isPending;
  const error = updateCampaignMutation.error
    ? updateCampaignMutation.error instanceof Error
      ? updateCampaignMutation.error.message
      : "Failed to update campaign"
    : null;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="container mx-auto px-4 py-8 max-w-7xl space-y-8 focus:outline-none"
    >
      {/* Breadcrumb navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/campaigns">My Campaigns</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{campaign.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Campaign header */}
      <CampaignHeader campaign={campaign} isUpdating={isUpdating} onUpdateName={updateCampaignName} />

      {/* Stats overview */}
      <StatsOverview charactersCount={charactersCount} />

      {/* Quick actions */}
      <QuickActionsSection campaignId={campaign.id} />
    </div>
  );
}
