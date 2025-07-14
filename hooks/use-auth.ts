import { useSession } from '$/lib/auth-client'

/**
 * Hook to access authentication state and actions
 *
 * @returns Authentication state and actions
 *
 * @example
 * ```typescript
 * const { data: session, isPending, error } = useAuth();
 *
 * // Check if user is authenticated
 * if (session?.user) {
 *   console.log('User logged in:', session.user.name);
 * }
 * ```
 */
export const useAuth = () => {
  const { data: session, isPending, error } = useSession()
  return {
    user: session?.user || null,
    session,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error,
  }
}
