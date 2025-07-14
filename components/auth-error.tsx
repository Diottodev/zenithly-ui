import { Button } from '$/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '$/components/ui/card'
import { AlertTriangle, Home, LogIn, RefreshCw } from 'lucide-react'
import Link from 'next/link'

type TAuthErrorProps = {
  title?: string
  description?: string
  showRetry?: boolean
  onRetry?: () => void
}

export function AuthError({
  title = 'Erro de Autenticação',
  description = 'Ocorreu um problema ao verificar suas credenciais. Por favor, tente novamente.',
  showRetry = false,
  onRetry,
}: TAuthErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md border-destructive/20 text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <CardTitle className="font-bold text-2xl text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {showRetry && onRetry && (
              <Button className="w-full" onClick={onRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            )}
            <Button asChild className="w-full" variant="outline">
              <Link href="/auth/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Fazer Login
              </Link>
            </Button>
            <Button asChild className="w-full" variant="ghost">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
          <div className="border-border border-t pt-4">
            <p className="text-muted-foreground text-xs">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
