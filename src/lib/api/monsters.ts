import type { ListMonstersResponseDTO } from "@/types";

/**
 * Parameters for fetching monsters from the API
 */
export interface FetchMonstersParams {
  searchQuery?: string;
  type?: string | null;
  size?: string | null;
  alignment?: string | null;
  limit: number;
  offset: number;
}

/**
 * Fetches filtered and paginated list of monsters from the API
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to list of monsters with pagination metadata
 * @throws Error if the request fails or returns invalid data
 */
export async function fetchMonsters(params: FetchMonstersParams): Promise<ListMonstersResponseDTO> {
  const queryParams = new URLSearchParams();

  // Build query string with only defined parameters
  if (params.searchQuery && params.searchQuery.trim()) {
    queryParams.set("name", params.searchQuery.trim());
  }

  if (params.type && params.type.trim()) {
    queryParams.set("type", params.type.trim());
  }

  if (params.size && params.size.trim()) {
    queryParams.set("size", params.size.trim());
  }

  if (params.alignment && params.alignment.trim()) {
    queryParams.set("alignment", params.alignment.trim());
  }

  queryParams.set("limit", String(params.limit));
  queryParams.set("offset", String(params.offset));

  const url = `/api/monsters?${queryParams.toString()}`;

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
    throw new Error("Failed to fetch monsters");
  }
}
