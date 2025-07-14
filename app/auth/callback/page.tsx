'use client'

import { AnimatedCard } from '$/components/ui/animated-card'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import Logo from '$/components/ui/logo'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = () => {
      try {
        const success = searchParams.get('success')
        const error = searchParams.get('error')
        const token = searchParams.get('token')

        if (success === 'true' && token) {
          // Sucesso na autenticação
          toast.success('Login realizado com sucesso!')

          // Armazenar o token se necessário (dependendo da implementação do Better Auth)
          if (token) {
            // O Better Auth pode gerenciar cookies automaticamente
            document.cookie = `better-auth.session_token=${token}; path=/; secure; samesite=strict`
          }

          // Redirecionar para o dashboard
          router.push('/dashboard')
        } else if (error) {
          // Erro na autenticação
          let errorMessage = 'Erro na autenticação'

          switch (error) {
            case 'invalid_session':
              errorMessage = 'Sessão inválida'
              break
            case 'server_error':
              errorMessage = 'Erro interno do servidor'
              break
            case 'access_denied':
              errorMessage = 'Acesso negado pelo provedor'
              break
            default:
              errorMessage = 'Erro desconhecido na autenticação'
              break
          }

          toast.error('Erro no login', {
            description: errorMessage,
          })

          // Redirecionar para a página de login após alguns segundos
          setTimeout(() => {
            router.push('/auth/signin')
          }, 3000)
        } else {
          // Parâmetros inválidos
          toast.error('Erro no callback', {
            description: 'Parâmetros de callback inválidos',
          })

          setTimeout(() => {
            router.push('/auth/signin')
          }, 3000)
        }
      } catch {
        toast.error('Erro no processamento', {
          description:
            'Ocorreu um erro ao processar o callback de autenticação',
        })

        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } finally {
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AnimatedCard className="mx-auto w-full max-w-md">
          <CardHeader className="inline-flex items-center justify-center space-x-2">
            <Logo />
            <CardTitle className="text-center font-bold text-2xl">
              Processando...
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Icons.spinner className="h-8 w-8 animate-spin" />
            <p className="text-center text-muted-foreground">
              Finalizando seu login, aguarde...
            </p>
          </CardContent>
        </AnimatedCard>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AnimatedCard className="mx-auto w-full max-w-md">
        <CardHeader className="inline-flex items-center justify-center space-x-2">
          <Logo />
          <CardTitle className="text-center font-bold text-2xl">
            Redirecionando...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin" />
          <p className="text-center text-muted-foreground">
            Você será redirecionado em instantes...
          </p>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
