import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { TypeFilter } from "./TypeFilter";
import { SizeFilter } from "./SizeFilter";
import { AlignmentFilter } from "./AlignmentFilter";

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
   * Current type filter
   */
  type: string | null;
  /**
   * Callback fired when type filter changes
   */
  onTypeChange: (type: string | null) => void;
  /**
   * Current size filter
   */
  size: string | null;
  /**
   * Callback fired when size filter changes
   */
  onSizeChange: (size: string | null) => void;
  /**
   * Current alignment filter
   */
  alignment: string | null;
  /**
   * Callback fired when alignment filter changes
   */
  onAlignmentChange: (alignment: string | null) => void;
  /**
   * Callback fired when reset filters button is clicked
   */
  onResetFilters: () => void;
}

/**
 * Header section of the Monsters Library view
 * Contains title, search bar, all filters, and reset button
 *
 * @param props - Component props
 */
export function MonstersHeader({
  searchQuery,
  onSearchChange,
  type,
  onTypeChange,
  size,
  onSizeChange,
  alignment,
  onAlignmentChange,
  onResetFilters,
}: MonstersHeaderProps) {
  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== "" || type !== null || size !== null || alignment !== null;

  return (
    <header className="space-y-4 mb-6">
      {/* Title */}
      <h1 className="text-2xl font-bold">Monsters Library</h1>

      {/* Search bar - full width */}
      <SearchBar value={searchQuery} onChange={onSearchChange} />

      {/* Filters row */}
      <div className="space-y-4">
        {/* First row of filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TypeFilter value={type} onChange={onTypeChange} />
          <SizeFilter value={size} onChange={onSizeChange} />
          <AlignmentFilter value={alignment} onChange={onAlignmentChange} />
        </div>

        {/* Reset filters button */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onResetFilters} size="sm">
            Reset all filters
          </Button>
        )}
      </div>
    </header>
  );
}
