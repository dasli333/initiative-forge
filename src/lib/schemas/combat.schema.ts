import { z } from "zod";

import { PlayerCharacterActionSchema } from "./action.schema";

/**
 * Simplified stats structure for combat participants
 */
export const CombatStatsSchema = z.object({
  str: z.number().int(),
  dex: z.number().int(),
  con: z.number().int(),
  int: z.number().int(),
  wis: z.number().int(),
  cha: z.number().int(),
});

export type CombatStats = z.infer<typeof CombatStatsSchema>;

/**
 * Active condition on a combat participant
 */
export const ActiveConditionSchema = z.object({
  condition_id: z.string().uuid(),
  name: z.string(), // Denormalized for quick access
  duration_in_rounds: z.number().int().nullable(), // null = indefinite duration
});

export type ActiveCondition = z.infer<typeof ActiveConditionSchema>;

/**
 * Combat participant (player character, monster, or ad-hoc NPC)
 */
export const CombatParticipantSchema = z.object({
  // Unique identifier for this participant in this combat
  id: z.string(),

  // Source type and references
  source: z.enum(["player_character", "monster", "ad_hoc_npc"]),
  player_character_id: z.string().uuid().optional(),
  monster_id: z.string().uuid().optional(),

  // Denormalized participant data
  display_name: z.string(),
  initiative: z.number().int(),
  current_hp: z.number().int(),
  max_hp: z.number().int(),
  armor_class: z.number().int(),

  // Ability scores
  stats: CombatStatsSchema,

  // Available actions
  actions: z.array(PlayerCharacterActionSchema),

  // Combat state
  is_active_turn: z.boolean(),
  active_conditions: z.array(ActiveConditionSchema),
});

export type CombatParticipant = z.infer<typeof CombatParticipantSchema>;

/**
 * Combat state snapshot stored in combats.state_snapshot JSONB column
 */
export const CombatSnapshotSchema = z.object({
  participants: z.array(CombatParticipantSchema),
  active_participant_index: z.number().int().nullable(), // null = initiative not rolled yet
});

export type CombatSnapshot = z.infer<typeof CombatSnapshotSchema>;

/**
 * Initial participant data when creating a combat
 */
export const InitialParticipantSchema = z.discriminatedUnion("source", [
  // Player character from campaign
  z.object({
    source: z.literal("player_character"),
    player_character_id: z.string().uuid(),
  }),
  // Monster from library (with optional count for multiple copies)
  z.object({
    source: z.literal("monster"),
    monster_id: z.string().uuid(),
    count: z.number().int().min(1).max(20).optional().default(1),
  }),
  // Ad-hoc NPC created on the fly
  z.object({
    source: z.literal("ad_hoc_npc"),
    display_name: z.string(),
    max_hp: z.number().int(),
    armor_class: z.number().int(),
    stats: CombatStatsSchema,
    actions: z.array(PlayerCharacterActionSchema),
  }),
]);

export type InitialParticipant = z.infer<typeof InitialParticipantSchema>;

/**
 * Complete combat entity as stored in database
 */
export const CombatSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  name: z.string(),
  status: z.enum(["active", "completed"]),
  current_round: z.number().int().min(1),
  state_snapshot: CombatSnapshotSchema.nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Combat = z.infer<typeof CombatSchema>;
