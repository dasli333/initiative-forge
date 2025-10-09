import type { APIContext } from "astro";
import { createPlayerCharacter } from "@/lib/services/player-character.service";
import { CreatePlayerCharacterCommandSchema } from "@/lib/schemas/player-character.schema";
import { ZodError } from "zod";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * POST /api/campaigns/:campaignId/characters
 * Creates a new player character in the specified campaign
 *
 * Body parameters:
 * - name: Character name (required, unique per campaign)
 * - max_hp: Maximum hit points (required, > 0)
 * - armor_class: Armor class (required, > 0)
 * - speed: Speed in feet (required, >= 0)
 * - strength, dexterity, constitution, intelligence, wisdom, charisma: Stats (required, 1-30)
 * - actions: Array of character actions (optional, max 20)
 *
 * @param context - Astro API context with locals.supabase and params
 * @returns JSON response with created character or error details
 */
export async function POST(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;

  // TODO: Authentication temporarily disabled - using default user
  // Check authentication
  // const {
  //   data: { user },
  //   error: authError,
  // } = await supabase.auth.getUser();

  // if (authError || !user) {
  //   return new Response(
  //     JSON.stringify({ error: "Authentication required" }),
  //     {
  //       status: 401,
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  // }

  // Using default user for now
  const userId = DEFAULT_USER_ID;

  // Extract campaignId from URL params
  const campaignId = context.params.campaignId;
  if (!campaignId) {
    return new Response(
      JSON.stringify({ error: "Campaign ID is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Parse request body
  let requestBody;
  try {
    requestBody = await context.request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Validate with Zod schema
  let validatedData;
  try {
    validatedData = CreatePlayerCharacterCommandSchema.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(
      JSON.stringify({
        error: "Invalid request body",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Execute service to create character
  const result = await createPlayerCharacter(
    supabase,
    userId,
    campaignId,
    validatedData
  );

  if (!result.success) {
    // Handle campaign not found or not owned
    if (result.errorType === "not_found") {
      return new Response(
        JSON.stringify({ error: "Campaign not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle name conflict
    if (result.errorType === "conflict") {
      return new Response(
        JSON.stringify({
          error: "Character name already exists in this campaign",
          field: "name",
          value: validatedData.name,
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle internal errors
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Return created character with 201 status
  return new Response(JSON.stringify(result.data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
