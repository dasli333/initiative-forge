import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { StatCardProps } from "@/types/campaign-dashboard";

/**
 * Stat card component
 * Displays a statistic with icon, label, and value
 */
export function StatCard({ icon, label, value, colorClass = "text-foreground" }: StatCardProps) {
  return (
    <Card className="hover:border-emerald-600/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
