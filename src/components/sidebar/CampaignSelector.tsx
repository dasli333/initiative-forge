import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Campaign } from "@/types";

interface CampaignSelectorProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelectionChange: (campaignId: string | null) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function CampaignSelector({
  campaigns,
  selectedCampaignId,
  onSelectionChange,
  isLoading,
  error,
  onRetry,
}: CampaignSelectorProps) {
  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  if (error) {
    return (
      <div className="px-4 py-3 border-b border-slate-800">
        <label className="text-xs uppercase text-slate-400 mb-2 block font-semibold tracking-wider">
          Current Campaign
        </label>
        <div className="text-destructive text-sm">
          <p>Failed to load campaigns.</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 text-emerald-500 hover:text-emerald-400 underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-3 border-b border-slate-800">
        <label className="text-xs uppercase text-slate-400 mb-2 block font-semibold tracking-wider">
          Current Campaign
        </label>
        <div className="text-slate-400 text-sm">Loading campaigns...</div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="px-4 py-3 border-b border-slate-800">
        <label className="text-xs uppercase text-slate-400 mb-2 block font-semibold tracking-wider">
          Current Campaign
        </label>
        <div className="text-center py-4">
          <p className="text-slate-400 text-sm mb-2">No campaigns yet.</p>
          <a href="/campaigns" className="text-emerald-500 hover:text-emerald-400 text-sm underline">
            Create your first campaign
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-slate-800">
      <label className="text-xs uppercase text-slate-400 mb-2 block font-semibold tracking-wider">
        Current Campaign
      </label>
      <Select value={selectedCampaignId || undefined} onValueChange={onSelectionChange}>
        <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-slate-200">
          <SelectValue placeholder="Select a campaign">
            {selectedCampaign?.name || "Select a campaign"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto bg-slate-800 border-slate-700">
          {campaigns.map((campaign) => (
            <SelectItem
              key={campaign.id}
              value={campaign.id}
              className="text-slate-200 focus:bg-slate-700 focus:text-slate-100"
            >
              <div className="flex items-center justify-between w-full">
                <span>{campaign.name}</span>
                {campaign.id === selectedCampaignId && (
                  <Check className="h-4 w-4 text-emerald-500 ml-2" />
                )}
              </div>
            </SelectItem>
          ))}
          <div className="sticky bottom-0 border-t border-slate-700 bg-slate-800 p-2">
            <a
              href="/campaigns"
              className="block text-center text-sm text-emerald-500 hover:text-emerald-400 py-1"
            >
              Manage Campaigns
            </a>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
