// Active character sheet (middle column)

import type { CombatParticipantDTO, ActionDTO } from "@/types";
import type { RollMode, RollResult } from "@/types/combat-view.types";
import { CharacterHeader } from "./CharacterHeader";
import { StatsGrid } from "./StatsGrid";
import { ActionsList } from "./ActionsList";
import { RollControls } from "./RollControls";
import { RollLog } from "./RollLog";
import { GradientSeparator, SectionHeader } from "@/components/library";
import { Dumbbell, Swords, Dices } from "lucide-react";

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
    <div className="h-full flex flex-col min-w-0">
      {/* Character Header - Fixed */}
      <div className="flex-shrink-0 min-w-0">
        <CharacterHeader
          name={participant.display_name}
          currentHP={participant.current_hp}
          maxHP={participant.max_hp}
          armorClass={participant.armor_class}
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <section className="overflow-hidden">
            <SectionHeader icon={Dumbbell} title="Ability Scores" />
            <StatsGrid stats={participant.stats} />
          </section>

          <GradientSeparator />

          {/* Actions */}
          <section className="overflow-hidden">
            <SectionHeader icon={Swords} title="Actions" />
            <ActionsList actions={participant.actions} onActionClick={onActionClick} />
          </section>

          <GradientSeparator />

          {/* Roll Controls */}
          <section className="overflow-hidden">
            <RollControls value={rollMode} onChange={onRollModeChange} />
          </section>

          <GradientSeparator />

          {/* Roll Log */}
          <section className="overflow-hidden">
            <SectionHeader icon={Dices} title="Recent Rolls" />
            <RollLog rolls={recentRolls} />
          </section>
        </div>
      </div>
    </div>
  );
}
