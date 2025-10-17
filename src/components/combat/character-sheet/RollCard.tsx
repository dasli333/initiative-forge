// Single roll result card

import { Card, CardContent } from "@/components/ui/card";
import { Sword, Heart, Shield } from "lucide-react";
import type { RollResult } from "@/types/combat-view.types";
import { formatDistanceToNow } from "date-fns";
import { DamageBadge } from "@/components/library";

interface RollCardProps {
  roll: RollResult;
}

export function RollCard({ roll }: RollCardProps) {
  // Icon based on roll type
  const Icon = roll.type === "attack" ? Sword : roll.type === "damage" ? Heart : Shield;

  // Color based on crit/fail
  const resultColor = roll.isCrit ? "text-emerald-600" : roll.isFail ? "text-red-600" : "text-foreground";

  const cardBorder = roll.isCrit ? "border-emerald-500" : roll.isFail ? "border-red-500" : "";

  // Format roll breakdown: "3, 5 + 4 = 12" or "18 + 4 = 22"
  const formatRollBreakdown = () => {
    const rollsStr = roll.rolls.join(", ");

    if (roll.modifier === 0) {
      // No modifier: "3, 5 = 8"
      return `${rollsStr} = ${roll.result}`;
    } else if (roll.modifier > 0) {
      // Positive modifier: "3, 5 + 4 = 12"
      return `${rollsStr} + ${roll.modifier} = ${roll.result}`;
    } else {
      // Negative modifier: "3, 5 - 2 = 6"
      return `${rollsStr} - ${Math.abs(roll.modifier)} = ${roll.result}`;
    }
  };

  return (
    <Card className={`${cardBorder} max-w-full overflow-hidden`}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold capitalize truncate">{roll.type}</span>
            {roll.type === "damage" && roll.damageType && (
              <DamageBadge type={roll.damageType} className="ml-1" />
            )}
          </div>
          <span className={`text-2xl font-bold ${resultColor} shrink-0`}>{roll.result}</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-mono truncate">{formatRollBreakdown()}</p>
          <p className="truncate italic">{roll.formula}</p>
          {roll.actionName && <p className="font-semibold truncate">{roll.actionName}</p>}
          <p className="truncate">{formatDistanceToNow(roll.timestamp, { addSuffix: true })}</p>
        </div>
      </CardContent>
    </Card>
  );
}
