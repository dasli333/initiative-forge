import type { APIContext } from "astro";
import { updateCombatSnapshot } from "@/lib/services/combat.service";
import { UpdateCombatSnapshotCommandSchema } from "@/lib/schemas/combat.schema";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * PATCH /api/combats/:id/snapshot
 * Saves the current combat state (called periodically from client)
 */
export async function PATCH(context: APIContext): Promise<Response> {
  // TODO: Authentication temporarily disabled - using default user
  const userId = DEFAULT_USER_ID;

  // Extract combatId from params
  const combatId = context.params.id;
  if (!combatId) {
    return new Response(JSON.stringify({ error: "Combat ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse request body
  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const validation = UpdateCombatSnapshotCommandSchema.safeParse(body);
  if (!validation.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body",
        details: validation.error.errors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const combat = await updateCombatSnapshot(
      context.locals.supabase,
      userId,
      combatId,
      validation.data.state_snapshot,
      validation.data.current_round
    );

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
}
