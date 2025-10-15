// Round counter display

interface RoundCounterProps {
  round: number;
}

export function RoundCounter({ round }: RoundCounterProps) {
  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">Round</p>
      <p className="text-3xl font-bold">{round}</p>
    </div>
  );
}
