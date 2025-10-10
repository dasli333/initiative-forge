import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ListCampaignsResponseDTO, CreateCampaignCommand, UpdateCampaignCommand, CampaignDTO } from "@/types";
import type { CampaignViewModel } from "@/types/campaigns";
import { toast } from "sonner";
import { useCampaignStore } from "@/stores/campaignStore";

const DEFAULT_CAMPAIGN_LIMIT = 100;

/**
 * React Query hook for fetching campaigns
 * Automatically deduplicates requests and caches data
 */
export function useCampaignsQuery() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async (): Promise<CampaignViewModel[]> => {
      const response = await fetch(`/api/campaigns?limit=${DEFAULT_CAMPAIGN_LIMIT}&offset=0`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const data: ListCampaignsResponseDTO = await response.json();

      // Convert to CampaignViewModel with optional aggregated data
      const viewModels: CampaignViewModel[] = data.campaigns.map((campaign) => ({
        ...campaign,
        characterCount: 0,
        combatCount: 0,
        hasActiveCombat: false,
      }));

      return viewModels;
    },
  });
}

/**
 * Mutation hook for creating a new campaign
 */
export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string): Promise<CampaignDTO> => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error("Campaign name is required");
      }

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName } as CreateCampaignCommand),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (response.status === 409) {
        throw new Error("Campaign with this name already exists");
      }

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      return await response.json();
    },
    onMutate: async (name) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["campaigns"] });

      // Snapshot the previous value
      const previousCampaigns = queryClient.getQueryData<CampaignViewModel[]>(["campaigns"]);

      // Optimistically update to the new value
      if (previousCampaigns) {
        const tempCampaign: CampaignViewModel = {
          id: `temp-${Date.now()}`,
          user_id: "",
          name: name.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          characterCount: 0,
          combatCount: 0,
          hasActiveCombat: false,
        };

        queryClient.setQueryData<CampaignViewModel[]>(["campaigns"], [...previousCampaigns, tempCampaign]);
      }

      // Return context with the snapshot
      return { previousCampaigns };
    },
    onError: (err, _name, context) => {
      // Rollback to the previous value on error
      if (context?.previousCampaigns) {
        queryClient.setQueryData(["campaigns"], context.previousCampaigns);
      }

      const errorMessage =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";

      toast.error("Error", {
        description: errorMessage,
      });
    },
    onSuccess: () => {
      toast.success("Campaign created", {
        description: "Your campaign has been created successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

/**
 * Mutation hook for updating a campaign
 */
export function useUpdateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }): Promise<CampaignDTO> => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error("Campaign name cannot be empty");
      }

      const response = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName } as UpdateCampaignCommand),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (response.status === 404) {
        throw new Error("Campaign not found");
      }

      if (response.status === 409) {
        throw new Error("Campaign with this name already exists");
      }

      if (!response.ok) {
        throw new Error("Failed to update campaign");
      }

      return await response.json();
    },
    onMutate: async ({ id, name }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["campaigns"] });

      // Snapshot the previous value
      const previousCampaigns = queryClient.getQueryData<CampaignViewModel[]>(["campaigns"]);

      // Optimistically update to the new value
      if (previousCampaigns) {
        queryClient.setQueryData<CampaignViewModel[]>(
          ["campaigns"],
          previousCampaigns.map((c) => (c.id === id ? { ...c, name: name.trim() } : c))
        );
      }

      // Return context with the snapshot
      return { previousCampaigns };
    },
    onError: (err, _variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousCampaigns) {
        queryClient.setQueryData(["campaigns"], context.previousCampaigns);
      }

      const errorMessage =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";

      toast.error("Error", {
        description: errorMessage,
      });
    },
    onSuccess: () => {
      toast.success("Campaign updated", {
        description: "Campaign name has been updated successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

/**
 * Mutation hook for deleting a campaign
 */
export function useDeleteCampaignMutation() {
  const queryClient = useQueryClient();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignStore();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (response.status === 404) {
        // Already deleted or doesn't exist - consider success
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete campaign");
      }
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["campaigns"] });

      // Snapshot the previous value
      const previousCampaigns = queryClient.getQueryData<CampaignViewModel[]>(["campaigns"]);

      // Optimistically update by removing the campaign
      if (previousCampaigns) {
        queryClient.setQueryData<CampaignViewModel[]>(
          ["campaigns"],
          previousCampaigns.filter((c) => c.id !== id)
        );
      }

      // Clear selection if deleted campaign was selected
      const previousSelectedId = selectedCampaignId;
      if (selectedCampaignId === id) {
        setSelectedCampaignId(null);
      }

      // Return context with snapshots
      return { previousCampaigns, previousSelectedId };
    },
    onError: (err, id, context) => {
      // Rollback campaigns
      if (context?.previousCampaigns) {
        queryClient.setQueryData(["campaigns"], context.previousCampaigns);
      }

      // Rollback selected campaign ID
      if (context?.previousSelectedId === id) {
        setSelectedCampaignId(id);
      }

      const errorMessage =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : "Failed to delete campaign. Please try again.";

      toast.error("Error", {
        description: errorMessage,
      });
    },
    onSuccess: () => {
      toast.success("Campaign deleted", {
        description: "Campaign has been removed successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
