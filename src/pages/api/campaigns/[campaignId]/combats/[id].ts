import type { APIContext } from "astro";
import { getCombat, deleteCombat } from "@/lib/services/combat.service";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * GET /api/campaigns/:campaignId/combats/:id
 * Returns combat details with current state snapshot
 */
export async function GET(context: APIContext): Promise<Response> {
  // TODO: Authentication temporarily disabled - using default user
  const userId = DEFAULT_USER_ID;

  // Extract campaignId and combatId from params
  const campaignId = context.params.campaignId;
  const combatId = context.params.id;

  if (!campaignId) {
    return new Response(JSON.stringify({ error: "Campaign ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!combatId) {
    return new Response(JSON.stringify({ error: "Combat ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const combat = await getCombat(context.locals.supabase, userId, combatId);

    // Verify combat belongs to the campaign
    if (combat.campaign_id !== campaignId) {
      return new Response(JSON.stringify({ error: "Combat not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(combat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(JSON.stringify({ error: "Combat not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error getting combat:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * DELETE /api/campaigns/:campaignId/combats/:id
 * Deletes a combat encounter
 */
export async function DELETE(context: APIContext): Promise<Response> {
  // TODO: Authentication temporarily disabled - using default user
  const userId = DEFAULT_USER_ID;

  // Extract campaignId and combatId from params
  const campaignId = context.params.campaignId;
  const combatId = context.params.id;

  if (!campaignId) {
    return new Response(JSON.stringify({ error: "Campaign ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!combatId) {
    return new Response(JSON.stringify({ error: "Combat ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get combat first to verify it belongs to the campaign
    const combat = await getCombat(context.locals.supabase, userId, combatId);

    if (combat.campaign_id !== campaignId) {
      return new Response(JSON.stringify({ error: "Combat not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await deleteCombat(context.locals.supabase, userId, combatId);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(JSON.stringify({ error: "Combat not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error deleting combat:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
