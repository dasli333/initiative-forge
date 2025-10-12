import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
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
      <section>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Basic Info</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="font-semibold">Size:</span> {data.size}
          </div>
          <div>
            <span className="font-semibold">Type:</span> {data.type}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Alignment:</span> {data.alignment}
          </div>
          <div>
            <span className="font-semibold">AC:</span> {data.armorClass}
          </div>
          <div>
            <span className="font-semibold">HP:</span> {data.hitPoints.average} ({data.hitPoints.formula})
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Speed:</span> {data.speed.join(", ")}
          </div>
        </div>
      </section>

      <Separator />

      {/* Ability Scores Table */}
      <section>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Ability Scores</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">STR</TableHead>
              <TableHead className="text-center">DEX</TableHead>
              <TableHead className="text-center">CON</TableHead>
              <TableHead className="text-center">INT</TableHead>
              <TableHead className="text-center">WIS</TableHead>
              <TableHead className="text-center">CHA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center">
                {data.abilityScores.strength.score}
                <br />
                <span className="text-muted-foreground text-xs">
                  ({formatModifier(data.abilityScores.strength.modifier)})
                </span>
              </TableCell>
              <TableCell className="text-center">
                {data.abilityScores.dexterity.score}
                <br />
                <span className="text-muted-foreground text-xs">
                  ({formatModifier(data.abilityScores.dexterity.modifier)})
                </span>
              </TableCell>
              <TableCell className="text-center">
                {data.abilityScores.constitution.score}
                <br />
                <span className="text-muted-foreground text-xs">
                  ({formatModifier(data.abilityScores.constitution.modifier)})
                </span>
              </TableCell>
              <TableCell className="text-center">
                {data.abilityScores.intelligence.score}
                <br />
                <span className="text-muted-foreground text-xs">
                  ({formatModifier(data.abilityScores.intelligence.modifier)})
                </span>
              </TableCell>
              <TableCell className="text-center">
                {data.abilityScores.wisdom.score}
                <br />
                <span className="text-muted-foreground text-xs">
                  ({formatModifier(data.abilityScores.wisdom.modifier)})
                </span>
              </TableCell>
              <TableCell className="text-center">
                {data.abilityScores.charisma.score}
                <br />
                <span className="text-muted-foreground text-xs">
                  ({formatModifier(data.abilityScores.charisma.modifier)})
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator />

      {/* Skills, Senses, Languages */}
      <section className="space-y-3 text-sm">
        {data.skills.length > 0 && (
          <div>
            <span className="font-semibold">Skills:</span> {data.skills.join(", ")}
          </div>
        )}
        {data.senses.length > 0 && (
          <div>
            <span className="font-semibold">Senses:</span> {data.senses.join(", ")}
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <span className="font-semibold">Languages:</span> {data.languages.join(", ")}
          </div>
        )}
        {/* Additional defenses */}
        {data.damageVulnerabilities.length > 0 && (
          <div>
            <span className="font-semibold">Damage Vulnerabilities:</span> {data.damageVulnerabilities.join(", ")}
          </div>
        )}
        {data.damageResistances.length > 0 && (
          <div>
            <span className="font-semibold">Damage Resistances:</span> {data.damageResistances.join(", ")}
          </div>
        )}
        {data.damageImmunities.length > 0 && (
          <div>
            <span className="font-semibold">Damage Immunities:</span> {data.damageImmunities.join(", ")}
          </div>
        )}
        {data.conditionImmunities.length > 0 && (
          <div>
            <span className="font-semibold">Condition Immunities:</span> {data.conditionImmunities.join(", ")}
          </div>
        )}
      </section>

      {/* Traits Accordion */}
      {data.traits.length > 0 && (
        <>
          <Separator />
          <section>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Traits</h3>
            <Accordion type="multiple">
              {data.traits.map((trait, index) => (
                <AccordionItem key={`trait-${index}`} value={`trait-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">{trait.name}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{trait.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </>
      )}

      {/* Actions Accordion */}
      {data.actions.length > 0 && (
        <>
          <Separator />
          <section>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Actions</h3>
            <Accordion type="multiple">
              {data.actions.map((action, index) => (
                <AccordionItem key={`action-${index}`} value={`action-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">{action.name}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    {action.attackRoll && (
                      <p className="text-sm">
                        <span className="font-semibold">Attack:</span> +{action.attackRoll.bonus}
                      </p>
                    )}
                    {action.damage &&
                      action.damage.map((dmg, dmgIndex) => (
                        <p key={dmgIndex} className="text-sm">
                          <span className="font-semibold">Damage:</span> {dmg.average} ({dmg.formula}) {dmg.type}
                        </p>
                      ))}
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
          <Separator />
          <section>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Bonus Actions</h3>
            <Accordion type="multiple">
              {data.bonusActions.map((action, index) => (
                <AccordionItem key={`bonus-${index}`} value={`bonus-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">{action.name}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    {action.attackRoll && (
                      <p className="text-sm">
                        <span className="font-semibold">Attack:</span> +{action.attackRoll.bonus}
                      </p>
                    )}
                    {action.damage &&
                      action.damage.map((dmg, dmgIndex) => (
                        <p key={dmgIndex} className="text-sm">
                          <span className="font-semibold">Damage:</span> {dmg.average} ({dmg.formula}) {dmg.type}
                        </p>
                      ))}
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
          <Separator />
          <section>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Reactions</h3>
            <Accordion type="multiple">
              {data.reactions.map((action, index) => (
                <AccordionItem key={`reaction-${index}`} value={`reaction-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">{action.name}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    {action.attackRoll && (
                      <p className="text-sm">
                        <span className="font-semibold">Attack:</span> +{action.attackRoll.bonus}
                      </p>
                    )}
                    {action.damage &&
                      action.damage.map((dmg, dmgIndex) => (
                        <p key={dmgIndex} className="text-sm">
                          <span className="font-semibold">Damage:</span> {dmg.average} ({dmg.formula}) {dmg.type}
                        </p>
                      ))}
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
