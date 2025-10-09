import type { SupabaseClient } from "@/db/supabase.client";
import type { CreatePlayerCharacterCommand, PlayerCharacterDTO } from "@/types";

/**
 * Result type for player character creation
 */
type CreatePlayerCharacterResult =
  | { success: true; data: PlayerCharacterDTO }
  | { success: false; errorType: "not_found" | "conflict" | "internal" };

/**
 * Creates a new player character in the specified campaign
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - UUID of the campaign to add character to
 * @param command - Player character creation command with stats and optional actions
 * @returns Result object with success status and data or error type
 *
 * Error types:
 * - not_found: Campaign doesn't exist or doesn't belong to user
 * - conflict: Character name already exists in the campaign
 * - internal: Database or unexpected error
 */
export async function createPlayerCharacter(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string,
  command: CreatePlayerCharacterCommand
): Promise<CreatePlayerCharacterResult> {
  try {
    // 1. Verify campaign ownership
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("id", campaignId)
      .eq("user_id", userId)
      .single();

    if (campaignError || !campaign) {
      return { success: false, errorType: "not_found" };
    }

    // 2. Check name uniqueness within campaign
    const { data: existing, error: existingError } = await supabase
      .from("player_characters")
      .select("id")
      .eq("campaign_id", campaignId)
      .eq("name", command.name)
      .maybeSingle();

    if (existingError) {
      console.error("Error checking character name uniqueness:", existingError);
      return { success: false, errorType: "internal" };
    }

    if (existing) {
      return { success: false, errorType: "conflict" };
    }

    // 3. Insert player character
    const { data: character, error: insertError } = await supabase
      .from("player_characters")
      .insert({
        campaign_id: campaignId,
        name: command.name,
        max_hp: command.max_hp,
        armor_class: command.armor_class,
        speed: command.speed,
        strength: command.strength,
        dexterity: command.dexterity,
        constitution: command.constitution,
        intelligence: command.intelligence,
        wisdom: command.wisdom,
        charisma: command.charisma,
        actions: command.actions || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create player character:", insertError);
      return { success: false, errorType: "internal" };
    }

    // 4. Return typed DTO with actions field
    return {
      success: true,
      data: {
        ...character,
        actions: character.actions as PlayerCharacterDTO["actions"],
      },
    };
  } catch (error) {
    console.error("Unexpected error creating player character:", error);
    return { success: false, errorType: "internal" };
  }
}
