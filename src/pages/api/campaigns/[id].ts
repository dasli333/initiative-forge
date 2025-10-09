import type { APIContext } from "astro";
import { getCampaign, updateCampaign, deleteCampaign } from "@/lib/services/campaign.service";
import { updateCampaignSchema } from "@/lib/schemas/campaign.schema";
import { ZodError } from "zod";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * GET /api/campaigns/:id
 * Returns a single campaign by ID
 *
 * @param context - Astro API context with locals.supabase and params
 * @returns JSON response with campaign or error details
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

  // Get campaign ID from URL params
  const campaignId = context.params.id;

  if (!campaignId) {
    return new Response(
      JSON.stringify({
        error: "Campaign ID is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Get campaign via service layer
  const result = await getCampaign(supabase, userId, campaignId);

  if (!result.success) {
    if (result.errorType === "not_found") {
      return new Response(
        JSON.stringify({
          error: "Campaign not found",
        }),
        {
          status: 404,
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

  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * PATCH /api/campaigns/:id
 * Updates campaign name
 *
 * @param context - Astro API context with locals.supabase, params, and request body
 * @returns JSON response with updated campaign or error details
 */
export async function PATCH(context: APIContext) {
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

  // Get campaign ID from URL params
  const campaignId = context.params.id;

  if (!campaignId) {
    return new Response(
      JSON.stringify({
        error: "Campaign ID is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
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
    validatedData = updateCampaignSchema.parse(requestBody);
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

  // Update campaign via service layer
  const result = await updateCampaign(supabase, userId, campaignId, validatedData);

  if (!result.success) {
    if (result.errorType === "not_found") {
      return new Response(
        JSON.stringify({
          error: "Campaign not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (result.errorType === "conflict") {
      return new Response(
        JSON.stringify({
          error: "A campaign with this name already exists",
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

  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * DELETE /api/campaigns/:id
 * Deletes a campaign and all associated data (CASCADE)
 *
 * @param context - Astro API context with locals.supabase and params
 * @returns 204 No Content on success or error details
 */
export async function DELETE(context: APIContext) {
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

  // Get campaign ID from URL params
  const campaignId = context.params.id;

  if (!campaignId) {
    return new Response(
      JSON.stringify({
        error: "Campaign ID is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Delete campaign via service layer
  const result = await deleteCampaign(supabase, userId, campaignId);

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

  return new Response(null, {
    status: 204,
  });
}
