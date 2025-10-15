// Header for active character sheet with name, HP bar, and AC

import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";

interface CharacterHeaderProps {
  name: string;
  currentHP: number;
  maxHP: number;
  armorClass: number;
}

export function CharacterHeader({ name, currentHP, maxHP, armorClass }: CharacterHeaderProps) {
  const hpPercentage = (currentHP / maxHP) * 100;
  const hpColor = hpPercentage > 50 ? "bg-emerald-600" : hpPercentage > 25 ? "bg-yellow-600" : "bg-red-600";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="h-5 w-5" />
          <span>{armorClass}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Hit Points</span>
          <span className="font-semibold">
            {currentHP} / {maxHP}
          </span>
        </div>
        <Progress value={hpPercentage} className="h-3" indicatorClassName={hpColor} />
      </div>
    </div>
  );
}
