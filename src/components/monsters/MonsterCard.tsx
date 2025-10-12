import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MonsterDTO } from "@/types";

/**
 * Props for MonsterCard component
 */
interface MonsterCardProps {
  /**
   * Monster data to display
   */
  monster: MonsterDTO;
  /**
   * Callback fired when card is clicked
   */
  onClick: (monsterId: string) => void;
}

/**
 * Card component displaying basic monster information
 * Clickable to open detailed view in slideover
 *
 * Shows:
 * - Monster name
 * - Challenge Rating badge (emerald color)
 * - Type and Size
 *
 * @param monster - Monster data from API
 * @param onClick - Handler for card click
 */
export function MonsterCard({ monster, onClick }: MonsterCardProps) {
  const { id, data } = monster;

  const handleClick = () => {
    onClick(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Support keyboard navigation (Enter and Space)
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(id);
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${data.name.en}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight flex-1">{data.name.en}</h3>
          <Badge className="bg-emerald-500 hover:bg-emerald-600 flex-shrink-0">CR {data.challengeRating.rating}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {data.size} {data.type}
        </p>
      </CardContent>
    </Card>
  );
}
