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
        <div className="text-xs text-muted-foreground">
          <p className="truncate">{roll.formula}</p>
          {roll.actionName && <p className="font-semibold mt-1 truncate">{roll.actionName}</p>}
          <p className="mt-1 truncate">{formatDistanceToNow(roll.timestamp, { addSuffix: true })}</p>
        </div>
      </CardContent>
    </Card>
  );
}
