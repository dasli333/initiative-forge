import type { SupabaseClient } from "@/db/supabase.client";
import type { CampaignDTO, CreateCampaignCommand, UpdateCampaignCommand, ListCampaignsResponseDTO } from "@/types";

/**
 * Result type for campaign creation
 */
type CreateCampaignResult =
  | { success: true; data: CampaignDTO }
  | { success: false; errorType: "conflict" | "internal" };

/**
 * Result type for campaign update
 */
type UpdateCampaignResult =
  | { success: true; data: CampaignDTO }
  | { success: false; errorType: "not_found" | "conflict" | "internal" };

/**
 * Result type for campaign retrieval
 */
type GetCampaignResult = { success: true; data: CampaignDTO } | { success: false; errorType: "not_found" | "internal" };

/**
 * Result type for campaign deletion
 */
type DeleteCampaignResult = { success: true } | { success: false; errorType: "not_found" | "internal" };

/**
 * Result type for listing campaigns
 */
type ListCampaignsResult =
  | { success: true; data: ListCampaignsResponseDTO }
  | { success: false; errorType: "internal" };

/**
 * Creates a new campaign for the authenticated user
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param command - Campaign creation command containing the name
 * @returns Result object with success status and data or error type
 */
export async function createCampaign(
  supabase: SupabaseClient,
  userId: string,
  command: CreateCampaignCommand
): Promise<CreateCampaignResult> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({ user_id: userId, name: command.name })
      .select()
      .single();

    if (error) {
      // PostgreSQL unique constraint violation (user_id, name)
      if (error.code === "23505") {
        return { success: false, errorType: "conflict" };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return { success: false, errorType: "internal" };
  }
}

/**
 * Lists all campaigns owned by the authenticated user with pagination
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param limit - Maximum number of results (default: 50)
 * @param offset - Offset for pagination (default: 0)
 * @returns Result object with campaigns array and pagination metadata
 */
export async function listCampaigns(
  supabase: SupabaseClient,
  userId: string,
  limit = 50,
  offset = 0
): Promise<ListCampaignsResult> {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      throw countError;
    }

    // Get paginated results
    const { data, error } = await supabase
      .from("campaigns")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        campaigns: data || [],
        total: count || 0,
        limit,
        offset,
      },
    };
  } catch (error) {
    console.error("Failed to list campaigns:", error);
    return { success: false, errorType: "internal" };
  }
}

/**
 * Gets a single campaign by ID (must be owned by the user)
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - ID of the campaign to retrieve
 * @returns Result object with campaign data or error type
 */
export async function getCampaign(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string
): Promise<GetCampaignResult> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select()
      .eq("id", campaignId)
      .eq("user_id", userId)
      .single();

    if (error) {
      // Not found or unauthorized (RLS blocks it)
      if (error.code === "PGRST116") {
        return { success: false, errorType: "not_found" };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to get campaign:", error);
    return { success: false, errorType: "internal" };
  }
}

/**
 * Updates a campaign's name
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - ID of the campaign to update
 * @param command - Update command containing the new name
 * @returns Result object with updated campaign or error type
 */
export async function updateCampaign(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string,
  command: UpdateCampaignCommand
): Promise<UpdateCampaignResult> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .update({ name: command.name })
      .eq("id", campaignId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      // Not found or unauthorized
      if (error.code === "PGRST116") {
        return { success: false, errorType: "not_found" };
      }
      // Unique constraint violation
      if (error.code === "23505") {
        return { success: false, errorType: "conflict" };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to update campaign:", error);
    return { success: false, errorType: "internal" };
  }
}

/**
 * Deletes a campaign and all associated data (CASCADE)
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - ID of the campaign to delete
 * @returns Result object indicating success or error type
 */
export async function deleteCampaign(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string
): Promise<DeleteCampaignResult> {
  try {
    const { error } = await supabase.from("campaigns").delete().eq("id", campaignId).eq("user_id", userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete campaign:", error);
    return { success: false, errorType: "internal" };
  }
}
