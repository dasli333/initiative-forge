// Reference panel (right column) with tabs for Conditions, Spells, Monsters

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Search } from "lucide-react";
import type { ConditionDTO } from "@/types";
import { ConditionsTab } from "./ConditionsTab";

interface ReferencePanelProps {
  conditions: ConditionDTO[];
  activeParticipantId: string | null;
  onApplyCondition: (conditionId: string, participantId: string) => void;
}

export function ReferencePanel({ conditions, activeParticipantId, onApplyCondition }: ReferencePanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConditions = conditions.filter((condition) =>
    condition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyCondition = (conditionId: string) => {
    if (activeParticipantId) {
      onApplyCondition(conditionId, activeParticipantId);
    }
  };

  return (
    <div className="flex flex-col h-full border-l">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            maxLength={100}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="conditions" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="spells">Spells</TabsTrigger>
          <TabsTrigger value="monsters">Monsters</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="conditions" className="p-4 mt-0">
            <ConditionsTab
              conditions={filteredConditions}
              activeParticipantId={activeParticipantId}
              onApply={handleApplyCondition}
            />
          </TabsContent>

          <TabsContent value="spells" className="p-4 mt-0">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Spells tab - coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="monsters" className="p-4 mt-0">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Monsters tab - coming soon</p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
