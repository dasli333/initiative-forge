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
import { useCampaignDashboard } from "@/hooks/useCampaignDashboard";
import type { CampaignDashboardContentProps } from "@/types/campaign-dashboard";

/**
 * Campaign Dashboard Content
 * Main React component for campaign dashboard with breadcrumb, header, stats, and quick actions
 */
export function CampaignDashboardContent({ initialCampaign, initialCharactersCount }: CampaignDashboardContentProps) {
  const { campaign, charactersCount, isUpdating, error, updateCampaignName } = useCampaignDashboard(
    initialCampaign,
    initialCharactersCount
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Focus on container for accessibility
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

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
