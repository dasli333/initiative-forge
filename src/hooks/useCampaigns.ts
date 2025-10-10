import { useState, useEffect, useCallback } from "react";
import type { ListCampaignsResponseDTO, CreateCampaignCommand, UpdateCampaignCommand, CampaignDTO } from "@/types";
import type { CampaignViewModel } from "@/types/campaigns";
import { toast } from "sonner";

const DEFAULT_CAMPAIGN_LIMIT = 100;

interface CrudResult {
  success: boolean;
  error?: string;
}

interface UseCampaignsReturn {
  campaigns: CampaignViewModel[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createCampaign: (name: string) => Promise<CrudResult>;
  updateCampaign: (id: string, name: string) => Promise<CrudResult>;
  deleteCampaign: (id: string) => Promise<CrudResult>;
}

export function useCampaigns(): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<CampaignViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/campaigns?limit=${DEFAULT_CAMPAIGN_LIMIT}&offset=0`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
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

      setCampaigns(viewModels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load campaigns"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new campaign with optimistic update
   */
  const createCampaign = async (name: string): Promise<CrudResult> => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: "Campaign name is required" };
    }

    // Temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempCampaign: CampaignViewModel = {
      id: tempId,
      user_id: "", // Will be set by server
      name: trimmedName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      characterCount: 0,
      combatCount: 0,
      hasActiveCombat: false,
    };

    // Optimistic update
    setCampaigns((prev) => [...prev, tempCampaign]);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName } as CreateCampaignCommand),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return { success: false, error: "Unauthorized" };
      }

      if (response.status === 409) {
        // Revert optimistic update
        setCampaigns((prev) => prev.filter((c) => c.id !== tempId));
        return { success: false, error: "Campaign with this name already exists" };
      }

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      const newCampaign: CampaignDTO = await response.json();

      // Replace temp campaign with real one
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === tempId ? { ...newCampaign, characterCount: 0, combatCount: 0, hasActiveCombat: false } : c
        )
      );

      toast.success("Campaign created", {
        description: "Your campaign has been created successfully.",
      });

      return { success: true };
    } catch (err) {
      // Revert optimistic update
      setCampaigns((prev) => prev.filter((c) => c.id !== tempId));

      const errorMessage =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : "Something went wrong. Please try again.";

      toast.error("Error", {
        description: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update campaign name with optimistic update
   */
  const updateCampaign = async (id: string, name: string): Promise<CrudResult> => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: "Campaign name cannot be empty" };
    }

    // Store previous state for rollback
    const previousCampaigns = [...campaigns];
    const targetCampaign = campaigns.find((c) => c.id === id);

    if (!targetCampaign) {
      return { success: false, error: "Campaign not found" };
    }

    // No changes
    if (targetCampaign.name === trimmedName) {
      return { success: true };
    }

    // Optimistic update
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmedName } : c)));

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName } as UpdateCampaignCommand),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return { success: false, error: "Unauthorized" };
      }

      if (response.status === 404) {
        // Revert and refetch
        setCampaigns(previousCampaigns);
        await fetchCampaigns();
        toast.error("Error", {
          description: "Campaign not found",
        });
        return { success: false, error: "Campaign not found" };
      }

      if (response.status === 409) {
        // Revert optimistic update
        setCampaigns(previousCampaigns);
        toast.error("Error", {
          description: "Campaign with this name already exists",
        });
        return { success: false, error: "Campaign with this name already exists" };
      }

      if (!response.ok) {
        throw new Error("Failed to update campaign");
      }

      const updatedCampaign: CampaignDTO = await response.json();

      // Update with server response
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedCampaign } : c)));

      toast.success("Campaign updated", {
        description: "Campaign name has been updated successfully.",
      });

      return { success: true };
    } catch (err) {
      // Revert optimistic update
      setCampaigns(previousCampaigns);

      const errorMessage =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : "Something went wrong. Please try again.";

      toast.error("Error", {
        description: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  /**
   * Delete campaign with optimistic update
   */
  const deleteCampaign = async (id: string): Promise<CrudResult> => {
    // Store previous state for rollback
    const previousCampaigns = [...campaigns];
    const targetCampaign = campaigns.find((c) => c.id === id);

    if (!targetCampaign) {
      return { success: false, error: "Campaign not found" };
    }

    // Optimistic update
    setCampaigns((prev) => prev.filter((c) => c.id !== id));

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return { success: false, error: "Unauthorized" };
      }

      if (response.status === 404) {
        // Already deleted or doesn't exist, consider success
        toast.success("Campaign deleted", {
          description: "Campaign has been removed successfully.",
        });
        return { success: true };
      }

      if (!response.ok) {
        throw new Error("Failed to delete campaign");
      }

      toast.success("Campaign deleted", {
        description: "Campaign has been removed successfully.",
      });

      return { success: true };
    } catch (err) {
      // Revert optimistic update
      setCampaigns(previousCampaigns);

      const errorMessage =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : "Failed to delete campaign. Please try again.";

      toast.error("Error", {
        description: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    isLoading,
    error,
    refetch: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
