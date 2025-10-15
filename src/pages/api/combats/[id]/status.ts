// PATCH /api/combats/:id/status - Update combat status without requiring campaign_id

import type { APIRoute } from "astro";
import { updateCombatStatus } from "@/lib/services/combat.service";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * PATCH /api/combats/:id/status
 * Updates the combat status (active/completed)
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
    const { status } = body;

    if (!status || (status !== "active" && status !== "completed")) {
      return new Response(JSON.stringify({ error: "status must be either 'active' or 'completed'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update status
    const combat = await updateCombatStatus(locals.supabase, userId, id, status);

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

    console.error("Error updating combat status:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
