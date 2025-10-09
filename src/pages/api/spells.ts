import type { APIContext } from "astro";
import { listSpells } from "@/lib/services/spell.service";
import { ListSpellsQuerySchema } from "@/lib/schemas/spell.schema";
import { ZodError } from "zod";

export const prerender = false;

/**
 * GET /api/spells
 * Fetches filtered and paginated list of spells from the global SRD library
 *
 * Query parameters:
 * - name: Filter by spell name (case-insensitive partial match)
 * - level: Filter by spell level (0-9, where 0 is cantrip)
 * - class: Filter by class (e.g., "Wizard", "Cleric")
 * - limit: Max results per page (1-100, default: 20)
 * - offset: Pagination offset (default: 0)
 *
 * @param context - Astro API context with locals.supabase
 * @returns JSON response with spells array and pagination metadata
 */
export async function GET(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;

  // Parse query parameters from URL
  const url = new URL(context.request.url);
  const queryParams = {
    name: url.searchParams.get("name") || undefined,
    level: url.searchParams.get("level") || undefined,
    class: url.searchParams.get("class") || undefined,
    limit: url.searchParams.get("limit") || undefined,
    offset: url.searchParams.get("offset") || undefined,
  };

  // Validate query parameters with Zod schema
  let validatedParams;
  try {
    validatedParams = ListSpellsQuerySchema.parse(queryParams);
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

  // Execute service to fetch spells
  try {
    const result = await listSpells(supabase, validatedParams);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 1 hour since SRD data is static
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error listing spells:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
