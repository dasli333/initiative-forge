import type { APIContext } from "astro";
import { getConditionById } from "@/lib/services/condition.service";
import { z } from "zod";

export const prerender = false;

/**
 * GET /api/conditions/:id
 * Fetches a single condition by ID from the global D&D 5e library
 *
 * Path parameters:
 * - id: UUID of the condition to retrieve
 *
 * @param context - Astro API context with locals.supabase
 * @returns JSON response with condition object or 404 if not found
 */
export async function GET(context: APIContext): Promise<Response> {
  const supabase = context.locals.supabase;
  const { id } = context.params;

  // Validate UUID format
  const uuidSchema = z.string().uuid("Invalid condition ID format");
  const validationResult = uuidSchema.safeParse(id);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid condition ID format",
        details: validationResult.error.errors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Execute service to fetch condition
  try {
    const condition = await getConditionById(supabase, validationResult.data);

    if (!condition) {
      return new Response(
        JSON.stringify({
          error: "Not found",
          message: "Condition not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(condition), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 24 hours since conditions are static reference data
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching condition:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
