import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSpells } from "@/lib/api/spells";
import type { ListSpellsResponseDTO } from "@/types";

/**
 * Parameters for the useSpells hook
 */
export interface UseSpellsParams {
  searchQuery: string;
  level: number | null;
  class: string | null;
  limit: number;
}

/**
 * React Query infinite query hook for fetching paginated spells
 *
 * Automatically handles:
 * - Pagination with infinite scroll
 * - Caching (1 hour stale time)
 * - Refetching when filters change
 * - Loading and error states
 *
 * @param params - Filter and pagination parameters
 * @returns React Query infinite query result
 *
 * @example
 * const { data, isLoading, fetchNextPage, hasNextPage } = useSpells({
 *   searchQuery: 'fireball',
 *   level: 3,
 *   class: 'Wizard',
 *   limit: 20
 * });
 * const spells = data?.pages.flatMap(page => page.spells) ?? [];
 */
export function useSpells(params: UseSpellsParams) {
  return useInfiniteQuery<ListSpellsResponseDTO, Error>({
    queryKey: ["spells", params],
    queryFn: ({ pageParam = 0 }) =>
      fetchSpells({
        ...params,
        offset: pageParam as number,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.spells.length, 0);
      // Return next offset if there are more spells to load
      return loadedCount < lastPage.total ? loadedCount : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 1 hour - matches API cache
    retry: 1, // Retry once on failure
  });
}
