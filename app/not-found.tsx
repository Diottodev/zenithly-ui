import { Button } from "$/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "$/components/ui/card";
import { Home, LogIn, Search, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-border/50 shadow-lg">
        <CardHeader className="space-y-6 pb-8">
          {/* Animated 404 Icon */}
          <div className="mx-auto relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-xl animate-pulse">
              404
            </div>
            {/* Floating search icon */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-muted rounded-full flex items-center justify-center animate-bounce">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              Página não encontrada
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground leading-relaxed">
              A página que você está procurando não existe ou foi movida.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="space-y-3">
            <Button
              asChild
              className="w-full group transition-all duration-200 hover:scale-[1.02]"
            >
              <Link href="/auth/signin">
                <LogIn className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Fazer Login
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full group transition-all duration-200 hover:scale-[1.02]"
            >
              <Link href="/auth/signup">
                <UserPlus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Criar Conta
              </Link>
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium">
                  ou
                </span>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full group transition-all duration-200 hover:scale-[1.02]"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Se você acredita que isso é um erro, entre em contato com o
              suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
