import { Button } from "$/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "$/components/ui/card";
import { AlertTriangle, Home, LogIn, RefreshCw } from "lucide-react";
import Link from "next/link";

type TAuthErrorProps = {
  title?: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function AuthError({
  title = "Erro de Autenticação",
  description = "Ocorreu um problema ao verificar suas credenciais. Por favor, tente novamente.",
  showRetry = false,
  onRetry,
}: TAuthErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-destructive/20">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center text-destructive-foreground">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {showRetry && onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Fazer Login
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
