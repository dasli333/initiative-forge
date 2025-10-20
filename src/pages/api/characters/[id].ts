// Simplified character endpoints without requiring campaign_id in URL

import type { APIRoute } from "astro";
import {
  getPlayerCharacter,
  updatePlayerCharacter,
  deletePlayerCharacter,
} from "@/lib/services/player-character.service";
import { type SupabaseClient } from "@/db/supabase.client";
import { UpdatePlayerCharacterCommandSchema } from "@/lib/schemas/player-character.schema";
import { ZodError } from "zod";

export const prerender = false;

/**
 * Helper function to get campaign_id for a character using JOIN
 */
async function getCampaignIdForCharacter(
  supabase: SupabaseClient,
  userId: string,
  characterId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("player_characters")
    .select("campaign_id, campaigns!inner(user_id)")
    .eq("id", characterId)
    .single();

  if (error || !data) {
    return null;
  }

  // Verify ownership
  const record = data as { campaign_id: string; campaigns: { user_id: string } };
  if (record.campaigns.user_id !== userId) {
    return null;
  }

  return record.campaign_id;
}

/**
 * GET /api/characters/:id
 * Get a character by ID without requiring campaign_id in URL
 */
export const GET: APIRoute = async ({ params, locals }) => {
  // Check authentication - user should be set by middleware
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userId = locals.user.id;

  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Character ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get campaign_id using JOIN
    const campaignId = await getCampaignIdForCharacter(locals.supabase, userId, id);

    if (!campaignId) {
      return new Response(JSON.stringify({ error: "Character not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use existing service function
    const result = await getPlayerCharacter(locals.supabase, userId, campaignId, id);

    if (!result.success) {
      return new Response(JSON.stringify({ error: "Character not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching character:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * PATCH /api/characters/:id
 * Update a character by ID without requiring campaign_id in URL
 */
export const PATCH: APIRoute = async ({ params, locals, request }) => {
  // Check authentication - user should be set by middleware
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userId = locals.user.id;

  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Character ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get campaign_id using JOIN
    const campaignId = await getCampaignIdForCharacter(locals.supabase, userId, id);

    if (!campaignId) {
      return new Response(JSON.stringify({ error: "Character not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    const requestBody = await request.json();

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
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use existing service function
    const result = await updatePlayerCharacter(locals.supabase, userId, campaignId, id, validatedData);

    if (!result.success) {
      if (result.errorType === "not_found") {
        return new Response(JSON.stringify({ error: "Character not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (result.errorType === "conflict") {
        return new Response(JSON.stringify({ error: "Character name already exists in this campaign" }), {
          status: 409,
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
  } catch (error) {
    console.error("Error updating character:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * DELETE /api/characters/:id
 * Delete a character by ID without requiring campaign_id in URL
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
  // Check authentication - user should be set by middleware
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userId = locals.user.id;

  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Character ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get campaign_id using JOIN
    const campaignId = await getCampaignIdForCharacter(locals.supabase, userId, id);

    if (!campaignId) {
      return new Response(JSON.stringify({ error: "Character not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use existing service function
    const result = await deletePlayerCharacter(locals.supabase, userId, campaignId, id);

    if (!result.success) {
      return new Response(JSON.stringify({ error: "Character not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting character:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
