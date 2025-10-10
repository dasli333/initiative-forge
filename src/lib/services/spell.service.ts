import type { SupabaseClient } from "@/db/supabase.client";
import type { ListSpellsResponseDTO, SpellDTO, SpellDataDTO } from "@/types";
import type { ListSpellsQuery } from "@/lib/schemas/spell.schema";

/**
 * Sanitizes LIKE pattern to prevent SQL injection
 * Escapes special characters used in PostgreSQL LIKE patterns
 */
function sanitizeLikePattern(pattern: string): string {
  return pattern.replace(/[%_]/g, "\\$&");
}

/**
 * Fetches filtered and paginated list of spells from the global SRD library
 *
 * @param supabase - Supabase client instance
 * @param filters - Query filters including name search, level, class, and pagination
 * @returns Response with spells array and pagination metadata
 * @throws Error if database query fails
 */
export async function listSpells(supabase: SupabaseClient, filters: ListSpellsQuery): Promise<ListSpellsResponseDTO> {
  const { name, level, class: spellClass, limit, offset } = filters;

  // Build query with exact count for pagination
  let query = supabase.from("spells").select("*", { count: "exact" });

  // Apply name filter (case-insensitive partial match)
  if (name) {
    const sanitized = sanitizeLikePattern(name);
    query = query.ilike("name", `%${sanitized}%`);
  }

  // Apply level filter (exact match on data->level)
  if (level !== undefined) {
    query = query.eq("data->level", level);
  }

  // Apply class filter (array contains check - case sensitive)
  if (spellClass) {
    query = query.contains("data->classes", [spellClass]);
  }

  // Apply pagination and sorting by level then name
  query = query
    .order("data->level", { ascending: true })
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  // Execute query
  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Map database rows to DTOs with typed data field
  const spells: SpellDTO[] = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    data: row.data as SpellDataDTO,
    created_at: row.created_at,
  }));

  return {
    spells,
    total: count ?? 0,
    limit,
    offset,
  };
}

/**
 * Fetches a single spell by ID from the global SRD library
 *
 * @param supabase - Supabase client instance
 * @param id - UUID of the spell to retrieve
 * @returns Spell DTO or null if not found
 * @throws Error if database query fails
 */
export async function getSpellById(supabase: SupabaseClient, id: string): Promise<SpellDTO | null> {
  const { data, error } = await supabase.from("spells").select("*").eq("id", id).single();

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
    data: data.data as SpellDataDTO,
    created_at: data.created_at,
  };
}
