import { useMemo } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import type { PlayerCharacterDTO } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CharacterTableRow {
  id: string;
  name: string;
  max_hp: number;
  armor_class: number;
  initiativeModifier: number;
  passivePerception: number;
}

interface CharacterListTableProps {
  characters: PlayerCharacterDTO[];
  onEdit: (character: PlayerCharacterDTO) => void;
  onDelete: (characterId: string) => void;
}

/**
 * Transforms a PlayerCharacterDTO to a table row with calculated fields
 */
const toTableRow = (char: PlayerCharacterDTO): CharacterTableRow => ({
  id: char.id,
  name: char.name,
  max_hp: char.max_hp,
  armor_class: char.armor_class,
  initiativeModifier: Math.floor((char.dexterity - 10) / 2),
  passivePerception: 10 + Math.floor((char.wisdom - 10) / 2),
});

/**
 * Formats a modifier to include + or - sign
 */
const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

/**
 * Table component displaying list of player characters
 */
export const CharacterListTable = ({ characters, onEdit, onDelete }: CharacterListTableProps) => {
  const tableData = useMemo(() => characters.map(toTableRow), [characters]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Max HP</TableHead>
            <TableHead className="text-center">AC</TableHead>
            <TableHead className="text-center">Initiative</TableHead>
            <TableHead className="text-center">Passive Perception</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => {
            const character = characters.find((c) => c.id === row.id);
            if (!character) return null;

            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-center">{row.max_hp}</TableCell>
                <TableCell className="text-center">{row.armor_class}</TableCell>
                <TableCell className="text-center">{formatModifier(row.initiativeModifier)}</TableCell>
                <TableCell className="text-center">{row.passivePerception}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(character)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(character.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
