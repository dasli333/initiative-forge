// Active character sheet (middle column)

import type { CombatParticipantDTO, ActionDTO } from "@/types";
import type { RollMode, RollResult } from "@/types/combat-view.types";
import { CharacterHeader } from "./CharacterHeader";
import { StatsGrid } from "./StatsGrid";
import { ActionsList } from "./ActionsList";
import { RollControls } from "./RollControls";
import { RollLog } from "./RollLog";
import { Separator } from "@/components/ui/separator";

interface ActiveCharacterSheetProps {
  participant: CombatParticipantDTO | null;
  rollMode: RollMode;
  recentRolls: RollResult[];
  onActionClick: (action: ActionDTO) => void;
  onRollModeChange: (mode: RollMode) => void;
}

export function ActiveCharacterSheet({
  participant,
  rollMode,
  recentRolls,
  onActionClick,
  onRollModeChange,
}: ActiveCharacterSheetProps) {
  if (!participant) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-8">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold">No Active Character</p>
          <p className="text-sm">Roll initiative to start combat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Character Header */}
      <CharacterHeader
        name={participant.display_name}
        currentHP={participant.current_hp}
        maxHP={participant.max_hp}
        armorClass={participant.armor_class}
      />

      <Separator />

      {/* Stats Grid */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Ability Scores</h3>
        <StatsGrid stats={participant.stats} />
      </div>

      <Separator />

      {/* Actions */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Actions</h3>
        <ActionsList actions={participant.actions} onActionClick={onActionClick} />
      </div>

      <Separator />

      {/* Roll Controls */}
      <RollControls value={rollMode} onChange={onRollModeChange} />

      <Separator />

      {/* Roll Log */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Rolls</h3>
        <RollLog rolls={recentRolls} />
      </div>
    </div>
  );
}
