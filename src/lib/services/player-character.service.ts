import type { SupabaseClient } from "@/db/supabase.client";
import type {
  CreatePlayerCharacterCommand,
  UpdatePlayerCharacterCommand,
  PlayerCharacterDTO,
  ListPlayerCharactersResponseDTO,
} from "@/types";

/**
 * Result type for player character creation
 */
type CreatePlayerCharacterResult =
  | { success: true; data: PlayerCharacterDTO }
  | { success: false; errorType: "not_found" | "conflict" | "internal" };

/**
 * Result type for listing player characters
 */
type ListPlayerCharactersResult =
  | { success: true; data: ListPlayerCharactersResponseDTO }
  | { success: false; errorType: "not_found" | "internal" };

/**
 * Result type for getting a single player character
 */
type GetPlayerCharacterResult =
  | { success: true; data: PlayerCharacterDTO }
  | { success: false; errorType: "not_found" | "internal" };

/**
 * Result type for updating a player character
 */
type UpdatePlayerCharacterResult =
  | { success: true; data: PlayerCharacterDTO }
  | { success: false; errorType: "not_found" | "conflict" | "internal" };

/**
 * Result type for deleting a player character
 */
type DeletePlayerCharacterResult = { success: true } | { success: false; errorType: "not_found" | "internal" };

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

/**
 * Lists all player characters in a campaign
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - UUID of the campaign
 * @returns Result object with characters array or error type
 */
export async function listPlayerCharacters(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string
): Promise<ListPlayerCharactersResult> {
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

    // 2. Get all characters in the campaign
    const { data: characters, error } = await supabase
      .from("player_characters")
      .select()
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to list player characters:", error);
      return { success: false, errorType: "internal" };
    }

    // 3. Return typed DTOs with actions field
    return {
      success: true,
      data: {
        characters: (characters || []).map((char) => ({
          ...char,
          actions: char.actions as PlayerCharacterDTO["actions"],
        })),
      },
    };
  } catch (error) {
    console.error("Unexpected error listing player characters:", error);
    return { success: false, errorType: "internal" };
  }
}

/**
 * Gets a single player character by ID
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - UUID of the campaign
 * @param characterId - UUID of the character
 * @returns Result object with character data or error type
 */
export async function getPlayerCharacter(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string,
  characterId: string
): Promise<GetPlayerCharacterResult> {
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

    // 2. Get the character
    const { data: character, error } = await supabase
      .from("player_characters")
      .select()
      .eq("id", characterId)
      .eq("campaign_id", campaignId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, errorType: "not_found" };
      }
      console.error("Failed to get player character:", error);
      return { success: false, errorType: "internal" };
    }

    // 3. Return typed DTO with actions field
    return {
      success: true,
      data: {
        ...character,
        actions: character.actions as PlayerCharacterDTO["actions"],
      },
    };
  } catch (error) {
    console.error("Unexpected error getting player character:", error);
    return { success: false, errorType: "internal" };
  }
}

/**
 * Updates a player character
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - UUID of the campaign
 * @param characterId - UUID of the character
 * @param command - Update command with partial character data
 * @returns Result object with updated character or error type
 */
export async function updatePlayerCharacter(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string,
  characterId: string,
  command: UpdatePlayerCharacterCommand
): Promise<UpdatePlayerCharacterResult> {
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

    // 2. Check if character exists in campaign
    const { data: existing, error: existingError } = await supabase
      .from("player_characters")
      .select("id, name")
      .eq("id", characterId)
      .eq("campaign_id", campaignId)
      .single();

    if (existingError || !existing) {
      return { success: false, errorType: "not_found" };
    }

    // 3. If name is being changed, check for conflicts
    if (command.name && command.name !== existing.name) {
      const { data: nameConflict, error: nameError } = await supabase
        .from("player_characters")
        .select("id")
        .eq("campaign_id", campaignId)
        .eq("name", command.name)
        .neq("id", characterId)
        .maybeSingle();

      if (nameError) {
        console.error("Error checking character name uniqueness:", nameError);
        return { success: false, errorType: "internal" };
      }

      if (nameConflict) {
        return { success: false, errorType: "conflict" };
      }
    }

    // 4. Update the character
    const { data: character, error: updateError } = await supabase
      .from("player_characters")
      .update({
        ...command,
        actions: command.actions !== undefined ? command.actions : undefined,
      })
      .eq("id", characterId)
      .eq("campaign_id", campaignId)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update player character:", updateError);
      return { success: false, errorType: "internal" };
    }

    // 5. Return typed DTO with actions field
    return {
      success: true,
      data: {
        ...character,
        actions: character.actions as PlayerCharacterDTO["actions"],
      },
    };
  } catch (error) {
    console.error("Unexpected error updating player character:", error);
    return { success: false, errorType: "internal" };
  }
}

/**
 * Deletes a player character
 *
 * @param supabase - Supabase client instance
 * @param userId - ID of the authenticated user
 * @param campaignId - UUID of the campaign
 * @param characterId - UUID of the character
 * @returns Result object indicating success or error type
 */
export async function deletePlayerCharacter(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string,
  characterId: string
): Promise<DeletePlayerCharacterResult> {
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

    // 2. Delete the character
    const { error } = await supabase
      .from("player_characters")
      .delete()
      .eq("id", characterId)
      .eq("campaign_id", campaignId);

    if (error) {
      console.error("Failed to delete player character:", error);
      return { success: false, errorType: "internal" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting player character:", error);
    return { success: false, errorType: "internal" };
  }
}
