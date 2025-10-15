// Badge displaying initiative value

import { Badge } from "@/components/ui/badge";

interface InitiativeBadgeProps {
  value: number;
}

export function InitiativeBadge({ value }: InitiativeBadgeProps) {
  return (
    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
      {value}
    </Badge>
  );
}
