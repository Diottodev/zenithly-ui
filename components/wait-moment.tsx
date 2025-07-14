import { AnimatedCard } from '$/components/ui'
import { CardContent } from '$/components/ui/card'

export default function WaitMoment() {
  return (
    <AnimatedCard className="mx-auto w-full max-w-md">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm">Aguarde um momento...</p>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
