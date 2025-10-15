// Single participant in initiative list

import { useCallback } from "react";
import { Skull } from "lucide-react";
import type { CombatParticipantDTO, ActiveConditionDTO, ConditionDTO } from "@/types";
import { InitiativeBadge } from "./InitiativeBadge";
import { ACBadge } from "./ACBadge";
import { HPControls } from "./HPControls";
import { ConditionBadge } from "./ConditionBadge";

interface InitiativeItemProps {
  participant: CombatParticipantDTO;
  isActive: boolean;
  onUpdate: (updates: Partial<CombatParticipantDTO>) => void;
  onRemoveCondition: (conditionId: string) => void;
  conditions: ConditionDTO[]; // Full conditions list for tooltips
}

export function InitiativeItem({
  participant,
  isActive,
  onUpdate,
  onRemoveCondition,
  conditions,
}: InitiativeItemProps) {
  const isUnconscious = participant.current_hp === 0;

  const handleHPChange = useCallback(
    (amount: number, type: "damage" | "heal") => {
      const delta = type === "damage" ? -amount : amount;
      const newHP = Math.max(0, Math.min(participant.max_hp, participant.current_hp + delta));
      onUpdate({ current_hp: newHP });
    },
    [participant.current_hp, participant.max_hp, onUpdate]
  );

  const baseClasses = "p-4 border-b transition-all duration-200";
  const activeClasses = isActive ? "ring-2 ring-emerald-500 bg-emerald-500/10" : "";
  const unconsciousClasses = isUnconscious ? "opacity-50" : "";

  return (
    <div className={`${baseClasses} ${activeClasses} ${unconsciousClasses}`}>
      <div className="space-y-3">
        {/* Header: Name + Initiative + AC */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3
              className={`font-semibold ${isActive ? "text-lg" : "text-base"} ${isUnconscious ? "line-through" : ""}`}
            >
              {participant.display_name}
              {isUnconscious && <Skull className="inline ml-2 h-4 w-4" />}
            </h3>
            <p className="text-xs text-muted-foreground capitalize">{participant.source.replace("_", " ")}</p>
          </div>
          <div className="flex gap-2">
            <InitiativeBadge value={participant.initiative} />
            <ACBadge value={participant.armor_class} />
          </div>
        </div>

        {/* HP Controls */}
        <HPControls currentHP={participant.current_hp} maxHP={participant.max_hp} onHPChange={handleHPChange} />

        {/* Active Conditions */}
        {participant.active_conditions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {participant.active_conditions.map((condition) => {
              const fullCondition = conditions.find((c) => c.id === condition.condition_id);
              if (!fullCondition) return null;

              return (
                <ConditionBadge
                  key={condition.condition_id}
                  condition={condition}
                  fullCondition={fullCondition}
                  onRemove={onRemoveCondition}
                />
              );
            })}
          </div>
        )}

        {/* TODO: Add Condition button (future enhancement) */}
      </div>
    </div>
  );
}
