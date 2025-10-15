// HP control component with damage and heal buttons

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HPControlsProps {
  currentHP: number;
  maxHP: number;
  onHPChange: (amount: number, type: "damage" | "heal") => void;
}

export function HPControls({ currentHP, maxHP, onHPChange }: HPControlsProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    // Walidacja
    const num = parseInt(val, 10);
    if (val && (isNaN(num) || num <= 0)) {
      setError("Must be a positive number");
    } else {
      setError("");
    }
  }, []);

  const handleDamage = useCallback(() => {
    const amount = parseInt(value, 10);
    if (!isNaN(amount) && amount > 0) {
      onHPChange(amount, "damage");
      setValue("");
      setError("");
    }
  }, [value, onHPChange]);

  const handleHeal = useCallback(() => {
    const amount = parseInt(value, 10);
    if (!isNaN(amount) && amount > 0) {
      onHPChange(amount, "heal");
      setValue("");
      setError("");
    }
  }, [value, onHPChange]);

  const isValid = !error && value !== "";

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Value"
          value={value}
          onChange={handleChange}
          className={`w-20 ${error ? "border-red-500" : ""}`}
          min={1}
        />
        <Button size="sm" variant="destructive" onClick={handleDamage} disabled={!isValid}>
          DMG
        </Button>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleHeal} disabled={!isValid}>
          HEAL
        </Button>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {currentHP} / {maxHP} HP
        </span>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}
