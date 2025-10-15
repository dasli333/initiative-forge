// Zustand store for combat state management
// This store manages real-time combat state with zero latency
// State is persisted to backend via saveSnapshot() method

import { create } from "zustand";
import type { CombatState } from "@/types/combat-view.types";
import type { CombatDTO, ActiveConditionDTO, ActionDTO, CombatSnapshotDTO } from "@/types";
import { rollDice, calculateModifier, executeAttack, createRollResults } from "@/lib/dice";

export const useCombatStore = create<CombatState>((set, get) => ({
  // Stan początkowy
  combat: null,
  participants: [],
  activeParticipantIndex: null,
  currentRound: 1,
  rollMode: "normal",
  recentRolls: [],
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  // Akcja: Załaduj combat z API
  loadCombat: (combat: CombatDTO) => {
    set({
      combat,
      participants: combat.state_snapshot?.participants || [],
      activeParticipantIndex: combat.state_snapshot?.active_participant_index ?? null,
      currentRound: combat.current_round,
      isDirty: false,
      recentRolls: [],
    });
  },

  // Akcja: Rzuć inicjatywę dla wszystkich
  rollInitiative: () => {
    const { participants } = get();

    const withInitiative = participants.map((p) => ({
      ...p,
      initiative: rollDice(1, 20)[0] + calculateModifier(p.stats.dex),
    }));

    // Sortuj malejąco po inicjatywie
    const sorted = withInitiative.sort((a, b) => b.initiative - a.initiative);

    set({
      participants: sorted,
      activeParticipantIndex: 0,
      isDirty: true,
    });
  },

  // Akcja: Następna tura
  nextTurn: () => {
    const { participants, activeParticipantIndex } = get();

    if (activeParticipantIndex === null) return;

    const nextIndex = activeParticipantIndex + 1;

    if (nextIndex >= participants.length) {
      // Koniec rundy
      set((state) => ({
        activeParticipantIndex: 0,
        currentRound: state.currentRound + 1,
        isDirty: true,
      }));

      // TODO: Toast notification "Round X begins"
    } else {
      set({
        activeParticipantIndex: nextIndex,
        isDirty: true,
      });
    }
  },

  // Akcja: Aktualizuj HP
  updateHP: (participantId: string, amount: number, type: "damage" | "heal") => {
    set((state) => ({
      participants: state.participants.map((p) => {
        if (p.id !== participantId) return p;

        const delta = type === "damage" ? -amount : amount;
        const newHP = Math.max(0, Math.min(p.max_hp, p.current_hp + delta));

        return { ...p, current_hp: newHP };
      }),
      isDirty: true,
    }));
  },

  // Akcja: Dodaj warunek
  addCondition: (participantId: string, condition: ActiveConditionDTO) => {
    set((state) => ({
      participants: state.participants.map((p) => {
        if (p.id !== participantId) return p;

        // Sprawdź duplikaty
        if (p.active_conditions.some((c) => c.condition_id === condition.condition_id)) {
          return p;
        }

        return {
          ...p,
          active_conditions: [...p.active_conditions, condition],
        };
      }),
      isDirty: true,
    }));
  },

  // Akcja: Usuń warunek
  removeCondition: (participantId: string, conditionId: string) => {
    set((state) => ({
      participants: state.participants.map((p) => {
        if (p.id !== participantId) return p;

        return {
          ...p,
          active_conditions: p.active_conditions.filter((c) => c.condition_id !== conditionId),
        };
      }),
      isDirty: true,
    }));
  },

  // Akcja: Wykonaj akcję (atak)
  executeAction: (participantId: string, action: ActionDTO) => {
    const { rollMode } = get();

    // Wykonaj atak z obecnym trybem rzutu
    const result = executeAttack(action, rollMode);

    // Stwórz obiekty RollResult
    const rollResults = createRollResults(action, result.attack, result.damage);

    // Dodaj do roll log (max 3)
    set((state) => ({
      recentRolls: [...rollResults, ...state.recentRolls].slice(0, 3),
    }));
  },

  // Akcja: Zmień tryb rzutu
  setRollMode: (mode) => {
    set({ rollMode: mode });
  },

  // Akcja: Zapisz snapshot do API
  saveSnapshot: async () => {
    const { combat, participants, activeParticipantIndex, currentRound, isSaving } = get();

    if (!combat || isSaving) return;

    set({ isSaving: true });

    try {
      const snapshot: CombatSnapshotDTO = {
        participants,
        active_participant_index: activeParticipantIndex,
      };

      const response = await fetch(`/api/combats/${combat.id}/snapshot`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state_snapshot: snapshot,
          current_round: currentRound,
        }),
      });

      if (!response.ok) throw new Error("Save failed");

      set({
        isDirty: false,
        isSaving: false,
        lastSavedAt: new Date(),
      });
    } catch (error) {
      set({ isSaving: false });
      // TODO: Wyświetl toast z błędem
      throw error;
    }
  },

  // Akcja: Oznacz jako zapisane
  markClean: () => {
    set({ isDirty: false });
  },

  // Akcja: Reset stanu
  reset: () => {
    set({
      combat: null,
      participants: [],
      activeParticipantIndex: null,
      currentRound: 1,
      rollMode: "normal",
      recentRolls: [],
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
    });
  },
}));
