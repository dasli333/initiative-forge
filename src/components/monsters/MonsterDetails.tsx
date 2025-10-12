import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Info, Dumbbell, Sparkles, Swords, Zap, Shield } from "lucide-react";
import type { MonsterDataDTO } from "@/types";

/**
 * Props for MonsterDetails component
 */
interface MonsterDetailsProps {
  /**
   * Monster data to display
   */
  data: MonsterDataDTO;
}

/**
 * Formats ability modifier with + or - sign
 */
function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : String(modifier);
}

/**
 * Gets color classes for damage type badge
 */
function getDamageTypeColor(damageType?: string): string {
  if (!damageType) return "bg-red-500/10 text-red-500 border-red-500/20";

  const type = damageType.toLowerCase();
  if (type.includes("fire")) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  if (type.includes("cold") || type.includes("ice")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  if (type.includes("poison") || type.includes("acid")) return "bg-green-500/10 text-green-500 border-green-500/20";
  if (type.includes("lightning") || type.includes("thunder"))
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  if (type.includes("necrotic")) return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  if (type.includes("radiant")) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  if (type.includes("psychic")) return "bg-pink-500/10 text-pink-500 border-pink-500/20";

  return "bg-red-500/10 text-red-500 border-red-500/20";
}

/**
 * Comprehensive monster details component displaying all monster statistics
 * Used inside the MonsterSlideover
 *
 * Sections:
 * - Basic Info (Size, Type, Alignment, AC, HP, Speed)
 * - Ability Scores Table (STR, DEX, CON, INT, WIS, CHA)
 * - Skills, Senses, Languages
 * - Traits (Accordion)
 * - Actions (Accordion)
 * - Bonus Actions (Accordion - conditional)
 * - Reactions (Accordion - conditional)
 *
 * @param data - Full monster data from API
 */
export function MonsterDetails({ data }: MonsterDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <section className="max-w-[600px]">
        <h3 className="flex items-center gap-2 text-base font-bold mb-3 text-emerald-500">
          <Info className="h-5 w-5" />
          Basic Info
        </h3>
        <div className="bg-card/50 border border-border/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-8 text-sm">
            {/* Column 1: Type, Size, Alignment */}
            <div className="space-y-2">
              <div>
                <span className="text-emerald-500/90 font-medium">Type:</span>{" "}
                <span className="text-foreground font-medium">{data.type}</span>
              </div>
              <div>
                <span className="text-emerald-500/90 font-medium">Size:</span>{" "}
                <span className="text-foreground font-medium">{data.size}</span>
              </div>
              <div>
                <span className="text-emerald-500/90 font-medium">Alignment:</span>{" "}
                <span className="text-foreground font-medium">{data.alignment}</span>
              </div>
            </div>

            {/* Column 2: HP, AC, Speed */}
            <div className="space-y-2">
              <div>
                <span className="text-emerald-500/90 font-medium">HP:</span>{" "}
                <span className="text-foreground font-medium">
                  {data.hitPoints.average} ({data.hitPoints.formula})
                </span>
              </div>
              <div>
                <span className="text-emerald-500/90 font-medium">AC:</span>{" "}
                <span className="text-foreground font-medium">{data.armorClass}</span>
              </div>
              <div>
                <span className="text-emerald-500/90 font-medium">Speed:</span>{" "}
                <span className="text-foreground font-medium">{data.speed.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Ability Scores Table */}
      <section className="max-w-[600px]">
        <h3 className="flex items-center gap-2 text-base font-bold mb-3 text-emerald-500">
          <Dumbbell className="h-5 w-5" />
          Ability Scores
        </h3>
        <div className="rounded-lg overflow-hidden border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-center font-semibold">STR</TableHead>
                <TableHead className="text-center font-semibold">DEX</TableHead>
                <TableHead className="text-center font-semibold">CON</TableHead>
                <TableHead className="text-center font-semibold">INT</TableHead>
                <TableHead className="text-center font-semibold">WIS</TableHead>
                <TableHead className="text-center font-semibold">CHA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-center">
                  <div className="font-medium">{data.abilityScores.strength.score}</div>
                  <span
                    className={`text-xs font-medium ${
                      data.abilityScores.strength.modifier >= 0 ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    ({formatModifier(data.abilityScores.strength.modifier)})
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium">{data.abilityScores.dexterity.score}</div>
                  <span
                    className={`text-xs font-medium ${
                      data.abilityScores.dexterity.modifier >= 0 ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    ({formatModifier(data.abilityScores.dexterity.modifier)})
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium">{data.abilityScores.constitution.score}</div>
                  <span
                    className={`text-xs font-medium ${
                      data.abilityScores.constitution.modifier >= 0 ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    ({formatModifier(data.abilityScores.constitution.modifier)})
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium">{data.abilityScores.intelligence.score}</div>
                  <span
                    className={`text-xs font-medium ${
                      data.abilityScores.intelligence.modifier >= 0 ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    ({formatModifier(data.abilityScores.intelligence.modifier)})
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium">{data.abilityScores.wisdom.score}</div>
                  <span
                    className={`text-xs font-medium ${
                      data.abilityScores.wisdom.modifier >= 0 ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    ({formatModifier(data.abilityScores.wisdom.modifier)})
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium">{data.abilityScores.charisma.score}</div>
                  <span
                    className={`text-xs font-medium ${
                      data.abilityScores.charisma.modifier >= 0 ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    ({formatModifier(data.abilityScores.charisma.modifier)})
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Skills, Senses, Languages */}
      <section className="bg-card/30 border border-border/50 rounded-lg p-4 space-y-3 text-sm">
        {data.skills.length > 0 && (
          <div>
            <span className="text-emerald-500/90 font-semibold block mb-2">Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, idx) => (
                <span key={idx} className="bg-muted/50 px-2 py-0.5 rounded text-xs inline-block">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.senses.length > 0 && (
          <div>
            <span className="text-emerald-500/90 font-semibold block mb-2">Senses:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.senses.map((sense, idx) => (
                <span key={idx} className="bg-muted/50 px-2 py-0.5 rounded text-xs inline-block">
                  {sense}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <span className="text-emerald-500/90 font-semibold block mb-2">Languages:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.languages.map((language, idx) => (
                <span key={idx} className="bg-muted/50 px-2 py-0.5 rounded text-xs inline-block">
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Additional defenses */}
        {data.damageVulnerabilities.length > 0 && (
          <div>
            <span className="text-emerald-500/90 font-semibold block mb-2">Damage Vulnerabilities:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.damageVulnerabilities.map((vuln, idx) => (
                <span key={idx} className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-xs inline-block">
                  {vuln}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.damageResistances.length > 0 && (
          <div>
            <span className="text-emerald-500/90 font-semibold block mb-2">Damage Resistances:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.damageResistances.map((resist, idx) => (
                <span key={idx} className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs inline-block">
                  {resist}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.damageImmunities.length > 0 && (
          <div>
            <span className="text-emerald-500/90 font-semibold block mb-2">Damage Immunities:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.damageImmunities.map((immunity, idx) => (
                <span key={idx} className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs inline-block">
                  {immunity}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.conditionImmunities.length > 0 && (
          <div>
            <span className="text-emerald-500/90 font-semibold block mb-2">Condition Immunities:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.conditionImmunities.map((immunity, idx) => (
                <span key={idx} className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-xs inline-block">
                  {immunity}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Traits Accordion */}
      {data.traits.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <section>
            <h3 className="flex items-center gap-2 text-base font-bold mb-3 text-emerald-500">
              <Sparkles className="h-5 w-5" />
              Traits
            </h3>
            <Accordion type="multiple">
              {data.traits.map((trait, index) => (
                <AccordionItem key={`trait-${index}`} value={`trait-${index}`}>
                  <AccordionTrigger className="text-base font-semibold text-foreground">
                    {trait.name}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {trait.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </>
      )}

      {/* Actions Accordion */}
      {data.actions.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <section>
            <h3 className="flex items-center gap-2 text-base font-bold mb-3 text-emerald-500">
              <Swords className="h-5 w-5" />
              Actions
            </h3>
            <Accordion type="multiple">
              {data.actions.map((action, index) => (
                <AccordionItem key={`action-${index}`} value={`action-${index}`}>
                  <AccordionTrigger className="text-base font-semibold text-foreground">
                    {action.name}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                    {action.attackRoll && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20">
                          Attack: +{action.attackRoll.bonus}
                        </Badge>
                      </div>
                    )}
                    {action.damage && action.damage.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {action.damage.map((dmg, dmgIndex) => (
                          <Badge
                            key={dmgIndex}
                            className={`${getDamageTypeColor(dmg.type)} border hover:opacity-80`}
                          >
                            {dmg.average} ({dmg.formula}) {dmg.type || "damage"}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </>
      )}

      {/* Bonus Actions Accordion (conditional) */}
      {data.bonusActions.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <section>
            <h3 className="flex items-center gap-2 text-base font-bold mb-3 text-emerald-500">
              <Zap className="h-5 w-5" />
              Bonus Actions
            </h3>
            <Accordion type="multiple">
              {data.bonusActions.map((action, index) => (
                <AccordionItem key={`bonus-${index}`} value={`bonus-${index}`}>
                  <AccordionTrigger className="text-base font-semibold text-foreground">
                    {action.name}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                    {action.attackRoll && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20">
                          Attack: +{action.attackRoll.bonus}
                        </Badge>
                      </div>
                    )}
                    {action.damage && action.damage.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {action.damage.map((dmg, dmgIndex) => (
                          <Badge
                            key={dmgIndex}
                            className={`${getDamageTypeColor(dmg.type)} border hover:opacity-80`}
                          >
                            {dmg.average} ({dmg.formula}) {dmg.type || "damage"}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </>
      )}

      {/* Reactions Accordion (conditional) */}
      {data.reactions.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <section>
            <h3 className="flex items-center gap-2 text-base font-bold mb-3 text-emerald-500">
              <Shield className="h-5 w-5" />
              Reactions
            </h3>
            <Accordion type="multiple">
              {data.reactions.map((action, index) => (
                <AccordionItem key={`reaction-${index}`} value={`reaction-${index}`}>
                  <AccordionTrigger className="text-base font-semibold text-foreground">
                    {action.name}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                    {action.attackRoll && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20">
                          Attack: +{action.attackRoll.bonus}
                        </Badge>
                      </div>
                    )}
                    {action.damage && action.damage.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {action.damage.map((dmg, dmgIndex) => (
                          <Badge
                            key={dmgIndex}
                            className={`${getDamageTypeColor(dmg.type)} border hover:opacity-80`}
                          >
                            {dmg.average} ({dmg.formula}) {dmg.type || "damage"}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </>
      )}
    </div>
  );
}
