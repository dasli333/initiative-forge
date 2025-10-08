import type { APIContext } from "astro";
import { createCampaign } from "@/lib/services/campaign.service";
import { createCampaignSchema } from "@/lib/schemas/campaign.schema";
import { ZodError } from "zod";

export const prerender = false;

/**
 * POST /api/campaigns
 * Creates a new campaign for the authenticated user
 *
 * @param context - Astro API context with locals.supabase and locals.user
 * @returns JSON response with created campaign or error details
 */
export async function POST(context: APIContext) {
  const supabase = context.locals.supabase;
  const user = context.locals.user;

  // Check authentication
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse and validate request body
  let requestBody;
  try {
    requestBody = await context.request.json();
  } catch {
    return new Response(
      JSON.stringify({
        error: "Invalid JSON",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Validate with Zod schema
  let validatedData;
  try {
    validatedData = createCampaignSchema.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(
      JSON.stringify({
        error: "Validation failed",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Create campaign via service layer
  const result = await createCampaign(supabase, user.id, validatedData);

  if (!result.success) {
    if (result.errorType === "conflict") {
      return new Response(
        JSON.stringify({
          error: "Campaign with this name already exists",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Return created campaign with 201 status
  return new Response(JSON.stringify(result.data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
