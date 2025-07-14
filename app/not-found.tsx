import { Button } from '$/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '$/components/ui/card'
import { Home, LogIn, Search, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md border-border/50 text-center shadow-lg">
        <CardHeader className="space-y-6 pb-8">
          {/* Animated 404 Icon */}
          <div className="relative mx-auto">
            <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-bold text-3xl text-primary-foreground shadow-xl">
              404
            </div>
            {/* Floating search icon */}
            <div className="-top-2 -right-2 absolute flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-muted">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="font-bold text-2xl text-foreground">
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
              className="group w-full transition-all duration-200 hover:scale-[1.02]"
            >
              <Link href="/auth/signin">
                <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                Fazer Login
              </Link>
            </Button>
            <Button
              asChild
              className="group w-full transition-all duration-200 hover:scale-[1.02]"
              variant="outline"
            >
              <Link href="/auth/signup">
                <UserPlus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Criar Conta
              </Link>
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-border/50 border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 font-medium text-muted-foreground">
                  ou
                </span>
              </div>
            </div>
            <Button
              asChild
              className="group w-full transition-all duration-200 hover:scale-[1.02]"
              variant="ghost"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
          <div className="border-border/50 border-t pt-4">
            <p className="text-muted-foreground text-xs">
              Se você acredita que isso é um erro, entre em contato com o
              suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
