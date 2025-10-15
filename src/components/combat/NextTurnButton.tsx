// Floating Action Button for advancing to next turn

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface NextTurnButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function NextTurnButton({ onClick, disabled = false }: NextTurnButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg animate-pulse"
      aria-label="Next turn (Space)"
    >
      <ArrowRight className="h-6 w-6" />
      <span className="sr-only">Next Turn (Space)</span>
    </Button>
  );
}
