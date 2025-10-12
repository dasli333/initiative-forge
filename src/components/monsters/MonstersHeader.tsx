import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { CRFilter } from "./CRFilter";

/**
 * Props for MonstersHeader component
 */
interface MonstersHeaderProps {
  /**
   * Current search query value
   */
  searchQuery: string;
  /**
   * Callback fired when search query changes
   */
  onSearchChange: (query: string) => void;
  /**
   * Current minimum Challenge Rating filter
   */
  crMin: number | null;
  /**
   * Current maximum Challenge Rating filter
   */
  crMax: number | null;
  /**
   * Callback fired when CR filter changes
   */
  onCRFilterChange: (min: number | null, max: number | null) => void;
  /**
   * Callback fired when reset filters button is clicked
   */
  onResetFilters: () => void;
}

/**
 * Header section of the Monsters Library view
 * Contains title, search bar, CR filter, and reset button
 *
 * @param props - Component props
 */
export function MonstersHeader({
  searchQuery,
  onSearchChange,
  crMin,
  crMax,
  onCRFilterChange,
  onResetFilters,
}: MonstersHeaderProps) {
  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== "" || crMin !== null || crMax !== null;

  return (
    <header className="space-y-6 mb-8">
      {/* Title */}
      <h1 className="text-3xl font-bold">Monsters Library</h1>

      {/* Search bar - full width */}
      <SearchBar value={searchQuery} onChange={onSearchChange} />

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* CR Filter */}
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <CRFilter min={crMin} max={crMax} onChange={onCRFilterChange} />
        </div>

        {/* Reset filters button */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onResetFilters} className="w-full sm:w-auto">
            Reset filters
          </Button>
        )}
      </div>
    </header>
  );
}
