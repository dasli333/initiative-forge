// Single roll result card

import { Card, CardContent } from "@/components/ui/card";
import { Sword, Heart, Shield } from "lucide-react";
import type { RollResult } from "@/types/combat-view.types";
import { formatDistanceToNow } from "date-fns";

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
    <Card className={cardBorder}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold capitalize">{roll.type}</span>
          </div>
          <span className={`text-2xl font-bold ${resultColor}`}>{roll.result}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>{roll.formula}</p>
          {roll.actionName && <p className="font-semibold mt-1">{roll.actionName}</p>}
          <p className="mt-1">{formatDistanceToNow(roll.timestamp, { addSuffix: true })}</p>
        </div>
      </CardContent>
    </Card>
  );
}
