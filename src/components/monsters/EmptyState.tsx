import { Search } from "lucide-react";

/**
 * Props for EmptyState component
 */
interface EmptyStateProps {
  /**
   * Custom message to display
   * @default "No monsters found matching your filters"
   */
  message?: string;
  /**
   * Suggestion text to help user
   * @default "Try adjusting your search or filters"
   */
  suggestion?: string;
}

/**
 * Empty state component displayed when no monsters match the current filters
 * Provides helpful guidance to adjust search criteria
 *
 * @param message - Main message to display
 * @param suggestion - Helpful suggestion for the user
 */
export function EmptyState({
  message = "No monsters found matching your filters",
  suggestion = "Try adjusting your search or filters",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Search className="h-16 w-16 text-muted-foreground mb-4" />
      <p className="text-lg font-semibold text-foreground mb-2">{message}</p>
      <p className="text-sm text-muted-foreground">{suggestion}</p>
    </div>
  );
}
