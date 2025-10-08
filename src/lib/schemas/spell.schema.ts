import { z } from "zod";

import { DamageSchema, LocalizedNameSchema, SavingThrowSchema } from "./shared.schema";

/**
 * Casting time information
 */
export const CastingTimeSchema = z.object({
  time: z.string(), // "Action", "Bonus Action", "1 minute", etc.
  isRitual: z.boolean(),
});

export type CastingTime = z.infer<typeof CastingTimeSchema>;

/**
 * Spell components (V, S, M)
 */
export const ComponentsSchema = z.object({
  verbal: z.boolean(),
  somatic: z.boolean(),
  material: z.boolean(),
  materialDescription: z.string().nullable(),
});

export type Components = z.infer<typeof ComponentsSchema>;

/**
 * Spell duration information
 */
export const DurationSchema = z.object({
  durationType: z.string(), // "Instantaneous", "Concentration", "1 minute", etc.
  concentration: z.boolean(),
});

export type Duration = z.infer<typeof DurationSchema>;

/**
 * Full spell data structure stored in the spells.data JSONB column
 */
export const SpellDataSchema = z.object({
  // Localized name (stored in jsonb for i18n support)
  name: LocalizedNameSchema,

  // Basic info
  level: z.number().int().min(0).max(9), // 0 for cantrips, 1-9 for leveled spells
  school: z.string(), // "Evocation", "Abjuration", "Conjuration", etc.
  isCantrip: z.boolean(),

  // Casting details
  classes: z.array(z.string()), // ["Wizard", "Sorcerer", etc.]
  castingTime: CastingTimeSchema,
  range: z.string(), // "60 feet", "Self", "Touch", etc.
  components: ComponentsSchema,
  duration: DurationSchema,

  // Description and mechanics
  description: z.string(),
  attackType: z.string(), // "spell_attack", "saving_throw", "utility", etc.
  ritual: z.boolean(),
  tags: z.array(z.string()),

  // Damage and effects
  damage: z.array(DamageSchema).optional(),
  savingThrow: SavingThrowSchema.optional(),

  // Scaling information
  higherLevels: z.string().optional(), // For leveled spells
  cantripUpgrade: z.string().optional(), // For cantrips

  // Unique identifier for spell
  id: z.string(),
});

export type SpellData = z.infer<typeof SpellDataSchema>;

/**
 * Complete spell entity as stored in database
 */
export const SpellSchema = z.object({
  id: z.string().uuid(),
  name: z.string(), // English name extracted for indexing/search (from data.name.en)
  data: SpellDataSchema, // JSONB column containing full spell data including localized names
  created_at: z.string().datetime(),
});

export type Spell = z.infer<typeof SpellSchema>;
