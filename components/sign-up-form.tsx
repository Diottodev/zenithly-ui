'use client'

import { AnimatedCard } from '$/components/ui/animated-card'
import { Button } from '$/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import { Input } from '$/components/ui/input'
import { Label } from '$/components/ui/label'
import Logo from '$/components/ui/logo'
import { signUp } from '$/lib/better-auth-client'
import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function SignUpForm() {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    if (password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres')
      return
    }
    setLoading(true)
    try {
      const result = await signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Erro ao criar conta')
      }

      toast.success('Conta criada com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao criar conta', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedCard className="mx-auto w-full max-w-md">
      <CardHeader className="inline-flex items-center justify-center space-x-2">
        <Logo />
        <CardTitle className="text-center font-bold text-2xl">
          Criar Conta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              disabled={loading}
              id="name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Seu nome"
              required
              type="text"
              value={name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={loading}
              id="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              disabled={loading}
              id="confirmPassword"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="••••••••"
              required
              type="password"
              value={confirmPassword}
            />
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>
        <div className="text-center text-muted-foreground text-sm">
          Já tem uma conta?{' '}
          <a
            className="underline underline-offset-4 hover:text-primary"
            href="/auth/signin"
          >
            Fazer login
          </a>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
