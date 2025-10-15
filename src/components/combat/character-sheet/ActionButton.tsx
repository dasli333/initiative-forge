// Button for executing an action (attack, spell, etc.)

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sword, Wand2, Zap } from "lucide-react";
import type { ActionDTO } from "@/types";

interface ActionButtonProps {
  action: ActionDTO;
  onClick: (action: ActionDTO) => void;
}

export function ActionButton({ action, onClick }: ActionButtonProps) {
  // Icon based on action type
  const Icon = action.type === "melee" ? Sword : action.type === "ranged" ? Zap : Wand2;

  const attackBonus =
    action.attack_bonus !== undefined && action.attack_bonus !== null
      ? action.attack_bonus >= 0
        ? `+${action.attack_bonus}`
        : `${action.attack_bonus}`
      : null;

  const damageDice = action.damage_dice
    ? action.damage_bonus && action.damage_bonus > 0
      ? `${action.damage_dice}+${action.damage_bonus}`
      : action.damage_dice
    : null;

  return (
    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3" onClick={() => onClick(action)}>
      <Icon className="h-4 w-4 shrink-0" />
      <div className="flex-1 text-left">
        <p className="font-semibold">{action.name}</p>
        {action.description && <p className="text-xs text-muted-foreground line-clamp-1">{action.description}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        {attackBonus && (
          <Badge variant="secondary" className="font-mono">
            {attackBonus}
          </Badge>
        )}
        {damageDice && (
          <Badge variant="secondary" className="font-mono">
            {damageDice}
          </Badge>
        )}
      </div>
    </Button>
  );
}
