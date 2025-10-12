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
  const { name, type, size, alignment, limit, offset } = filters;

  // Build query with exact count for pagination
  let query = supabase.from("monsters").select("*", { count: "exact" });

  // Apply name filter (case-insensitive partial match)
  if (name) {
    const sanitized = sanitizeLikePattern(name);
    query = query.ilike("name", `%${sanitized}%`);
  }

  // Apply type filter (exact match, case-insensitive)
  if (type) {
    query = query.ilike("data->>type", type);
  }

  // Apply size filter (exact match, case-insensitive)
  if (size) {
    query = query.ilike("data->>size", size);
  }

  // Apply alignment filter (exact match, case-insensitive)
  if (alignment) {
    query = query.ilike("data->>alignment", alignment);
  }

  // Apply pagination and sorting by name
  query = query.order("name", { ascending: true }).range(offset, offset + limit - 1);

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

/**
 * Fetches a single monster by ID from the global SRD library
 *
 * @param supabase - Supabase client instance
 * @param id - UUID of the monster to retrieve
 * @returns Monster DTO or null if not found
 * @throws Error if database query fails
 */
export async function getMonsterById(supabase: SupabaseClient, id: string): Promise<MonsterDTO | null> {
  const { data, error } = await supabase.from("monsters").select("*").eq("id", id).single();

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

  // Map database row to DTO with typed data field
  return {
    id: data.id,
    name: data.name,
    data: data.data as MonsterDataDTO,
    created_at: data.created_at,
  };
}
