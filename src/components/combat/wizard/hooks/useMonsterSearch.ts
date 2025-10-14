import { useInfiniteQuery } from "@tanstack/react-query";
import type { ListMonstersResponseDTO } from "@/types";

/**
 * Hook do wyszukiwania potworów z infinite scroll
 * Używa TanStack Query (useInfiniteQuery)
 */
export function useMonsterSearch(searchTerm: string, crFilter: string) {
  return useInfiniteQuery({
    queryKey: ["monsters", searchTerm, crFilter],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        search: searchTerm,
        cr: crFilter !== "All" ? crFilter : "",
        limit: "20",
        offset: pageParam.toString(),
      });

      const response = await fetch(`/api/monsters?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch monsters");
      }

      const data: ListMonstersResponseDTO = await response.json();
      return data;
    },
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000, // 10 minut (dane rzadko się zmieniają)
  });
}
