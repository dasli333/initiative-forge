import type { PlayerCharacterDTO } from "@/types";
import { CharacterListTable } from "./CharacterListTable";
import { CharacterListEmpty } from "./CharacterListEmpty";
import { Skeleton } from "@/components/ui/skeleton";

interface CharacterListProps {
  characters: PlayerCharacterDTO[];
  isLoading: boolean;
  onEdit: (character: PlayerCharacterDTO) => void;
  onDelete: (characterId: string) => void;
  onAddCharacter: () => void;
}

/**
 * Loading skeleton for the character list
 */
const CharacterListSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
);

/**
 * Main character list component that conditionally renders
 * either the table, empty state, or loading state
 */
export const CharacterList = ({ characters, isLoading, onEdit, onDelete, onAddCharacter }: CharacterListProps) => {
  if (isLoading) {
    return <CharacterListSkeleton />;
  }

  if (characters.length === 0) {
    return <CharacterListEmpty onAddCharacter={onAddCharacter} />;
  }

  return <CharacterListTable characters={characters} onEdit={onEdit} onDelete={onDelete} />;
};
