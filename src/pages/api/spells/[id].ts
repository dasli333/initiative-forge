import type { APIContext } from "astro";
import { getSpellById } from "@/lib/services/spell.service";
import { z } from "zod";

export const prerender = false;

/**
 * GET /api/spells/:id
 * Fetches a single spell by ID from the global SRD library
 *
 * Path parameters:
 * - id: UUID of the spell to retrieve
 *
 * @param context - Astro API context with locals.supabase
 * @returns JSON response with spell object or 404 if not found
 */
export async function GET(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;
  const { id } = context.params;

  // Validate UUID format
  const uuidSchema = z.string().uuid("Invalid spell ID format");
  const validationResult = uuidSchema.safeParse(id);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid spell ID format",
        details: validationResult.error.errors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Execute service to fetch spell
  try {
    const spell = await getSpellById(supabase, validationResult.data);

    if (!spell) {
      return new Response(
        JSON.stringify({
          error: "Not found",
          message: "Spell not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(spell), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 1 hour since SRD data is static
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching spell:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
