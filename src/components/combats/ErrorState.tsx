import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-16 w-16 text-red-500" />
      <h2 className="text-2xl font-semibold">Failed to load combats</h2>
      <p className="text-muted-foreground">There was an error loading the combats list. Please try again.</p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}
