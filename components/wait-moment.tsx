import { AnimatedCard } from "$/components/ui";
import { CardContent } from "$/components/ui/card";

export default function WaitMoment() {
  return (
    <AnimatedCard className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Aguarde um momento...</p>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
