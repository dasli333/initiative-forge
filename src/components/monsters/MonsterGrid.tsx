import { useEffect, useRef } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonsterCard } from "./MonsterCard";
import { SkeletonCards } from "./SkeletonCards";
import { EmptyState } from "./EmptyState";
import type { MonsterDTO } from "@/types";

/**
 * Props for MonsterGrid component
 */
interface MonsterGridProps {
  /**
   * Array of monsters to display
   */
  monsters: MonsterDTO[];
  /**
   * Whether initial data is loading
   */
  isLoading: boolean;
  /**
   * Whether an error occurred
   */
  isError: boolean;
  /**
   * Callback fired when a monster card is clicked
   */
  onMonsterClick: (monsterId: string) => void;
  /**
   * Whether there are more pages to load
   */
  hasNextPage: boolean;
  /**
   * Whether the next page is currently being fetched
   */
  isFetchingNextPage: boolean;
  /**
   * Callback to load the next page (infinite scroll)
   */
  onLoadMore: () => void;
  /**
   * Optional refetch function for error recovery
   */
  refetch?: () => void;
}

/**
 * Grid container for displaying monster cards with infinite scroll
 *
 * Features:
 * - Responsive grid layout (2 columns @ 1024px, 3 columns @ 1280px)
 * - Skeleton loading state
 * - Empty state when no results
 * - Error state with retry button
 * - Infinite scroll using Intersection Observer
 *
 * @param props - Component props
 */
export function MonsterGrid({
  monsters,
  isLoading,
  isError,
  onMonsterClick,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  refetch,
}: MonsterGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Trigger load more when target is visible and conditions are met
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 0.8 } // Trigger at 80% visibility
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // Initial loading state
  if (isLoading && !isFetchingNextPage) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <SkeletonCards count={20} />
      </div>
    );
  }

  // Error state
  if (isError && monsters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <p className="text-lg font-semibold mb-2">Failed to load monsters</p>
        <p className="text-sm text-muted-foreground mb-4">Please try again</p>
        {refetch && (
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Empty state (no results)
  if (!isLoading && monsters.length === 0) {
    return <EmptyState />;
  }

  // Main grid with monsters
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {monsters.map((monster) => (
          <MonsterCard key={monster.id} monster={monster} onClick={onMonsterClick} />
        ))}
      </div>

      {/* Infinite scroll trigger element */}
      <div ref={observerTarget} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading more monsters...</span>
          </div>
        )}
      </div>
    </div>
  );
}
