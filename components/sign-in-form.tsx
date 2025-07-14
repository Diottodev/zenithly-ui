'use client'

import { AnimatedCard } from '$/components/ui/animated-card'
import { Button } from '$/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import { Input } from '$/components/ui/input'
import { Label } from '$/components/ui/label'
import Logo from '$/components/ui/logo'
import { signIn } from '$/lib/better-auth-client'
import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Erro ao fazer login')
      }

      if (!result.data?.user) {
        throw new Error('Usuário não encontrado')
      }

      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao fazer login', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: '/auth/callback',
      })
    } catch (error) {
      toast.error('Erro ao fazer login com GitHub', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/auth/callback',
      })
    } catch (error) {
      toast.error('Erro ao fazer login com Google', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
      setLoading(false)
    }
  }
  return (
    <AnimatedCard className="mx-auto w-full max-w-md">
      <CardHeader className="inline-flex items-center justify-center space-x-2">
        <Logo />
        <CardTitle className="text-center font-bold text-2xl">
          Entrar na Zenithly
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={loading}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              disabled={loading}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            disabled={loading}
            onClick={() => handleGitHubLogin()}
            variant="outline"
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleGoogleLogin()}
            variant="outline"
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="text-center text-muted-foreground text-sm">
          Não tem uma conta?{' '}
          <a
            className="underline underline-offset-4 hover:text-primary"
            href="/auth/signup"
          >
            Criar conta
          </a>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
