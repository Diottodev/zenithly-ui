/** biome-ignore-all lint/suspicious/noExplicitAny: any */
/** biome-ignore-all lint/suspicious/noConsole: use console in dev */
'use client'

import { EventCalendar, type EventColor } from '$/components/ui'
import { Button } from '$/components/ui/button'
// import { useCalendarContext } from '$/components/ui/calendar-context'
import type { TCalendarEvent } from '$/types/google-calendar'
import { type JSX, useCallback, useEffect, useMemo, useState } from 'react'

// Configurações OAuth do Google Calendar
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GOOGLE_SCOPES =
  'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email'
const REDIRECT_URI = 'http://localhost:3000/?tab=agenda'

// Etiquettes data for calendar filtering
export const etiquettes = [
  {
    id: 'my-events',
    name: 'My Events',
    color: 'emerald' as EventColor,
    isActive: true,
  },
  {
    id: 'marketing-team',
    name: 'Marketing Team',
    color: 'orange' as EventColor,
    isActive: true,
  },
  {
    id: 'interviews',
    name: 'Interviews',
    color: 'violet' as EventColor,
    isActive: true,
  },
  {
    id: 'events-planning',
    name: 'Events Planning',
    color: 'blue' as EventColor,
    isActive: true,
  },
  {
    id: 'holidays',
    name: 'Holidays',
    color: 'rose' as EventColor,
    isActive: true,
  },
]

