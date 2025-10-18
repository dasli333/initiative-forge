// Conditions tab in reference panel

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ConditionDTO } from "@/types";

interface ConditionsTabProps {
  conditions: ConditionDTO[];
  activeParticipantId: string | null;
  onApply: (conditionId: string) => void;
}

export function ConditionsTab({ conditions, activeParticipantId, onApply }: ConditionsTabProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {conditions.map((condition) => (
        <AccordionItem key={condition.id} value={condition.id}>
          <AccordionTrigger className="text-left">{condition.name.pl}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{condition.description}</p>
              <Button
                size="sm"
                onClick={() => onApply(condition.id)}
                disabled={!activeParticipantId}
                className="w-full"
              >
                {activeParticipantId ? "Apply to Active" : "No Active Character"}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
