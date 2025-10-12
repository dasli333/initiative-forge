import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MonsterDetails } from "./MonsterDetails";
import type { MonsterDTO } from "@/types";

/**
 * Props for MonsterSlideover component
 */
interface MonsterSlideoverProps {
  /**
   * Monster data to display (null when no monster is selected)
   */
  monster: MonsterDTO | null;
  /**
   * Whether the slideover is open
   */
  isOpen: boolean;
  /**
   * Callback fired when slideover open state changes
   * Called when user closes via X button, ESC key, or click outside
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Slideover panel displaying full monster statistics
 * Implemented as Shadcn Sheet component with slide-in animation from right
 *
 * Features:
 * - 400px width
 * - Scrollable content area
 * - Auto-closing on ESC, click outside, or X button
 * - Automatic focus management and focus trap
 * - ARIA labels for accessibility
 *
 * @param monster - Monster data to display
 * @param isOpen - Whether slideover is open
 * @param onOpenChange - Handler for open state changes
 */
export function MonsterSlideover({ monster, isOpen, onOpenChange }: MonsterSlideoverProps) {
  // Don't render sheet content if no monster is selected
  if (!monster) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:w-[400px] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>No Monster Selected</SheetTitle>
          </SheetHeader>
          <p className="text-sm text-muted-foreground mt-4">Please select a monster to view details.</p>
        </SheetContent>
      </Sheet>
    );
  }

  const { data } = monster;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] sm:max-w-[400px] flex flex-col p-0">
        {/* Header - fixed at top */}
        <SheetHeader className="px-6 pt-6 pb-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <SheetTitle className="text-2xl flex-1">{data.name.en}</SheetTitle>
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-base px-3 py-1">
              CR {data.challengeRating.rating}
            </Badge>
          </div>
          {data.name.pl !== data.name.en && <p className="text-sm text-muted-foreground italic">{data.name.pl}</p>}
        </SheetHeader>

        {/* Scrollable content area */}
        <ScrollArea className="flex-1 px-6 pb-6">
          <MonsterDetails data={data} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
