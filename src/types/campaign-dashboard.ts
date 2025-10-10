import type { CampaignDTO } from "@/types";

/**
 * Props for CampaignDashboardContent component
 */
export interface CampaignDashboardContentProps {
  initialCampaign: CampaignDTO;
  initialCharactersCount: number;
}

/**
 * Props for CampaignHeader component
 */
export interface CampaignHeaderProps {
  campaign: CampaignDTO;
  isUpdating: boolean;
  onUpdateName: (newName: string) => Promise<void>;
}

/**
 * Props for EditableHeading component
 */
export interface EditableHeadingProps {
  value: string;
  isUpdating: boolean;
  onSave: (newValue: string) => Promise<void>;
  className?: string;
}

/**
 * Props for CampaignMetadata component
 */
export interface CampaignMetadataProps {
  createdAt: string; // ISO date string
}

/**
 * Props for StatsOverview component
 */
export interface StatsOverviewProps {
  charactersCount: number;
}

/**
 * Props for StatCard component
 */
export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass?: string;
}

/**
 * Props for QuickActionsSection component
 */
export interface QuickActionsSectionProps {
  campaignId: string;
}

/**
 * Props for ActionCard component
 */
export interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  buttonVariant?: "default" | "success";
  href: string;
}

/**
 * Return type for useCampaignDashboard hook
 */
export interface UseCampaignDashboardReturn {
  campaign: CampaignDTO;
  charactersCount: number;
  isUpdating: boolean;
  error: string | null;
  updateCampaignName: (newName: string) => Promise<void>;
}
