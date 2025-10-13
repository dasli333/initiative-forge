import type { UseFormReturn } from "react-hook-form";
import type { CreatePlayerCharacterCommand } from "@/lib/schemas/player-character.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AbilityScoresSectionProps {
  form: UseFormReturn<CreatePlayerCharacterCommand>;
}

/**
 * Form section for D&D 5e ability scores
 * Contains 6 fields: STR, DEX, CON, INT, WIS, CHA
 */
export const AbilityScoresSection = ({ form }: AbilityScoresSectionProps) => {
  const abilityScores = [
    { name: "strength" as const, label: "Strength (STR)" },
    { name: "dexterity" as const, label: "Dexterity (DEX)" },
    { name: "constitution" as const, label: "Constitution (CON)" },
    { name: "intelligence" as const, label: "Intelligence (INT)" },
    { name: "wisdom" as const, label: "Wisdom (WIS)" },
    { name: "charisma" as const, label: "Charisma (CHA)" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {abilityScores.map(({ name, label }) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={30}
                  placeholder="10"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};
