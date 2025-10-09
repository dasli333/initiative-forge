import type { APIContext } from "astro";
import { CreateCombatCommandSchema } from "@/lib/schemas/combat.schema";
import { createCombat } from "@/lib/services/combat.service";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * POST /api/campaigns/:campaignId/combats
 * Creates a new combat encounter with initial participants
 */
export async function POST(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;
  // TODO: Authentication temporarily disabled - using default user
  // 1. Auth check
  // const {
  //   data: { user },
  //   error: authError,
  // } = await context.locals.supabase.auth.getUser();

  // if (authError || !user) {
  //   return new Response(JSON.stringify({ error: "Authentication required" }), {
  //     status: 401,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  // Using default user for now
  const userId = DEFAULT_USER_ID;

  // 2. Extract campaignId from params
  const campaignId = context.params.campaignId;
  if (!campaignId) {
    return new Response(JSON.stringify({ error: "Campaign ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. Parse and validate request body
  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const validation = CreateCombatCommandSchema.safeParse(body);
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

  // 4. Execute service
  try {
    const combat = await createCombat(context.locals.supabase, userId, campaignId, validation.data);

    return new Response(JSON.stringify(combat), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("Maximum")) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    console.error("Error creating combat:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
