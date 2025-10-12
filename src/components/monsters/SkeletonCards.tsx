import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props for SkeletonCards component
 */
interface SkeletonCardsProps {
  /**
   * Number of skeleton cards to display
   * @default 20
   */
  count?: number;
}

/**
 * Loading state component that displays skeleton cards while monsters are being fetched
 * Maintains the same layout as actual MonsterCard components
 *
 * @param count - Number of skeleton cards to render (default: 20)
 */
export function SkeletonCards({ count = 20 }: SkeletonCardsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
