// Main Combat Tracker component orchestrating all sub-components

import { useEffect, useCallback, useState } from "react";
import { useCombatStore } from "@/stores/useCombatStore";
import { useConditions } from "@/hooks/queries/useConditions";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { CombatDTO, ActiveConditionDTO, ActionDTO, CombatParticipantDTO } from "@/types";
import { InitiativeList } from "./initiative/InitiativeList";
import { ActiveCharacterSheet } from "./character-sheet/ActiveCharacterSheet";
import { ReferencePanel } from "./reference/ReferencePanel";
import { NextTurnButton } from "./NextTurnButton";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";

interface CombatTrackerProps {
  combatId: string;
  campaignId: string;
  initialData: CombatDTO;
}

export function CombatTracker({ initialData }: CombatTrackerProps) {
  // Zustand store
  const {
    loadCombat,
    participants,
    activeParticipantIndex,
    currentRound,
    rollMode,
    recentRolls,
    rollInitiative,
    nextTurn,
    updateHP,
    addCondition,
    executeAction,
    setRollMode,
    saveSnapshot,
  } = useCombatStore();

  // React Query
  const { data: conditions = [] } = useConditions();

  // Initialize combat state
  useEffect(() => {
    loadCombat(initialData);
  }, [initialData, loadCombat]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    " ": () => {
      // Space bar - next turn
      if (activeParticipantIndex !== null) {
        nextTurn();
      }
    },
  });

  // Get active participant
  const activeParticipant = activeParticipantIndex !== null ? participants[activeParticipantIndex] : null;

  // Handlers
  const handleParticipantUpdate = useCallback(
    (id: string, updates: Partial<CombatParticipantDTO>) => {
      if (updates.current_hp !== undefined) {
        const participant = participants.find((p) => p.id === id);
        if (participant) {
          const diff = updates.current_hp - participant.current_hp;
          const type = diff > 0 ? "heal" : "damage";
          updateHP(id, Math.abs(diff), type);
        }
      }
    },
    [participants, updateHP]
  );

  const handleActionClick = useCallback(
    (action: ActionDTO) => {
      if (activeParticipant) {
        executeAction(activeParticipant.id, action);
      }
    },
    [activeParticipant, executeAction]
  );

  const handleApplyCondition = useCallback(
    (conditionId: string, participantId: string) => {
      const condition = conditions.find((c) => c.id === conditionId);
      if (condition) {
        const activeCondition: ActiveConditionDTO = {
          condition_id: condition.id,
          name: condition.name,
          duration_in_rounds: null, // TODO: Allow user to specify duration
        };
        addCondition(participantId, activeCondition);
      }
    },
    [conditions, addCondition]
  );

  // Unsaved changes dialog (simplified for now)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  return (
    <>
      <div className="h-screen grid grid-cols-[30%_50%_20%]">
        {/* Left Column: Initiative List */}
        <InitiativeList
          participants={participants}
          currentRound={currentRound}
          activeParticipantIndex={activeParticipantIndex}
          onRollInitiative={rollInitiative}
          onParticipantUpdate={handleParticipantUpdate}
          conditions={conditions}
        />

        {/* Middle Column: Active Character Sheet */}
        <ActiveCharacterSheet
          participant={activeParticipant}
          rollMode={rollMode}
          recentRolls={recentRolls}
          onActionClick={handleActionClick}
          onRollModeChange={setRollMode}
        />

        {/* Right Column: Reference Panel */}
        <ReferencePanel
          conditions={conditions}
          activeParticipantId={activeParticipant?.id ?? null}
          onApplyCondition={handleApplyCondition}
        />
      </div>

      {/* Floating Action Button */}
      <NextTurnButton onClick={nextTurn} disabled={activeParticipantIndex === null} />

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onSaveAndLeave={async () => {
          await saveSnapshot();
          setShowUnsavedDialog(false);
          // TODO: Navigate away
        }}
        onLeaveWithoutSaving={() => {
          setShowUnsavedDialog(false);
          // TODO: Navigate away
        }}
        onCancel={() => setShowUnsavedDialog(false)}
      />
    </>
  );
}
