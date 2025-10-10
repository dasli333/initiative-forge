import { Swords, Users } from "lucide-react";
import { NavItem } from "./NavItem";
import type { ActiveCombatViewModel } from "@/types";

interface CampaignNavProps {
  selectedCampaignId: string | null;
  activeCombat: ActiveCombatViewModel | null;
  currentPath: string;
}

export function CampaignNav({
  selectedCampaignId,
  activeCombat,
  currentPath,
}: CampaignNavProps) {
  if (!selectedCampaignId) {
    return null;
  }

  const combatHref = activeCombat ? `/combats/${activeCombat.combat_id}` : "#";
  const charactersHref = `/campaigns/${selectedCampaignId}/characters`;

  return (
    <div className="mt-6 space-y-1">
      <h2 className="px-4 text-xs uppercase text-slate-500 mb-2 font-semibold tracking-wider">
        Campaign
      </h2>
      <ul role="list" className="space-y-1">
        <NavItem
          icon={Swords}
          label="Combat"
          href={combatHref}
          isActive={currentPath.startsWith("/combats/")}
          isDisabled={!activeCombat}
          badge={
            activeCombat
              ? {
                  text: "Active",
                  variant: "default",
                  animate: true,
                }
              : undefined
          }
        />
        <NavItem
          icon={Users}
          label="Player Characters"
          href={charactersHref}
          isActive={currentPath === charactersHref || currentPath.startsWith(charactersHref + "/")}
        />
      </ul>
    </div>
  );
}
