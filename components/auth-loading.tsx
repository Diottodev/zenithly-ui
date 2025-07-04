import { AnimatedCard } from "$/components/ui";
import { CardContent } from "$/components/ui/card";

export function AuthLoadingScreen() {
  return (
    <AnimatedCard>
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg text-foreground">
            Verificando autenticação
          </h3>
          <p className="text-sm text-muted-foreground">Aguarde um momento...</p>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
