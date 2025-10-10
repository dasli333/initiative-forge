import { useState, useCallback } from "react";
import type { CampaignDTO, UpdateCampaignCommand } from "@/types";
import type { UseCampaignDashboardReturn } from "@/types/campaign-dashboard";
import { toast } from "sonner";

export function useCampaignDashboard(
  initialCampaign: CampaignDTO,
  initialCharactersCount: number
): UseCampaignDashboardReturn {
  const [campaign, setCampaign] = useState<CampaignDTO>(initialCampaign);
  const [charactersCount] = useState<number>(initialCharactersCount);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update campaign name with optimistic update
   */
  const updateCampaignName = useCallback(
    async (newName: string): Promise<void> => {
      const trimmedName = newName.trim();

      // Validation: not empty
      if (!trimmedName) {
        return;
      }

      // Validation: changed
      if (trimmedName === campaign.name) {
        return;
      }

      // Store previous state for rollback
      const previousCampaign = { ...campaign };

      // Optimistic update
      setCampaign((prev) => ({ ...prev, name: trimmedName }));
      setIsUpdating(true);
      setError(null);

      try {
        const response = await fetch(`/api/campaigns/${campaign.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: trimmedName } as UpdateCampaignCommand),
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (response.status === 404) {
          // Revert optimistic update
          setCampaign(previousCampaign);
          setError("Campaign not found. It may have been deleted.");
          toast.error("Error", {
            description: "Campaign not found. It may have been deleted.",
          });
          // Optionally redirect to campaigns list after 2 seconds
          setTimeout(() => {
            window.location.href = "/campaigns";
          }, 2000);
          return;
        }

        if (response.status === 409) {
          // Revert optimistic update
          setCampaign(previousCampaign);
          setError("Campaign with this name already exists");
          toast.error("Error", {
            description: "Campaign with this name already exists",
          });
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to update campaign");
        }

        const updatedCampaign: CampaignDTO = await response.json();

        // Update with server response
        setCampaign(updatedCampaign);

        toast.success("Campaign updated", {
          description: "Campaign name has been updated successfully.",
        });
      } catch (err) {
        // Revert optimistic update
        setCampaign(previousCampaign);

        const errorMessage =
          err instanceof TypeError && err.message === "Failed to fetch"
            ? "Network error. Please check your connection."
            : "Something went wrong. Please try again.";

        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [campaign]
  );

  return {
    campaign,
    charactersCount,
    isUpdating,
    error,
    updateCampaignName,
  };
}
