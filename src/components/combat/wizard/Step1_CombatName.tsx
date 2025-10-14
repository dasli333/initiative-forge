import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { validateStep1 } from "./utils";
import type { Step1Props } from "./types";

export function Step1_CombatName({ combatName, onNameChange, onNext }: Step1Props) {
  const [touched, setTouched] = useState(false);
  const validation = validateStep1(combatName);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && validation.valid) {
        e.preventDefault();
        onNext();
      }
    },
    [onNext, validation.valid]
  );

  const showError = touched && !validation.valid;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 id="step-1-heading" className="text-2xl font-bold mb-6" tabIndex={-1}>
        Name Your Combat
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="combat-name">Combat Name</Label>
          <Input
            id="combat-name"
            type="text"
            value={combatName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Goblin Ambush"
            maxLength={255}
            aria-invalid={showError}
            aria-describedby={showError ? "combat-name-error" : undefined}
            className={showError ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {showError && (
            <p id="combat-name-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {validation.error}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">{combatName.length}/255 characters</p>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onNext} disabled={!validation.valid} size="lg" className="min-w-32">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
