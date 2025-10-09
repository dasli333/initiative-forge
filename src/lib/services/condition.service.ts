import type { SupabaseClient } from "@/db/supabase.client";
import type { ListConditionsResponseDTO, ConditionDTO } from "@/types";

/**
 * Fetches all conditions from the global D&D 5e library
 * Conditions are static reference data, not paginated
 *
 * @param supabase - Supabase client instance
 * @returns Response with conditions array
 * @throws Error if database query fails
 */
export async function listConditions(
  supabase: SupabaseClient
): Promise<ListConditionsResponseDTO> {
  // Fetch all conditions, sorted alphabetically by name
  const { data, error } = await supabase
    .from("conditions")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Map database rows to DTOs
  const conditions: ConditionDTO[] = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
  }));

  return {
    conditions,
  };
}

/**
 * Fetches a single condition by ID from the global D&D 5e library
 *
 * @param supabase - Supabase client instance
 * @param id - UUID of the condition to retrieve
 * @returns Condition DTO or null if not found
 * @throws Error if database query fails
 */
export async function getConditionById(
  supabase: SupabaseClient,
  id: string
): Promise<ConditionDTO | null> {
  const { data, error } = await supabase
    .from("conditions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    // Handle not found case separately
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Database error: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Map database row to DTO
  return {
    id: data.id,
    name: data.name,
    description: data.description,
  };
}
