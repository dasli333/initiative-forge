import type { APIContext } from "astro";
import {
  getPlayerCharacter,
  updatePlayerCharacter,
  deletePlayerCharacter,
} from "@/lib/services/player-character.service";
import { UpdatePlayerCharacterCommandSchema } from "@/lib/schemas/player-character.schema";
import { ZodError } from "zod";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * GET /api/campaigns/:campaignId/characters/:id
 * Returns a single player character
 *
 * @param context - Astro API context with locals.supabase and params
 * @returns JSON response with character or error details
 */
export async function GET(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;

  // TODO: Authentication temporarily disabled - using default user
  const userId = DEFAULT_USER_ID;

  // Extract campaignId and character ID from URL params
  const campaignId = context.params.campaignId;
  const characterId = context.params.id;

  if (!campaignId || !characterId) {
    return new Response(JSON.stringify({ error: "Campaign ID and Character ID are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Execute service to get character
  const result = await getPlayerCharacter(supabase, userId, campaignId, characterId);

  if (!result.success) {
    if (result.errorType === "not_found") {
      return new Response(JSON.stringify({ error: "Character or campaign not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * PATCH /api/campaigns/:campaignId/characters/:id
 * Updates player character fields
 *
 * @param context - Astro API context with locals.supabase, params, and request body
 * @returns JSON response with updated character or error details
 */
export async function PATCH(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;

  // TODO: Authentication temporarily disabled - using default user
  const userId = DEFAULT_USER_ID;

  // Extract campaignId and character ID from URL params
  const campaignId = context.params.campaignId;
  const characterId = context.params.id;

  if (!campaignId || !characterId) {
    return new Response(JSON.stringify({ error: "Campaign ID and Character ID are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse request body
  let requestBody;
  try {
    requestBody = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate with Zod schema
  let validatedData;
  try {
    validatedData = UpdatePlayerCharacterCommandSchema.parse(requestBody);
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

  // Execute service to update character
  const result = await updatePlayerCharacter(supabase, userId, campaignId, characterId, validatedData);

  if (!result.success) {
    if (result.errorType === "not_found") {
      return new Response(JSON.stringify({ error: "Character or campaign not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * DELETE /api/campaigns/:campaignId/characters/:id
 * Deletes a player character
 *
 * @param context - Astro API context with locals.supabase and params
 * @returns 204 No Content on success or error details
 */
export async function DELETE(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;

  // TODO: Authentication temporarily disabled - using default user
  const userId = DEFAULT_USER_ID;

  // Extract campaignId and character ID from URL params
  const campaignId = context.params.campaignId;
  const characterId = context.params.id;

  if (!campaignId || !characterId) {
    return new Response(JSON.stringify({ error: "Campaign ID and Character ID are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Execute service to delete character
  const result = await deletePlayerCharacter(supabase, userId, campaignId, characterId);

  if (!result.success) {
    if (result.errorType === "not_found") {
      return new Response(JSON.stringify({ error: "Character or campaign not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(null, {
    status: 204,
  });
}
