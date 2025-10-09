import type { APIContext } from "astro";
import { listConditions } from "@/lib/services/condition.service";

export const prerender = false;

/**
 * GET /api/conditions
 * Fetches all D&D 5e condition definitions from the global library
 *
 * No query parameters - returns all conditions (small static dataset)
 *
 * @param context - Astro API context with locals.supabase
 * @returns JSON response with conditions array
 */
export async function GET(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;

  // Execute service to fetch all conditions
  try {
    const result = await listConditions(supabase);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 24 hours since conditions are static reference data
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error listing conditions:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
