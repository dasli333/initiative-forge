import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { validateStep2 } from "./utils";
import type { Step2Props } from "./types";

export function Step2_SelectPlayerCharacters({
  playerCharacters,
  selectedIds,
  onToggle,
  onBack,
  onNext,
  isLoading,
  error,
}: Step2Props) {
  const validation = validateStep2(selectedIds);

  const handleToggle = useCallback(
    (characterId: string) => {
      onToggle(characterId);
    },
    [onToggle]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 id="step-2-heading" className="text-2xl font-bold mb-6" tabIndex={-1}>
          Select Player Characters
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="w-5 h-5" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 id="step-2-heading" className="text-2xl font-bold mb-6" tabIndex={-1}>
          Select Player Characters
        </h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load player characters. Please try again.</AlertDescription>
        </Alert>
        <div className="flex justify-between pt-6">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
        </div>
      </div>
    );
  }

  // No characters warning
  if (playerCharacters.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 id="step-2-heading" className="text-2xl font-bold mb-6" tabIndex={-1}>
          Select Player Characters
        </h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Player Characters</AlertTitle>
          <AlertDescription>
            No player characters in this campaign. You can still create a combat with only monsters and NPCs, or{" "}
            <a href={`/campaigns/${playerCharacters[0]?.id || ""}/characters/new`} className="underline font-medium">
              create a character first
            </a>
            .
          </AlertDescription>
        </Alert>
        <div className="flex justify-between pt-6">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onNext}>Skip to Monsters</Button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="max-w-4xl mx-auto">
      <h2 id="step-2-heading" className="text-2xl font-bold mb-6" tabIndex={-1}>
        Select Player Characters
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Choose which player characters will participate in this combat.
      </p>

      <div className="space-y-3 mb-6">
        {playerCharacters.map((character) => {
          const isSelected = selectedIds.includes(character.id);

          return (
            <div
              key={character.id}
              className={`
                flex items-center gap-4 p-4 border rounded-lg
                transition-colors duration-150
                ${isSelected ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500" : "hover:bg-gray-50 dark:hover:bg-gray-900"}
              `}
            >
              <Checkbox
                id={`character-${character.id}`}
                checked={isSelected}
                onCheckedChange={() => handleToggle(character.id)}
              />
              <Label htmlFor={`character-${character.id}`} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base">{character.name}</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">HP: {character.max_hp}</Badge>
                    <Badge variant="secondary">AC: {character.armor_class}</Badge>
                  </div>
                </div>
              </Label>
            </div>
          );
        })}
      </div>

      {!validation.valid && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mb-4" role="alert">
          {validation.error}
        </p>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext} disabled={!validation.valid} size="lg">
          Next
        </Button>
      </div>
    </div>
  );
}
