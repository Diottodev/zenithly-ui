'use client'

import {
  type CalendarEvent,
  DraggableEvent,
  DroppableCell,
  EventGap,
  EventHeight,
  EventItem,
  useEventVisibility,
} from '$/components/ui'
import { DefaultStartHour } from '$/components/ui/constants'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '$/components/ui/popover'
import type { TCalendarEvent } from '$/types/google-calendar'
import { getAllEventsForDay } from '$/utils/get-all-events-for-day'
import { getEventsForDay } from '$/utils/get-events-for-day'
import { getSpanningEventsForDay } from '$/utils/get-spanning-events-for-day'
import { sortEvents } from '$/utils/sort-events'
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'

interface MonthViewProps {
  currentDate: Date
  events: TCalendarEvent[]
  onEventSelectAction: (event: TCalendarEvent) => void
  onEventCreateAction: (startTime: Date) => void
}

export function MonthView({
  currentDate,
  events,
  onEventSelectAction,
  onEventCreateAction,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date()), i)
      return format(date, 'EEE', { locale: ptBR })
    })
  }, [])

  const weeks = useMemo(() => {
    const result: Date[][] = []
    let week: Date[] = []
    for (let i = 0; i < days.length; i++) {
      week.push(days[i])
      if (week.length === 7 || i === days.length - 1) {
        result.push(week)
        week = []
      }
    }
    return result
  }, [days])

  const handleEventClick = (event: TCalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelectAction(event)
  }

  const [isMounted, setIsMounted] = useState(false)
  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EventHeight,
    eventGap: EventGap,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])


  return (
    <div className="contents" data-slot="month-view">
      <div className="grid grid-cols-7 border-border/70 border-y uppercase">
        {weekdays.map((day) => (
          <div
            className="py-2 text-center text-muted-foreground/70 text-xs"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid flex-1 auto-rows-fr">
        {weeks.map((week, weekIndex) => (
          <div
            className="grid grid-cols-7 [&:last-child>*]:border-b-0"
            key={week[0]?.toISOString()}
          >
            {week.map((day, dayIndex) => {
              if (!day) {
                return null
              }
              const dayEvents = getEventsForDay(
                events,
                day
              )
              const spanningEvents = getSpanningEventsForDay(
                events,
                day
              )
              const isCurrentMonth = isSameMonth(day, currentDate)
              const cellId = `month-cell-${day.toISOString()}`
              const allDayEvents = [...spanningEvents, ...dayEvents]
              const allEvents = getAllEventsForDay(
                events,
                day
              )
              const isReferenceCell = weekIndex === 0 && dayIndex === 0
              const visibleCount = isMounted
                ? getVisibleEventCount(allDayEvents.length)
                : undefined
              const hasMore =
                visibleCount !== undefined && allDayEvents.length > visibleCount
              const remainingCount = hasMore
                ? allDayEvents.length - visibleCount
                : 0

              return (
                <div
                  className="group border-border/70 border-r border-b last:border-r-0 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70"
                  data-outside-cell={!isCurrentMonth || undefined}
                  data-today={isToday(day) || undefined}
                  key={day.toString()}
                >
                  <DroppableCell
                    date={day}
                    id={cellId}
                    onClick={() => {
                      const startTime = new Date(day)
                      startTime.setHours(DefaultStartHour, 0, 0)
                      onEventCreateAction(startTime)
                    }}
                  >
                    <div className="mt-1 inline-flex size-6 items-center justify-center rounded-full text-sm group-data-today:bg-primary group-data-today:text-primary-foreground">
                      {format(day, 'd', { locale: ptBR })}
                    </div>
                    <div
                      className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]"
                      ref={isReferenceCell ? contentRef : null}
                    >
                      {sortEvents(allDayEvents).map((event, index) => {
                        const dateStart = String(
                          event.start.dateTime || event.start.date
                        )
                        const dateEnd = String(
                          event.end.dateTime || event.end.date
                        )
                        const eventStart = new Date(dateStart)
                        const eventEnd = new Date(dateEnd)
                        const isFirstDay = isSameDay(day, eventStart)
                        const isLastDay = isSameDay(day, eventEnd)
                        const isHidden =
                          isMounted && visibleCount && index >= visibleCount
                        if (!visibleCount) {
                          return null
                        }
                        if (!isFirstDay) {
                          return (
                            <div
                              aria-hidden={isHidden ? 'true' : undefined}
                              className="aria-hidden:hidden"
                              key={`spanning-${event.id}-${day
                                .toISOString()
                                .slice(0, 10)}`}
                            >
                              <EventItem
                                event={event}
                                isFirstDay={isFirstDay}
                                isLastDay={isLastDay}
                                onClick={(e) =>
                                  handleEventClick(
                                    event,
                                    e
                                  )
                                }
                                view="month"
                              >
                                <div aria-hidden={true} className="invisible">
                                  {event.start.date && (
                                    <span>
                                      {format(new Date(event.start.date || ''), "h:mm", {
                                        locale: ptBR,
                                      })}{" "}
                                    </span>
                                  )}
                                  {event.summary}
                                </div>
                              </EventItem>
                            </div>
                          )
                        }
                        return (
                          <div
                            aria-hidden={isHidden ? 'true' : undefined}
                            className="aria-hidden:hidden"
                            key={event.id}
                          >
                            <DraggableEvent
                              event={event}
                              isFirstDay={isFirstDay}
                              isLastDay={isLastDay}
                              onClick={(e) =>
                                handleEventClick(
                                  event,
                                  e
                                )
                              }
                              view="month"
                            />
                          </div>
                        )
                      })}

                      {hasMore && (
                        <Popover modal>
                          <PopoverTrigger asChild>
                            <button
                              className="mt-[var(--event-gap)] flex h-[var(--event-height)] w-full select-none items-center overflow-hidden px-1 text-left text-[10px] text-muted-foreground outline-none backdrop-blur-md transition hover:bg-muted/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-2 sm:text-xs"
                              onClick={(e) => e.stopPropagation()}
                              type="button"
                            >
                              <span>
                                + {remainingCount}{' '}
                                <span className="max-sm:sr-only">more</span>
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            className="max-w-52 p-3"
                            style={
                              {
                                '--event-height': `${EventHeight}px`,
                              } as React.CSSProperties
                            }
                          >
                            <div className="space-y-2">
                              <div className="font-medium text-sm">
                                {format(day, 'EEE d')}
                              </div>
                              <div className="space-y-1">
                                {sortEvents(allEvents).map((event) => {
                                  const dateStart = String(
                                    event.start.dateTime || event.start.date
                                  )
                                  const dateEnd = String(
                                    event.end.dateTime || event.end.date
                                  )
                                  const eventStart = new Date(dateStart)
                                  const eventEnd = new Date(dateEnd)
                                  const isFirstDay = isSameDay(day, eventStart)
                                  const isLastDay = isSameDay(day, eventEnd)
                                  return (
                                    <EventItem
                                      event={event}
                                      isFirstDay={isFirstDay}
                                      isLastDay={isLastDay}
                                      key={event.id}
                                      onClick={(e) =>
                                        handleEventClick(
                                          event,
                                          e
                                        )
                                      }
                                      view="month"
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </DroppableCell>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
