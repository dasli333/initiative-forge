import type { APIContext } from "astro";
import { getMonsterById } from "@/lib/services/monster.service";
import { z } from "zod";

export const prerender = false;

/**
 * GET /api/monsters/:id
 * Fetches a single monster by ID from the global SRD library
 *
 * Path parameters:
 * - id: UUID of the monster to retrieve
 *
 * @param context - Astro API context with locals.supabase
 * @returns JSON response with monster object or 404 if not found
 */
export async function GET(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;
  const { id } = context.params;

  // Validate UUID format
  const uuidSchema = z.string().uuid("Invalid monster ID format");
  const validationResult = uuidSchema.safeParse(id);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid monster ID format",
        details: validationResult.error.errors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Execute service to fetch monster
  try {
    const monster = await getMonsterById(supabase, validationResult.data);

    if (!monster) {
      return new Response(
        JSON.stringify({
          error: "Not found",
          message: "Monster not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(monster), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 1 hour since SRD data is static
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching monster:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
