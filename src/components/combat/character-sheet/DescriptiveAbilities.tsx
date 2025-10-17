// Display descriptive abilities (traits, non-rollable actions, reactions, etc.)

import type { MonsterTrait, MonsterAction, LegendaryActions } from "@/lib/schemas/monster.schema";
import { isRollableMonsterAction, isRollableTrait } from "./utils";
import { BookOpen, Swords, Zap, Shield, Crown } from "lucide-react";

interface DescriptiveAbilitiesProps {
  traits?: MonsterTrait[];
  actions?: MonsterAction[];
  bonusActions?: MonsterAction[];
  reactions?: MonsterAction[];
  legendaryActions?: LegendaryActions;
}

export function DescriptiveAbilities({
  traits,
  actions,
  bonusActions,
  reactions,
  legendaryActions,
}: DescriptiveAbilitiesProps) {
  // Filter out rollable abilities
  const descriptiveTraits = traits?.filter((trait) => !isRollableTrait(trait));
  const descriptiveActions = actions?.filter((action) => !isRollableMonsterAction(action));
  const descriptiveBonusActions = bonusActions?.filter((action) => !isRollableMonsterAction(action));
  const descriptiveReactions = reactions?.filter((action) => !isRollableMonsterAction(action));
  const descriptiveLegendaryActions = legendaryActions?.actions?.filter((action) => !isRollableMonsterAction(action));

  // Don't render if no descriptive abilities
  const hasAny =
    (descriptiveTraits && descriptiveTraits.length > 0) ||
    (descriptiveActions && descriptiveActions.length > 0) ||
    (descriptiveBonusActions && descriptiveBonusActions.length > 0) ||
    (descriptiveReactions && descriptiveReactions.length > 0) ||
    (descriptiveLegendaryActions && descriptiveLegendaryActions.length > 0);

  if (!hasAny) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Traits */}
      {descriptiveTraits && descriptiveTraits.length > 0 && (
        <AbilityGroup
          icon={BookOpen}
          label="Traits"
          abilities={descriptiveTraits.map((t) => ({ name: t.name, description: t.description }))}
        />
      )}

      {/* Actions (non-rollable) */}
      {descriptiveActions && descriptiveActions.length > 0 && (
        <AbilityGroup
          icon={Swords}
          label="Actions"
          abilities={descriptiveActions.map((a) => ({ name: a.name, description: a.description }))}
        />
      )}

      {/* Bonus Actions (non-rollable) */}
      {descriptiveBonusActions && descriptiveBonusActions.length > 0 && (
        <AbilityGroup
          icon={Zap}
          label="Bonus Actions"
          abilities={descriptiveBonusActions.map((a) => ({ name: a.name, description: a.description }))}
        />
      )}

      {/* Reactions (non-rollable) */}
      {descriptiveReactions && descriptiveReactions.length > 0 && (
        <AbilityGroup
          icon={Shield}
          label="Reactions"
          abilities={descriptiveReactions.map((a) => ({ name: a.name, description: a.description }))}
        />
      )}

      {/* Legendary Actions (non-rollable) */}
      {descriptiveLegendaryActions && descriptiveLegendaryActions.length > 0 && legendaryActions && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Crown className="h-3.5 w-3.5" />
            <span>Legendary Actions</span>
          </div>
          {legendaryActions.usageDescription && (
            <p className="text-xs text-muted-foreground italic pl-5">{legendaryActions.usageDescription}</p>
          )}
          <div className="space-y-2 pl-5">
            {descriptiveLegendaryActions.map((action, index) => (
              <AbilityCard key={index} name={action.name} description={action.description} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AbilityGroupProps {
  icon: React.ElementType;
  label: string;
  abilities: { name: string; description: string }[];
}

function AbilityGroup({ icon: Icon, label, abilities }: AbilityGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <div className="space-y-2 pl-5">
        {abilities.map((ability, index) => (
          <AbilityCard key={index} name={ability.name} description={ability.description} />
        ))}
      </div>
    </div>
  );
}

interface AbilityCardProps {
  name: string;
  description: string;
}

function AbilityCard({ name, description }: AbilityCardProps) {
  return (
    <div className="rounded-md border bg-card p-3 space-y-1">
      <h4 className="text-sm font-semibold">{name}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
