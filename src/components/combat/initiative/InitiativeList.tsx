// Initiative list (left column)

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CombatParticipantDTO, ConditionDTO } from "@/types";
import { InitiativeHeader } from "./InitiativeHeader";
import { InitiativeItem } from "./InitiativeItem";

interface InitiativeListProps {
  participants: CombatParticipantDTO[];
  currentRound: number;
  activeParticipantIndex: number | null;
  onRollInitiative: () => void;
  onParticipantUpdate: (id: string, updates: Partial<CombatParticipantDTO>) => void;
  onAddCondition: (participantId: string, conditionId: string, duration: number | null) => void;
  onRemoveCondition: (participantId: string, conditionId: string) => void;
  conditions: ConditionDTO[]; // Full conditions list
}

export function InitiativeList({
  participants,
  currentRound,
  activeParticipantIndex,
  onRollInitiative,
  onParticipantUpdate,
  onAddCondition,
  onRemoveCondition,
  conditions,
}: InitiativeListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active participant
  useEffect(() => {
    if (activeItemRef.current && activeParticipantIndex !== null) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeParticipantIndex]);

  const initiativeRolled = activeParticipantIndex !== null;

  return (
    <div className="flex flex-col h-full border-r">
      <InitiativeHeader
        currentRound={currentRound}
        onRollInitiative={onRollInitiative}
        initiativeRolled={initiativeRolled}
      />
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {participants.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No participants in combat</p>
          </div>
        ) : (
          participants.map((participant, index) => (
            <div key={participant.id} ref={index === activeParticipantIndex ? activeItemRef : undefined}>
              <InitiativeItem
                participant={participant}
                isActive={index === activeParticipantIndex}
                onUpdate={(updates) => onParticipantUpdate(participant.id, updates)}
                onRemoveCondition={(conditionId) => onRemoveCondition(participant.id, conditionId)}
                onAddCondition={(conditionId, duration) => onAddCondition(participant.id, conditionId, duration)}
                conditions={conditions}
              />
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
