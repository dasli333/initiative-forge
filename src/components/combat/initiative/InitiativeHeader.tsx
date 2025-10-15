// Header for initiative list with round counter and roll button

import { RoundCounter } from "./RoundCounter";
import { RollInitiativeButton } from "./RollInitiativeButton";

interface InitiativeHeaderProps {
  currentRound: number;
  onRollInitiative: () => void;
  initiativeRolled: boolean;
}

export function InitiativeHeader({ currentRound, onRollInitiative, initiativeRolled }: InitiativeHeaderProps) {
  return (
    <div className="p-4 space-y-4 border-b">
      <RoundCounter round={currentRound} />
      <RollInitiativeButton onClick={onRollInitiative} disabled={initiativeRolled} />
    </div>
  );
}
