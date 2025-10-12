import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Challenge Rating values including fractional CRs
 */
const CR_VALUES = [
  { value: 0, label: "0" },
  { value: 0.125, label: "1/8" },
  { value: 0.25, label: "1/4" },
  { value: 0.5, label: "1/2" },
  ...Array.from({ length: 30 }, (_, i) => ({ value: i + 1, label: String(i + 1) })),
];

/**
 * Props for CRFilter component
 */
interface CRFilterProps {
  /**
   * Minimum Challenge Rating (null = no minimum)
   */
  min: number | null;
  /**
   * Maximum Challenge Rating (null = no maximum)
   */
  max: number | null;
  /**
   * Callback fired when filter values change
   * Only called if validation passes (min <= max)
   */
  onChange: (min: number | null, max: number | null) => void;
}

/**
 * Challenge Rating filter component with dual select dropdowns
 * Validates that minimum CR is not greater than maximum CR
 *
 * @param min - Current minimum CR value
 * @param max - Current maximum CR value
 * @param onChange - Handler for filter changes
 */
export function CRFilter({ min, max, onChange }: CRFilterProps) {
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles minimum CR change with validation
   */
  const handleMinChange = (value: string) => {
    const newMin = value === "none" ? null : Number(value);

    // Validate: min should not be greater than max
    if (max !== null && newMin !== null && newMin > max) {
      setError("Minimum CR cannot be greater than Maximum CR");
      return;
    }

    setError(null);
    onChange(newMin, max);
  };

  /**
   * Handles maximum CR change with validation
   */
  const handleMaxChange = (value: string) => {
    const newMax = value === "none" ? null : Number(value);

    // Validate: max should not be less than min
    if (min !== null && newMax !== null && newMax < min) {
      setError("Maximum CR cannot be less than Minimum CR");
      return;
    }

    setError(null);
    onChange(min, newMax);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Challenge Rating</Label>
      <div className="flex gap-2 items-start">
        {/* Minimum CR Select */}
        <div className="flex-1">
          <Select value={min === null ? "none" : String(min)} onValueChange={handleMinChange}>
            <SelectTrigger aria-label="Minimum Challenge Rating">
              <SelectValue placeholder="Min CR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No minimum</SelectItem>
              {CR_VALUES.map((cr) => (
                <SelectItem key={`min-${cr.value}`} value={String(cr.value)}>
                  {cr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-muted-foreground self-center">to</span>

        {/* Maximum CR Select */}
        <div className="flex-1">
          <Select value={max === null ? "none" : String(max)} onValueChange={handleMaxChange}>
            <SelectTrigger aria-label="Maximum Challenge Rating">
              <SelectValue placeholder="Max CR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No maximum</SelectItem>
              {CR_VALUES.map((cr) => (
                <SelectItem key={`max-${cr.value}`} value={String(cr.value)}>
                  {cr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error hint */}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
