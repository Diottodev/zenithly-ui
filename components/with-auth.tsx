'use client'

import { AuthLoadingScreen } from '$/components/auth-loading'
import { useAuth } from '$/hooks/use-auth'
import { useRouter } from 'next/navigation'
import React from 'react'

type TWithAuthProps = Record<string, unknown>

export function withAuth<P extends TWithAuthProps>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    redirectTo?: string
    loadingComponent?: React.ComponentType
  }
) {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const redirectTo = options?.redirectTo || '/not-found'
    const LoadingComponent = options?.loadingComponent || AuthLoadingScreen
    React.useEffect(() => {
      if (!(isLoading || isAuthenticated)) {
        router.push(redirectTo)
      }
    }, [isLoading, isAuthenticated, router, redirectTo])
    if (isLoading) {
      return <LoadingComponent />
    }
    if (!isAuthenticated) {
      return null
    }
    return <WrappedComponent {...props} />
  }
  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`
  return AuthenticatedComponent
}
