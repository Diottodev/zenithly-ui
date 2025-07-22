'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { use, useEffect } from 'react'
import { AnimatedCard } from '$/components/ui/animated-card'
import { Button } from '$/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import Logo from '$/components/ui/logo'

export default function AuthSuccessPage() {
  const router = useRouter()
  const token = useSearchParams().get('token')
  useEffect(() => {
    if (token) {
      document.cookie = `__Secure-better-auth.session_token=${token}; path=/; domain=.diottodev.com; secure; samesite=none`
      router.push('/dashboard')
    } else {
      router.push('/auth/login')
    }
  }, [])
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
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
