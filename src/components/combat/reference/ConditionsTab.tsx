// Conditions tab in reference panel

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ConditionDTO } from "@/types";
import { formatConditionDescription } from "@/lib/format-description";

interface ConditionsTabProps {
  conditions: ConditionDTO[];
}

export function ConditionsTab({ conditions }: ConditionsTabProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {conditions.map((condition) => (
        <AccordionItem key={condition.id} value={condition.id}>
          <AccordionTrigger className="text-left">{condition.name.pl}</AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground">{formatConditionDescription(condition.description)}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
