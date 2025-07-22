'use client'

import { useAuth, type TAuthUser } from '$/hooks/use-auth'
import { useAuthStore } from '$/stores/auth-store'
import React from 'react'

/**
 * AuthProvider component to manage authentication state.
 * It uses the useSession hook to get the current session and updates the auth store accordingly.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to render within the provider.
 * @returns {JSX.Element} The rendered AuthProvider component.
 */
export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { session, isPending } = useAuth()
  const { setUser, setLoading } = useAuthStore()
  React.useEffect(() => {
    setLoading(isPending)
  }, [isPending, setLoading])
  React.useEffect(() => {
    return setUser(
      session && typeof session === 'object' && 'user' in session
        ? (session as { user: TAuthUser }).user
        : null
    )
  }, [session, setUser])
  return <>{children}</>
}
