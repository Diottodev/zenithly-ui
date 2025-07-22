'use client'

import {
  AgendaDaysToShow,
  type CalendarEvent,
  EventItem,
} from '$/components/ui'
import type { TCalendarEvent } from '$/types/google-calendar'
import { getAgendaEventsForDay } from '$/utils/get-agenda-events-for-day'
import { RiCalendarEventLine } from '@remixicon/react'
import { addDays, format, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo } from 'react'

interface AgendaViewProps {
  currentDate: Date
  events: TCalendarEvent[]
  onEventSelectAction: (event: TCalendarEvent) => void
}

export function AgendaView({
  currentDate,
  events,
  onEventSelectAction,
}: AgendaViewProps) {
  // Show events for the next days based on constant
  const days = useMemo(() => {
    return Array.from({ length: AgendaDaysToShow }, (_, i) =>
      addDays(new Date(currentDate), i)
    )
  }, [currentDate])

  const handleEventClick = (event: TCalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelectAction(event)
  }

  // Check if there are any days with events
  const hasEvents = days.some(
    (day) =>
      getAgendaEventsForDay(events as unknown as TCalendarEvent[], day).length >
      0
  )

  return (
    <div className="border-border/70 border-t ps-4">
      {hasEvents ? (
        days.map((day) => {
          const dayEvents = getAgendaEventsForDay(
            events as unknown as TCalendarEvent[],
            day
          )
          if (dayEvents.length === 0) {
            return null
          }
          return (
            <div
              className="relative my-12 border-border/70 border-t"
              key={day.toString()}
            >
              <span
                className="-top-3 absolute left-0 flex h-6 items-center bg-background pe-4 text-[10px] uppercase data-today:font-medium sm:pe-4 sm:text-xs"
                data-today={isToday(day) || undefined}
              >
                {format(day, 'd MMM, EEEE', { locale: ptBR })}
              </span>
              <div className="mt-6 space-y-2">
                {dayEvents.map((event) => (
                  <EventItem
                    event={event}
                    key={event.id}
                    onClick={(e) =>
                      handleEventClick(event, e)
                    }
                    view="agenda"
                  />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <RiCalendarEventLine
            className="mb-2 text-muted-foreground/50"
            size={32}
          />
          <h3 className="font-medium text-lg">Nenhum evento encontrado</h3>
          <p className="text-muted-foreground">
            Não há eventos agendados para este período.
          </p>
        </div>
      )}
    </div>
  )
}
