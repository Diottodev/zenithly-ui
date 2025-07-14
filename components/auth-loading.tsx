import { AnimatedCard } from '$/components/ui'
import { CardContent } from '$/components/ui/card'

export function AuthLoadingScreen() {
  return (
    <AnimatedCard>
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <div className="space-y-2 text-center">
          <h3 className="font-semibold text-foreground text-lg">
            Verificando autenticação
          </h3>
          <p className="text-muted-foreground text-sm">Aguarde um momento...</p>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
