// Grid of 6 ability scores

import type { StatsDTO } from "@/types";
import { StatCard } from "./StatCard";
import { calculateModifier } from "@/lib/dice";

interface StatsGridProps {
  stats: StatsDTO;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const abilities = [
    { name: "STR", score: stats.str },
    { name: "DEX", score: stats.dex },
    { name: "CON", score: stats.con },
    { name: "INT", score: stats.int },
    { name: "WIS", score: stats.wis },
    { name: "CHA", score: stats.cha },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {abilities.map((ability) => (
        <StatCard
          key={ability.name}
          name={ability.name}
          score={ability.score}
          modifier={calculateModifier(ability.score)}
        />
      ))}
    </div>
  );
}
