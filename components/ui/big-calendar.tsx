
'use client'

import { EventCalendar } from '$/components/ui'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '$/hooks/use-auth'
import type { TCalendarEvent } from '$/types/google-calendar'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useIntegrationTokens } from '$/hooks/use-integration-tokens'

export default function BigCalendar() {
  const [events, setEvents] = useState<TCalendarEvent[]>([])
  const { user } = useSession()
  const isAuthenticated = Boolean(user?.id)

  const handleEventAdd = useCallback((event: TCalendarEvent) => {
    setEvents((prev) => [...prev, event])
  }, [])

  const handleEventUpdate = useCallback((updatedEvent: TCalendarEvent) => {
    setEvents((prev) => prev.map((event) => event.id === updatedEvent.id ? updatedEvent : event))
  }, [])

  const handleEventDelete = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }, [])


  const calendarsQuery = useQuery({
    queryKey: ['googleCalendarList', user?.id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/google/calendar/calendars/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      return res.json()
    },
    enabled: isAuthenticated,
    staleTime: 3600000,
  })

  useEffect(() => {
    if (!isAuthenticated || !calendarsQuery.data || calendarsQuery.data.length === 0) {
      setEvents([])
      return
    }
    const fetchAllEvents = async () => {
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
      const url = `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/google/calendar/events/list`
      const calendarEventsResponse = await fetch(url, {
        credentials: 'include',
      })
      if (!calendarEventsResponse.ok) return []
      const calendarEventsData = await calendarEventsResponse.json()
      calendarEventsData.map((ev: any) => ({
        ...ev,
      }))
      setEvents(calendarEventsData.flat())
    }
    fetchAllEvents()
  }, [isAuthenticated, calendarsQuery.data])

  return (
    <EventCalendar
      events={events}
      initialView="month"
      onEventAdd={handleEventAdd}
      onEventDelete={handleEventDelete}
      onEventUpdate={handleEventUpdate}
    />
  )
}
