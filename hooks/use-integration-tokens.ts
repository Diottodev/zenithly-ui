import { useCallback, useState } from 'react'

type TokenData = {
  accessToken: string
  tokenType: string
  expiresAt: string
  scopes: string[]
}

export function useIntegrationTokens(userId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refreshGoogleTokens =
    useCallback(async (): Promise<TokenData | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/integrations/google/refresh`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erro ao renovar tokens do Google')
        }
        const tokenData = await response.json()
        return tokenData
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        return null
      } finally {
        setIsLoading(false)
      }
    }, [userId])
  const getGoogleTokens = useCallback(async (): Promise<TokenData | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/integrations/google/tokens`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 401 && errorData.needsRefresh) {
          return await refreshGoogleTokens()
        }
        throw new Error(errorData.error || 'Erro ao obter tokens do Google')
      }
      const tokenData = await response.json()
      return tokenData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [userId, refreshGoogleTokens])
  return {
    getGoogleTokens,
    refreshGoogleTokens,
    isLoading,
    error,
  }
}
