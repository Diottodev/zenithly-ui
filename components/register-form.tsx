'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength, email as vEmail, pipe } from 'valibot'
import { toast } from 'sonner'
import { AnimatedCard } from '$/components/ui/animated-card'
import { Button } from '$/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import { Icons } from '$/components/ui/icons'
import { Input } from '$/components/ui/input'
import { Label } from '$/components/ui/label'
import Logo from '$/components/ui/logo'
import { useMutation } from '@tanstack/react-query'

export function RegisterForm() {
  const router = useRouter()
  const schema = object({
    name: pipe(string(), minLength(2, 'Nome deve ter pelo menos 2 caracteres')),
    email: pipe(string(), vEmail('Email inválido')),
    password: pipe(string(), minLength(8, 'A senha deve ter pelo menos 8 caracteres')),
    confirmPassword: pipe(string(), minLength(8, 'Confirmação deve ter pelo menos 8 caracteres')),
  })
  type RegisterFormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setError } = useForm<RegisterFormValues>({
    resolver: valibotResolver(schema),
  })
  const emailRegisterMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth/register`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
        }
      )
      if (!res.ok) {
        throw new Error('Falha ao criar conta com email')
      }
      return res.json()
    },
    onSuccess: (data) => {
      toast.success('Conta criada com sucesso!')
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }
      router.push('/dashboard')
    },
    onError: (error) => {
      toast.error('Erro ao fazer login com email', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
    },
  })
  const onSubmit = (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'As senhas não coincidem' })
      return
    }
    emailRegisterMutation.mutate(data)
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              disabled={emailRegisterMutation.isPending || isSubmitting}
              id="name"
              placeholder="Seu nome"
              type="text"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name.message as string}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={emailRegisterMutation.isPending || isSubmitting}
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
              disabled={emailRegisterMutation.isPending || isSubmitting}
              id="password"
              placeholder="••••••••"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message as string}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              disabled={emailRegisterMutation.isPending || isSubmitting}
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-xs text-red-500">{errors.confirmPassword.message as string}</span>
            )}
          </div>
          {errors.root && (
            <span className="text-xs text-red-500">{errors.root.message as string}</span>
          )}
          <Button className="w-full" disabled={emailRegisterMutation.isPending || isSubmitting} type="submit">
            {emailRegisterMutation.isPending || isSubmitting ? (
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
            href="/auth/login"
          >
            Fazer login
          </a>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
