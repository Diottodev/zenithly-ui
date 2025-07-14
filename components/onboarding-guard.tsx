'use client'

import { useAuth } from '$/hooks/use-auth'
import { useOnboarding } from '$/hooks/use-onboarding'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { shouldShowOnboarding, isLoading: onboardingLoading } = useOnboarding()

  useEffect(() => {
    // Se o usuário está logado mas não completou o onboarding, redirecionar
    if (user && !authLoading && !onboardingLoading && shouldShowOnboarding) {
      router.push('/onboarding')
    }
  }, [user, authLoading, onboardingLoading, shouldShowOnboarding, router])

  // Mostrar loading enquanto verifica
  if (authLoading || onboardingLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    )
  }

  // Se precisa fazer onboarding, não mostrar o conteúdo
  if (user && shouldShowOnboarding) {
    return null
  }

  return <>{children}</>
}
