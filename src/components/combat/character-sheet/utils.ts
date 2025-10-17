// Utility functions for character sheet components

import type { ActionDTO } from "@/types";
import type { MonsterAction, MonsterTrait } from "@/lib/schemas/monster.schema";

/**
 * Checks if an ActionDTO has rollable dice (attack roll or damage)
 */
export function isRollableAction(action: ActionDTO): boolean {
  return !!(action.attackRoll || (action.damage && action.damage.length > 0));
}

/**
 * Checks if a MonsterAction has rollable dice (attack roll or damage)
 */
export function isRollableMonsterAction(action: MonsterAction): boolean {
  return !!(action.attackRoll || (action.damage && action.damage.length > 0));
}

/**
 * Checks if a MonsterTrait has rollable dice (damage)
 */
export function isRollableTrait(trait: MonsterTrait): boolean {
  return !!(trait.damage && trait.damage.length > 0);
}
