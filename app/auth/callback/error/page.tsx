'use client'

import { AnimatedCard } from '$/components/ui/animated-card'
import { Button } from '$/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import Logo from '$/components/ui/logo'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState(
    'Erro desconhecido na autenticação'
  )

  useEffect(() => {
    const error = searchParams.get('error')

    switch (error) {
      case 'invalid_session':
        setErrorMessage('Sessão inválida ou expirada')
        break
      case 'server_error':
        setErrorMessage('Erro interno do servidor')
        break
      case 'access_denied':
        setErrorMessage('Acesso negado pelo provedor de autenticação')
        break
      case 'oauth_error':
        setErrorMessage('Erro no processo de autenticação OAuth')
        break
      default:
        setErrorMessage('Erro desconhecido na autenticação')
        break
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AnimatedCard className="mx-auto w-full max-w-md">
        <CardHeader className="inline-flex items-center justify-center space-x-2">
          <Logo />
          <CardTitle className="text-center font-bold text-2xl">
            Erro na Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <Icons.alertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">{errorMessage}</p>
            <p className="text-muted-foreground text-sm">
              Tente fazer login novamente ou entre em contato com o suporte se o
              problema persistir.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2">
            <Button
              className="w-full"
              onClick={() => router.push('/auth/login')}
            >
              Tentar Novamente
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push('/')}
              variant="outline"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
