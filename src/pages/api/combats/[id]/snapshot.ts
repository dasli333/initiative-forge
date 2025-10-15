// PATCH /api/combats/:id/snapshot - Update combat snapshot without requiring campaign_id

import type { APIRoute } from "astro";
import { updateCombatSnapshot } from "@/lib/services/combat.service";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * PATCH /api/combats/:id/snapshot
 * Updates the combat state snapshot
 * Simplified endpoint - no campaign_id required in URL
 */
export const PATCH: APIRoute = async ({ params, locals, request }) => {
  // TODO: Authentication temporarily disabled - using default user
  const userId = DEFAULT_USER_ID;

  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Combat ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body = await request.json();
    const { state_snapshot, current_round } = body;

    if (!state_snapshot) {
      return new Response(JSON.stringify({ error: "state_snapshot is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof current_round !== "number") {
      return new Response(JSON.stringify({ error: "current_round must be a number" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update snapshot
    const combat = await updateCombatSnapshot(locals.supabase, userId, id, state_snapshot, current_round);

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

    console.error("Error updating combat snapshot:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
