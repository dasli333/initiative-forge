// Dice rolling utilities for D&D 5e combat
// Handles dice rolls, modifiers, advantage/disadvantage, and attack execution

import type { ActionDTO } from "@/types";
import type { RollMode, RollResult } from "@/types/combat-view.types";

/**
 * Roll dice with specified count and sides
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @returns Array of individual roll results
 */
export function rollDice(count: number, sides: number): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
}

/**
 * Calculate ability modifier from ability score
 * Formula: floor((score - 10) / 2)
 * @param score Ability score (1-30)
 * @returns Modifier (-5 to +10)
 */
export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Roll a d20 with advantage/disadvantage support
 * @param mode Roll mode: normal, advantage, or disadvantage
 * @param modifier Bonus/penalty to add to the roll
 * @returns Object with rolls array, final result, and crit/fail flags
 */
export function rollD20(
  mode: RollMode,
  modifier: number
): {
  rolls: number[];
  result: number;
  isCrit: boolean;
  isFail: boolean;
} {
  let rolls: number[];

  if (mode === "advantage" || mode === "disadvantage") {
    // Roll 2d20
    rolls = rollDice(2, 20);

    // Select higher (advantage) or lower (disadvantage)
    const selected = mode === "advantage" ? Math.max(...rolls) : Math.min(...rolls);

    // Check for natural 20 or 1 (only the selected die counts)
    const isCrit = selected === 20;
    const isFail = selected === 1;

    return {
      rolls,
      result: selected + modifier,
      isCrit,
      isFail,
    };
  }

  // Normal roll
  rolls = rollDice(1, 20);
  const isCrit = rolls[0] === 20;
  const isFail = rolls[0] === 1;

  return {
    rolls,
    result: rolls[0] + modifier,
    isCrit,
    isFail,
  };
}

/**
 * Parse damage dice formula and roll
 * Supports formats like "1d8+3", "2d6", "1d10+5"
 * @param formula Damage dice formula
 * @returns Object with rolls, total, and formula
 */
export function rollDamage(formula: string): {
  rolls: number[];
  total: number;
  formula: string;
} {
  // Parse formula like "1d8+3" or "2d6"
  const match = formula.match(/(\d+)d(\d+)(?:\+(\d+))?/);

  if (!match) {
    // Invalid formula, return 0
    return { rolls: [], total: 0, formula };
  }

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const bonus = match[3] ? parseInt(match[3], 10) : 0;

  const rolls = rollDice(count, sides);
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + bonus;

  return {
    rolls,
    total,
    formula,
  };
}

/**
 * Execute an attack action with attack roll and damage
 * @param action Action to execute
 * @param mode Roll mode for the attack roll
 * @returns Attack and damage roll results
 */
export function executeAttack(
  action: ActionDTO,
  mode: RollMode
): {
  attack: {
    rolls: number[];
    result: number;
    isCrit: boolean;
    isFail: boolean;
  };
  damage: {
    rolls: number[];
    total: number;
    formula: string;
  } | null;
} {
  // Roll attack
  const attackBonus = action.attack_bonus || 0;
  const attack = rollD20(mode, attackBonus);

  // Roll damage if action has damage dice
  let damage: { rolls: number[]; total: number; formula: string } | null = null;

  if (action.damage_dice) {
    // Build damage formula
    const damageBonus = action.damage_bonus || 0;
    const formula = damageBonus > 0 ? `${action.damage_dice}+${damageBonus}` : action.damage_dice;

    damage = rollDamage(formula);

    // Double damage on crit
    if (attack.isCrit && damage) {
      const critRolls = rollDice(damage.rolls.length, parseInt(action.damage_dice.split("d")[1], 10));
      damage.rolls = [...damage.rolls, ...critRolls];
      damage.total = damage.rolls.reduce((sum, roll) => sum + roll, 0) + damageBonus;
    }
  }

  return {
    attack,
    damage,
  };
}

/**
 * Format roll result for display
 * @param rolls Array of individual die rolls
 * @param modifier Modifier applied
 * @returns Formatted string like "12, 18 (+5) = 23"
 */
export function formatRollResult(rolls: number[], modifier: number): string {
  const rollsStr = rolls.join(", ");
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
  return `${rollsStr} (${modStr}) = ${total}`;
}

/**
 * Create RollResult object from attack execution
 * @param action Action that was executed
 * @param attackResult Attack roll result
 * @param damageResult Damage roll result (optional)
 * @returns Array of RollResult objects (attack + damage)
 */
export function createRollResults(
  action: ActionDTO,
  attackResult: ReturnType<typeof executeAttack>["attack"],
  damageResult: ReturnType<typeof executeAttack>["damage"]
): RollResult[] {
  const results: RollResult[] = [];

  // Attack roll result
  const attackBonus = action.attack_bonus || 0;
  const attackFormula = `1d20${attackBonus >= 0 ? "+" : ""}${attackBonus}`;

  results.push({
    id: crypto.randomUUID(),
    type: "attack",
    result: attackResult.result,
    formula: attackFormula,
    rolls: attackResult.rolls,
    modifier: attackBonus,
    timestamp: new Date(),
    isCrit: attackResult.isCrit,
    isFail: attackResult.isFail,
    actionName: action.name,
  });

  // Damage roll result (if applicable)
  if (damageResult) {
    const damageBonus = action.damage_bonus || 0;
    const damageFormula = damageResult.formula;

    results.push({
      id: crypto.randomUUID(),
      type: "damage",
      result: damageResult.total,
      formula: damageFormula,
      rolls: damageResult.rolls,
      modifier: damageBonus,
      timestamp: new Date(),
      actionName: action.name,
    });
  }

  return results;
}