export default function BigCalendar() {
  const [events, setEvents] = useState<TCalendarEvent[]>([])
  const [_colors, setColors] = useState()
  const [accessToken, setAccessToken] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  // Google OAuth login
  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      alert(
        'Configure NEXT_PUBLIC_GOOGLE_CLIENT_ID nas variáveis de ambiente (.env.local)'
      )
      return
    }
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('response_type', 'token')
    authUrl.searchParams.set('scope', GOOGLE_SCOPES)
    authUrl.searchParams.set('include_granted_scopes', 'true')

    console.log('Redirecting to Google OAuth with URL:', authUrl.toString())
    window.location.href = authUrl.toString()
  }

  // // Check for token in URL (after OAuth redirect)
  // // Utilitário para trocar a aba/tab na URL (sem hash)
  // const setTabParam = (tab: string) => {
  //   const url = new URL(window.location.href)
  //   url.searchParams.set('tab', tab)
  //   window.history.replaceState({}, document.title, url.pathname + url.search)
  // }

  // Memoize the function to avoid re-creating it on every render
  const validateTokenAndSetAuth = useCallback(async (token: string) => {
    console.log('Validating token:', `${token.substring(0, 20)}...`)
    console.log('Full token length:', token.length)
    setIsAuthenticating(true)

    try {
      // Try to validate token using the tokeninfo endpoint
      console.log('Trying tokeninfo endpoint first...')
      const tokenInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
      )

      if (tokenInfoResponse.ok) {
        const tokenInfo = await tokenInfoResponse.json()
        console.log('Token info:', tokenInfo)

        // Check if the token has the required scopes
        const hasCalendarScope = tokenInfo.scope?.includes('calendar')
        console.log('Has calendar scope:', hasCalendarScope)

        if (hasCalendarScope) {
          console.log('Token válido com escopo de calendário!')
          setAccessToken(token)
          setIsAuthenticated(true)
        } else {
          console.log('Token não tem escopo de calendário necessário')
          // Try to test calendar API directly
          console.log('Testando acesso direto à API do Calendar...')
          const calendarTestResponse = await fetch(
            'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )

          if (calendarTestResponse.ok) {
            console.log('Token funciona para Calendar API! Autenticando...')
            setAccessToken(token)
            setIsAuthenticated(true)
          } else {
            console.log('Token não funciona para Calendar API')
            setIsAuthenticated(false)
            setAccessToken('')
          }
        }
      } else {
        console.log('Token info failed, trying userinfo endpoint...')
        // Fallback to userinfo endpoint
        const userinfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v1/userinfo',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (userinfoResponse.ok) {
          const userInfo = await userinfoResponse.json()
          console.log('Token válido! Usuário:', userInfo.email)
          setAccessToken(token)
          setIsAuthenticated(true)
        } else {
          console.log(
            'Token inválido em ambos endpoints:',
            userinfoResponse.status,
            userinfoResponse.statusText
          )
          const errorText = await userinfoResponse.text()
          console.log('Error response:', errorText)

          // Last resort: try calendar API directly
          console.log('Última tentativa: testando Calendar API diretamente...')
          const calendarTestResponse = await fetch(
            'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          if (calendarTestResponse.ok) {
            console.log(
              'Token funciona para Calendar API! Autenticando mesmo sem userinfo...'
            )
            setAccessToken(token)
            setIsAuthenticated(true)
          } else {
            console.log('Token não funciona para nenhuma API')
            setIsAuthenticated(false)
            setAccessToken('')
          }
        }
      }
    } catch (error) {
      console.log('Erro ao validar token:', error)
      setIsAuthenticated(false)
      setAccessToken('')
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    console.log('Current URL hash:', hash)

    // Após OAuth, restaurar tab a partir do param ?tab=...
    // Exemplo de URL: http://localhost:3000/?tab=agenda#access_token=...
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')

    if (hash.includes('access_token')) {
      console.log('Token found in URL, extracting...')
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('access_token')
      const expiresIn = params.get('expires_in')

      console.log('Extracted token:', `${token?.substring(0, 20)}...`)
      console.log('Token expires in:', expiresIn, 'seconds')

      if (token) {
        console.log('Setting new token from URL...')
        // Validate token immediately
        validateTokenAndSetAuth(token)

        // Se veio ?tab=..., remove o hash e mantém só o param
        if (tabParam) {
          // Remove o hash da URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.search
          )
          // Não precisa restaurar hash, pois agora usamos ?tab=...
          console.log('Tab restaurada via tab param:', tabParam)
        } else {
          // Limpa o hash se não havia tab
          window.location.hash = ''
          console.log('Hash limpo após OAuth')
        }
      }
    } else {
      console.log('No token found in URL hash')
    }
  }, [validateTokenAndSetAuth]) // Only depends on the memoized function
  // Filter events based on visible colors (using a default color mapping since TCalendarEvent doesn't have color)
  const visibleEvents = useMemo(() => {
    // Garante que cada evento tenha a cor correta (vinda do _color)
    return events.map((event) => ({
      ...event,
    }))
  }, [events])
  console.log('Visible events:', visibleEvents, 'events')

  // // Exemplo: função para trocar de aba/tab (pode ser usada em botões/menu)
  // const handleTabChange = (tab: string) => {
  //   setTabParam(tab)
  //   // Se quiser disparar efeitos colaterais, faça aqui
  // }

  const handleEventAdd = (event: TCalendarEvent) => {
    setEvents([...events, event])
  }

  const handleEventUpdate = (updatedEvent: TCalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    )
  }

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  const handleReauthenticate = () => {
    console.log('Reauthenticating user...')
    setIsAuthenticated(false)
    setAccessToken('')
    setIsAuthenticating(false)
    // Clear any existing tokens in localStorage if any
    localStorage.removeItem('google_access_token')
    // Trigger Google login again
    handleGoogleLogin()
  }

  // Fetch events from Google Calendar API
  useEffect(() => {
    if (!(isAuthenticated && accessToken)) {
      return
    }
    const fetchEvents = async () => {
      try {
        console.log(
          'Buscando eventos de TODOS os calendários do Google Calendar...'
        )

        // Buscar cores dos calendários
        const res = await fetch(
          'https://www.googleapis.com/calendar/v3/colors',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        const dataColor = await res.json()
        console.log('Cores do calendário:', dataColor)
        setColors(dataColor)

        // Período de busca: 1 ano para trás e 1 ano para frente
        const now = new Date()
        const timeMin = new Date(now)
        timeMin.setFullYear(now.getFullYear() - 1)
        timeMin.setHours(0, 0, 0, 0)
        const timeMax = new Date(now)
        timeMax.setFullYear(now.getFullYear() + 1)
        timeMax.setHours(23, 59, 59, 999)

        const params = new URLSearchParams({
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          singleEvents: 'true',
          orderBy: 'startTime',
          maxResults: '2500',
        })

        // Buscar todos os calendários do usuário
        const calendarsResponse = await fetch(
          'https://www.googleapis.com/calendar/v3/users/me/calendarList',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!calendarsResponse.ok) {
          console.log(
            'Erro ao buscar lista de calendários',
            calendarsResponse.status,
            calendarsResponse.statusText
          )
          return
        }

        const calendarsData = await calendarsResponse.json()
        const calendarList = calendarsData.items || []
        console.log('Calendários encontrados:', calendarList)

        // Função para pegar a cor real do evento
        function getEventColor(calendarId: string, colors: any) {
          console.log(
            'Obtendo cor do evento para calendário:',
            calendarId,
            colors
          )

          const calendarColorId = calendarList.find(
            (e: { id: any }) => e.id === calendarId
          )
          if (calendarColorId) {
            console.log(
              'Cor do calendário encontrado:',
              colors.calendar[calendarColorId.colorId]
            )
            return colors.calendar[calendarColorId.colorId] || 'gray'
          }
          return
        }

        // Fetch all calendar events concurrently to avoid await in loop
        // biome-ignore lint/suspicious/noExplicitAny: any
        const eventFetchPromises = calendarList.map(async (calendar: any) => {
          console.log(
            `Buscando eventos do calendário: ${calendar.summary} (${calendar.id})`
          )
          try {
            const calendarEventsResponse = await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
                calendar.id
              )}/events?${params}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            if (calendarEventsResponse.ok) {
              const calendarEventsData = await calendarEventsResponse.json()
              console.log(
                `Eventos encontrados no calendário ${calendar.summary}:`,
                calendarEventsData.items?.length || 0
              )
              if (
                calendarEventsData.items &&
                calendarEventsData.items.length > 0
              ) {
                return calendarEventsData.items.map((ev: any) => ({
                  ...ev,
                  _calendarId: calendar.id,
                  _calendarSummary: calendar.summary,
                  _color: getEventColor(calendar.id, dataColor),
                }))
              }
            }
          } catch (e) {
            console.log(
              `Erro ao buscar eventos do calendário ${calendar.summary}:`,
              e
            )
          }
          return []
        })

        const allEventsArrays = await Promise.all(eventFetchPromises)
        const allEvents = allEventsArrays.flat()

        console.log(
          'Total de eventos encontrados em todos os calendários:',
          allEvents.length
        )
        if (allEvents.length > 0) {
          console.log('Eventos válidos de todos os calendários:', allEvents)
          setEvents(allEvents)
        } else {
          setEvents([])
        }
      } catch (error) {
        console.log('Erro ao buscar eventos:', error)
      }
    }

    fetchEvents()
  }, [isAuthenticated, accessToken]) // Re-run when authentication status changes

  // Show console.login button if not authenticated
  let calendarContent: JSX.Element | null = null
  if (!isAuthenticated) {
    if (isAuthenticating) {
      calendarContent = (
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
          <p className="text-muted-foreground">Autenticando com Google...</p>
        </div>
      )
    } else {
      calendarContent = (
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <h2 className="font-semibold text-xl">
            Conecte-se ao Google Calendar
          </h2>
          <p className="max-w-md text-center text-muted-foreground">
            Para visualizar seus eventos, você precisa se conectar com sua conta
            do Google.
          </p>

          {/* Show debug info if there's a failed token */}
          {accessToken && !isAuthenticated && (
            <div className="max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="mb-2 font-semibold text-red-800">
                Problema de Autenticação
              </h3>
              <p className="mb-2 text-red-700 text-sm">
                O token foi obtido mas não pôde ser validado. Isso pode
                acontecer por:
              </p>
              <ul className="list-inside list-disc space-y-1 text-red-700 text-sm">
                <li>Token expirado ou inválido</li>
                <li>Permissões insuficientes nos escopos do OAuth</li>
                <li>Configuração incorreta no Google Cloud Console</li>
              </ul>
              <p className="mt-2 text-red-700 text-sm">
                Tente fazer console.login novamente ou verifique as
                configurações.
              </p>
            </div>
          )}

          {!GOOGLE_CLIENT_ID && (
            <div className="max-w-2xl rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h3 className="mb-2 font-semibold text-yellow-800">
                Configuração Necessária
              </h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-yellow-700">
                <li>
                  Acesse{' '}
                  <a
                    className="underline"
                    href="https://console.cloud.google.com/"
                    rel="noopener"
                    target="_blank"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li>Crie um projeto ou selecione um existente</li>
                <li>Ative a Google Calendar API</li>
                <li>Crie credenciais OAuth 2.0 (Aplicação Web)</li>
                <li>
                  Adicione{' '}
                  <code className="rounded bg-yellow-100 px-1">
                    {REDIRECT_URI}
                  </code>{' '}
                  nas URIs de redirecionamento
                </li>
                <li>
                  Configure a variável{' '}
                  <code className="rounded bg-yellow-100 px-1">
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID
                  </code>{' '}
                  no arquivo .env.local
                </li>
              </ol>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              className="gap-2"
              disabled={!GOOGLE_CLIENT_ID}
              onClick={handleGoogleLogin}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="currentColor"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="currentColor"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="currentColor"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="currentColor"
                />
              </svg>
              Conectar com Google
            </Button>
            {/* Show retry button if there was a failed authentication attempt */}
            {accessToken && !isAuthenticated && (
              <Button
                className="gap-2"
                onClick={handleReauthenticate}
                variant="outline"
              >
                Tentar Novamente
              </Button>
            )}
          </div>
        </div>
      )
    }
  }

  if (calendarContent) {
    return calendarContent
  }

  return (
    <EventCalendar
      events={visibleEvents}
      initialView="week"
      onEventAdd={handleEventAdd}
      onEventDelete={handleEventDelete}
      onEventUpdate={handleEventUpdate}
    />
  )
}
