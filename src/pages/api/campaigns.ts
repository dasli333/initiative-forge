import type { APIContext } from "astro";
import { createCampaign, listCampaigns } from "@/lib/services/campaign.service";
import { createCampaignSchema } from "@/lib/schemas/campaign.schema";
import { ZodError } from "zod";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

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

  // TODO: Authentication temporarily disabled - using default user
  // Check authentication
  // const {
  //   data: { user },
  //   error: authError,
  // } = await supabase.auth.getUser();

  // if (authError || !user) {
  //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
  //     status: 401,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  // Using default user for now
  const userId = DEFAULT_USER_ID;

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
  const result = await createCampaign(supabase, userId, validatedData);

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

/**
 * GET /api/campaigns
 * Returns all campaigns owned by the authenticated user
 *
 * @param context - Astro API context with locals.supabase and query parameters
 * @returns JSON response with campaigns array and pagination metadata
 */
export async function GET(context: APIContext) {
  const supabase = context.locals.supabase;

  // TODO: Authentication temporarily disabled - using default user
  // Check authentication
  // const {
  //   data: { user },
  //   error: authError,
  // } = await supabase.auth.getUser();

  // if (authError || !user) {
  //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
  //     status: 401,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  // Using default user for now
  const userId = DEFAULT_USER_ID;

  // Parse query parameters for pagination
  const url = new URL(context.request.url);
  const limitParam = url.searchParams.get("limit");
  const offsetParam = url.searchParams.get("offset");

  const limit = limitParam ? parseInt(limitParam, 10) : 50;
  const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

  // Validate pagination parameters
  if (isNaN(limit) || limit < 1 || limit > 100) {
    return new Response(
      JSON.stringify({
        error: "Invalid limit parameter (must be between 1 and 100)",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (isNaN(offset) || offset < 0) {
    return new Response(
      JSON.stringify({
        error: "Invalid offset parameter (must be non-negative)",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Get campaigns via service layer
  const result = await listCampaigns(supabase, userId, limit, offset);

  if (!result.success) {
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

  // Return campaigns with pagination metadata
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
