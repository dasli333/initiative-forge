import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMonsters } from "@/lib/api/monsters";
import type { ListMonstersResponseDTO } from "@/types";

/**
 * Parameters for the useMonsters hook
 */
export interface UseMonstersParams {
  searchQuery: string;
  crMin: number | null;
  crMax: number | null;
  limit: number;
}

/**
 * React Query infinite query hook for fetching paginated monsters
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
 * const { data, isLoading, fetchNextPage, hasNextPage } = useMonsters({
 *   searchQuery: 'dragon',
 *   crMin: 5,
 *   crMax: 15,
 *   limit: 20
 * });
 * const monsters = data?.pages.flatMap(page => page.monsters) ?? [];
 */
export function useMonsters(params: UseMonstersParams) {
  return useInfiniteQuery<ListMonstersResponseDTO, Error>({
    queryKey: ["monsters", params],
    queryFn: ({ pageParam = 0 }) =>
      fetchMonsters({
        ...params,
        offset: pageParam as number,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.monsters.length, 0);
      // Return next offset if there are more monsters to load
      return loadedCount < lastPage.total ? loadedCount : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 1 hour - matches API cache
    retry: 1, // Retry once on failure
  });
}
