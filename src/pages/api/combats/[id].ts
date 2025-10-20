// Simplified combat endpoints without requiring campaign_id in URL

import type { APIRoute } from "astro";
import { getCombat, deleteCombat } from "@/lib/services/combat.service";

export const prerender = false;

/**
 * GET /api/combats/:id
 * Fetch a single combat by ID
 * This endpoint fetches the combat and automatically determines the campaign_id
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
      return new Response(JSON.stringify({ error: "Combat ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch combat
    const combat = await getCombat(locals.supabase, userId, id);

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

    console.error("Error fetching combat:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * DELETE /api/combats/:id
 * Delete a combat by ID
 * Simplified endpoint - no campaign_id required in URL
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
      return new Response(JSON.stringify({ error: "Combat ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete combat
    await deleteCombat(locals.supabase, userId, id);

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
};
