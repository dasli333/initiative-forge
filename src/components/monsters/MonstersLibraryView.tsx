import { useState } from "react";
import { MonstersHeader } from "./MonstersHeader";
import { MonsterGrid } from "./MonsterGrid";
import { MonsterSlideover } from "./MonsterSlideover";
import { useDebouncedValue } from "@/components/hooks/useDebouncedValue";
import { useMonsters } from "@/components/hooks/useMonsters";

/**
 * Main container component for the Monsters Library view
 * Manages all state and orchestrates child components
 *
 * Features:
 * - Search by monster name (debounced 300ms)
 * - Filter by Challenge Rating range
 * - Infinite scroll pagination
 * - Slideover for detailed monster view
 * - React Query for server state management
 *
 * State management:
 * - Local state: filters (search, CR), slideover (selected monster, open state)
 * - Server state: React Query (monsters data, loading, error, pagination)
 */
export function MonstersLibraryView() {
  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [crMin, setCrMin] = useState<number | null>(null);
  const [crMax, setCrMax] = useState<number | null>(null);

  // Debounced search query to reduce API calls
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Slideover state
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState<boolean>(false);

  // Fetch monsters with React Query infinite query
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMonsters({
    searchQuery: debouncedSearchQuery,
    crMin,
    crMax,
    limit: 20,
  });

  // Flatten paginated data into single array
  const monsters = data?.pages.flatMap((page) => page.monsters) ?? [];

  // Find selected monster from loaded data
  const selectedMonster = monsters.find((m) => m.id === selectedMonsterId) ?? null;

  /**
   * Handlers
   */

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCRFilterChange = (min: number | null, max: number | null) => {
    // Validation is handled by CRFilter component
    setCrMin(min);
    setCrMax(max);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCrMin(null);
    setCrMax(null);
  };

  const handleMonsterClick = (monsterId: string) => {
    setSelectedMonsterId(monsterId);
    setIsSlideoverOpen(true);
  };

  const handleSlideoverOpenChange = (open: boolean) => {
    setIsSlideoverOpen(open);
    // Clear selected monster when closing
    if (!open) {
      setSelectedMonsterId(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header with search and filters */}
      <MonstersHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        crMin={crMin}
        crMax={crMax}
        onCRFilterChange={handleCRFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Monster grid with infinite scroll */}
      <MonsterGrid
        monsters={monsters}
        isLoading={isLoading}
        isError={isError}
        onMonsterClick={handleMonsterClick}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        refetch={refetch}
      />

      {/* Slideover for monster details */}
      <MonsterSlideover monster={selectedMonster} isOpen={isSlideoverOpen} onOpenChange={handleSlideoverOpenChange} />
    </div>
  );
}
