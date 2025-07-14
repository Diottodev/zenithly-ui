'use client'

import { AnimatedCard } from '$/components/ui/animated-card'
import { Button } from '$/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import Logo from '$/components/ui/logo'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar automaticamente após 3 segundos
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AnimatedCard className="mx-auto w-full max-w-md">
        <CardHeader className="inline-flex items-center justify-center space-x-2">
          <Logo />
          <CardTitle className="text-center font-bold text-2xl">
            Login Realizado com Sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <Icons.check className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">
              Bem-vindo de volta! Você será redirecionado para o dashboard em
              instantes.
            </p>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground text-sm">
              <Icons.spinner className="h-4 w-4 animate-spin" />
              <span>Redirecionando...</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push('/dashboard')}>
            Ir para o Dashboard
          </Button>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
