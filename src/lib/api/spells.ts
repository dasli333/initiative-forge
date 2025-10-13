import type { ListSpellsResponseDTO } from "@/types";

/**
 * Parameters for fetching spells from the API
 */
export interface FetchSpellsParams {
  searchQuery?: string;
  level?: number | null;
  class?: string | null;
  limit: number;
  offset: number;
}

/**
 * Fetches filtered and paginated list of spells from the API
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to list of spells with pagination metadata
 * @throws Error if the request fails or returns invalid data
 */
export async function fetchSpells(params: FetchSpellsParams): Promise<ListSpellsResponseDTO> {
  const queryParams = new URLSearchParams();

  // Build query string with only defined parameters
  if (params.searchQuery && params.searchQuery.trim()) {
    queryParams.set("name", params.searchQuery.trim());
  }

  if (params.level !== null && params.level !== undefined) {
    queryParams.set("level", String(params.level));
  }

  if (params.class && params.class.trim()) {
    queryParams.set("class", params.class.trim());
  }

  queryParams.set("limit", String(params.limit));
  queryParams.set("offset", String(params.offset));

  const url = `/api/spells?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch spells");
  }
}
