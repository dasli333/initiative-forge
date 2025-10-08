import type { SupabaseClient } from "@/db/supabase.client";
import type { CampaignDTO, CreateCampaignCommand } from "@/types";

/**
 * Result type for campaign creation
 */
type CreateCampaignResult =
  | { success: true; data: CampaignDTO }
  | { success: false; errorType: "conflict" | "internal" };

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
