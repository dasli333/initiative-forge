import type { APIContext } from "astro";
import { listMonsters } from "@/lib/services/monster.service";
import { ListMonstersQuerySchema } from "@/lib/schemas/monster.schema";
import { ZodError } from "zod";

export const prerender = false;

/**
 * GET /api/monsters
 * Fetches filtered and paginated list of monsters from the global SRD library
 *
 * Query parameters:
 * - name: Filter by monster name (case-insensitive partial match)
 * - cr: Filter by exact Challenge Rating (e.g., "1/4", "1/2", "5")
 * - cr_min: Minimum CR for range filtering (inclusive)
 * - cr_max: Maximum CR for range filtering (inclusive)
 * - limit: Max results per page (1-100, default: 20)
 * - offset: Pagination offset (default: 0)
 *
 * @param context - Astro API context with locals.supabase
 * @returns JSON response with monsters array and pagination metadata
 */
export async function GET(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;

  // Parse query parameters from URL
  const url = new URL(context.request.url);
  const queryParams = {
    name: url.searchParams.get("name") || undefined,
    cr: url.searchParams.get("cr") || undefined,
    cr_min: url.searchParams.get("cr_min") || undefined,
    cr_max: url.searchParams.get("cr_max") || undefined,
    limit: url.searchParams.get("limit") || undefined,
    offset: url.searchParams.get("offset") || undefined,
  };

  // Validate query parameters with Zod schema
  let validatedParams;
  try {
    validatedParams = ListMonstersQuerySchema.parse(queryParams);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
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
        error: "Invalid query parameters",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Execute service to fetch monsters
  try {
    const result = await listMonsters(supabase, validatedParams);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 1 hour since SRD data is static
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error listing monsters:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
