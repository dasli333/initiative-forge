import type { SupabaseClient } from "@/db/supabase.client";
import type { ListMonstersResponseDTO, MonsterDTO, MonsterDataDTO } from "@/types";
import type { ListMonstersQuery } from "@/lib/schemas/monster.schema";

/**
 * Sanitizes LIKE pattern to prevent SQL injection
 * Escapes special characters used in PostgreSQL LIKE patterns
 */
function sanitizeLikePattern(pattern: string): string {
  return pattern.replace(/[%_]/g, "\\$&");
}

/**
 * Fetches filtered and paginated list of monsters from the global SRD library
 *
 * @param supabase - Supabase client instance
 * @param filters - Query filters including name search, CR filters, and pagination
 * @returns Response with monsters array and pagination metadata
 * @throws Error if database query fails
 */
export async function listMonsters(
  supabase: SupabaseClient,
  filters: ListMonstersQuery
): Promise<ListMonstersResponseDTO> {
  const { name, cr, cr_min, cr_max, limit, offset } = filters;

  // Build query with exact count for pagination
  let query = supabase.from("monsters").select("*", { count: "exact" });

  // Apply name filter (case-insensitive partial match)
  if (name) {
    const sanitized = sanitizeLikePattern(name);
    query = query.ilike("name", `%${sanitized}%`);
  }

  // Apply exact CR filter
  if (cr) {
    query = query.eq("data->challengeRating->>rating", cr);
  }

  // Apply CR range filters (only if exact CR not specified)
  // Note: This requires cr_numeric column (see migration in implementation plan)
  if (cr_min !== undefined && !cr) {
    query = query.gte("cr_numeric", cr_min);
  }
  if (cr_max !== undefined && !cr) {
    query = query.lte("cr_numeric", cr_max);
  }

  // Apply pagination and sorting by name
  query = query
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  // Execute query
  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Map database rows to DTOs with typed data field
  const monsters: MonsterDTO[] = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    data: row.data as MonsterDataDTO,
    created_at: row.created_at,
  }));

  return {
    monsters,
    total: count ?? 0,
    limit,
    offset,
  };
}
