'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength, email as vEmail, pipe } from 'valibot'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AnimatedCard } from '$/components/ui/animated-card'
import { Button } from '$/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import { Input } from '$/components/ui/input'
import { Label } from '$/components/ui/label'
import Logo from '$/components/ui/logo'

export function LoginForm() {
  const router = useRouter()
  const schema = object({
    email: pipe(string(), vEmail('Email inválido')),
    password: pipe(string(), minLength(8, 'A senha deve ter pelo menos 8 caracteres')),
  })
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: valibotResolver(schema),
  })
  const emailLoginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
      if (!res.ok) {
        throw new Error('Falha ao iniciar login com email')
      }
      return res.json()
    },
    onSuccess: (data) => {
      toast.success('Login realizado com sucesso!')
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }
      // router.push('/dashboard')
    },
    onError: (error) => {
      toast.error('Erro ao fazer login com email', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
    },
  })
  const onSubmit = (data: { email: string; password: string }) => {
    emailLoginMutation.mutate(data)
  }
  const githubLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth/github`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!res.ok) {
        throw new Error('Falha ao iniciar login com GitHub')
      }
      return res.json()
    },
    onSuccess: (data) => {
      router.push(data.url)
    },
    onError: (error) => {
      toast.error('Erro ao fazer login com GitHub', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
    },
  })
  const handleGitHubLogin = () => {
    githubLoginMutation.mutate()
  }
  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth/google`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!res.ok) {
        throw new Error('Falha ao iniciar login com Google')
      }
      return res.json()
    },
    onSuccess: (data) => {
      router.push(data.url)
    },
    onError: (error) => {
      toast.error('Erro ao fazer login com Google', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
    },
  })
  const handleGoogleLogin = () => {
    googleLoginMutation.mutate()
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={emailLoginMutation.isPending || isSubmitting}
              id="email"
              placeholder="seu@email.com"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message as string}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              disabled={emailLoginMutation.isPending || isSubmitting}
              id="password"
              placeholder="••••••••"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message as string}</span>
            )}
          </div>
          <Button className="w-full" disabled={emailLoginMutation.isPending || isSubmitting} type="submit">
            {emailLoginMutation.isPending || isSubmitting ? (
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
            disabled={githubLoginMutation.isPending}
            onClick={handleGitHubLogin}
            variant="outline"
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            {githubLoginMutation.isPending ? 'Entrando...' : 'GitHub'}
          </Button>
          <Button
            disabled={googleLoginMutation.isPending}
            onClick={() => handleGoogleLogin()}
            variant="outline"
          >
            <Icons.google className="mr-2 h-4 w-4" />
            {googleLoginMutation.isPending ? 'Entrando...' : 'Google'}
          </Button>
        </div>
        <div className="text-center text-muted-foreground text-sm">
          Não tem uma conta?{' '}
          <a
            className="underline underline-offset-4 hover:text-primary"
            href="/auth/register"
          >
            Criar conta
          </a>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
