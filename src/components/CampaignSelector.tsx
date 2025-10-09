import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
}

interface CampaignSelectorProps {
  campaigns?: Campaign[];
  onCampaignChange?: (campaignId: string | null) => void;
}

export function CampaignSelector({
  campaigns = [],
  onCampaignChange,
}: CampaignSelectorProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );

  // Load selected campaign from localStorage on mount
  useEffect(() => {
    const storedCampaignId = localStorage.getItem("selectedCampaignId");
    if (storedCampaignId && campaigns.some((c) => c.id === storedCampaignId)) {
      setSelectedCampaignId(storedCampaignId);
      onCampaignChange?.(storedCampaignId);
    }
  }, [campaigns, onCampaignChange]);

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    localStorage.setItem("selectedCampaignId", campaignId);
    onCampaignChange?.(campaignId);
  };

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-card hover:bg-accent"
          aria-label="Select campaign"
        >
          <span className="truncate">
            {selectedCampaign?.name || "Select Campaign"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="start">
        {campaigns.length === 0 ? (
          <DropdownMenuItem disabled>No campaigns available</DropdownMenuItem>
        ) : (
          campaigns.map((campaign) => (
            <DropdownMenuItem
              key={campaign.id}
              onSelect={() => handleSelectCampaign(campaign.id)}
              className={
                selectedCampaignId === campaign.id
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            >
              {campaign.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
