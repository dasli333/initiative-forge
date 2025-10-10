import { EditableHeading } from "./EditableHeading";
import { CampaignMetadata } from "./CampaignMetadata";
import type { CampaignHeaderProps } from "@/types/campaign-dashboard";

/**
 * Campaign header component
 * Displays editable campaign name and metadata
 */
export function CampaignHeader({ campaign, isUpdating, onUpdateName }: CampaignHeaderProps) {
  return (
    <header className="space-y-2">
      <EditableHeading value={campaign.name} isUpdating={isUpdating} onSave={onUpdateName} />
      <CampaignMetadata createdAt={campaign.created_at} />
    </header>
  );
}
