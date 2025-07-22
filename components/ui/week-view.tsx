'use client'

import {
  type CalendarEvent,
  DraggableEvent,
  DroppableCell,
  EventItem,
  useCurrentTimeIndicator,
  WeekCellsHeight,
} from '$/components/ui'
import { EndHour, StartHour } from '$/components/ui/constants'
import { cn } from '$/lib/utils'
import type { TCalendarEvent } from '$/types/google-calendar'
import { isMultiDayEvent } from '$/utils/is-multi-day-event'
import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type React from 'react'
import { useMemo } from 'react'

interface WeekViewProps {
  currentDate: Date
  events: TCalendarEvent[]
  onEventSelectAction: (event: TCalendarEvent) => void
  onEventCreateAction: (startTime: Date) => void
}

interface PositionedEvent {
  event: TCalendarEvent
  top: number
  height: number
  left: number
  width: number
  zIndex: number
}

export function WeekView({
  currentDate,
  events,
  onEventSelectAction,
  onEventCreateAction,
}: WeekViewProps) {
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentDate])
  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  )
  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate)
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    })
  }, [currentDate])
  // Get all-day events and multi-day events for the week
  const allDayEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Include explicitly marked all-day events or multi-day events
        return (
          event.start.date || isMultiDayEvent(event as unknown as TCalendarEvent)
        )
      })
      .filter((event) => {
        const eventStart = new Date(event.start.date || event.start.dateTime || "")
        const eventEnd = new Date(event.end.date || event.end.dateTime || "")
        return days.some(
          (day) =>
            isSameDay(day, eventStart) ||
            isSameDay(day, eventEnd) ||
            (day > eventStart && day < eventEnd)
        )
      })
  }, [events, days])
  // Process events for each day to calculate positions
  const processedDayEvents = useMemo(() => {
    const result = days.map((day) => {
      // Get events for this day that are not all-day events or multi-day events
      const dayEvents = events.filter((event) => {
        // Skip all-day events and multi-day events
        if (
          event.start.dateTime ||
          isMultiDayEvent(event as unknown as TCalendarEvent)
        ) {
          return false
        }
        const eventStart = new Date(event.start.dateTime || event.start.date || "")
        const eventEnd = new Date(event.end.dateTime || event.end.date || "")
        // Check if event is on this day
        return (
          isSameDay(day, eventStart) ||
          isSameDay(day, eventEnd) ||
          (eventStart < day && eventEnd > day)
        )
      })
      // Sort events by start time and duration
      const sortedEvents = [...dayEvents].sort((a, b) => {
        const aStart = new Date(a.start.dateTime || a.start.date || "")
        const bStart = new Date(b.start.dateTime || b.start.date || "")
        const aEnd = new Date(a.end.dateTime || a.end.date || "")
        const bEnd = new Date(b.end.dateTime || b.end.date || "")
        // First sort by start time
        if (aStart < bStart) {
          return -1
        }
        if (aStart > bStart) {
          return 1
        }
        // If start times are equal, sort by duration (longer events first)
        const aDuration = differenceInMinutes(aEnd, aStart)
        const bDuration = differenceInMinutes(bEnd, bStart)
        return bDuration - aDuration
      })
      // Calculate positions for each event
      const positionedEvents: PositionedEvent[] = []
      const dayStart = startOfDay(day)
      // Track columns for overlapping events
      const columns: { event: TCalendarEvent; end: Date }[][] = []
      for (const event of sortedEvents) {
        const eventStart = new Date(event.start.dateTime || event.start.date || "")
        const eventEnd = new Date(event.end.dateTime || event.end.date || "")
        // Adjust start and end times if they're outside this day
        const adjustedStart = isSameDay(day, eventStart) ? eventStart : dayStart
        const adjustedEnd = isSameDay(day, eventEnd)
          ? eventEnd
          : addHours(dayStart, 24)
        // Calculate top position and height
        const startHour =
          getHours(adjustedStart) + getMinutes(adjustedStart) / 60
        const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60
        // Adjust the top calculation to account for the new start time
        const top = (startHour - StartHour) * WeekCellsHeight
        const height = (endHour - startHour) * WeekCellsHeight
        // Find a column for this event
        let columnIndex = 0
        let placed = false
        while (!placed) {
          const col = columns[columnIndex] || []
          if (col.length === 0) {
            columns[columnIndex] = col
            placed = true
          } else {
            const overlaps = col.some((c) =>
              areIntervalsOverlapping(
                { start: adjustedStart, end: adjustedEnd },
                {
                  start: new Date(c.event.start.dateTime || c.event.start.date || ""),
                  end: new Date(c.event.end.dateTime || c.event.end.date || ""),
                }
              )
            )
            if (overlaps) {
              columnIndex++
            } else {
              placed = true
            }
          }
        }
        // Ensure column is initialized before pushing
        const currentColumn = columns[columnIndex] || []
        columns[columnIndex] = currentColumn
        currentColumn.push({ event, end: adjustedEnd })
        // Calculate width and left position based on number of columns
        const width = columnIndex === 0 ? 1 : 0.9
        const left = columnIndex === 0 ? 0 : columnIndex * 0.1
        positionedEvents.push({
          event,
          top,
          height,
          left,
          width,
          zIndex: 10 + columnIndex, // Higher columns get higher z-index
        })
      }
      return positionedEvents
    })
    return result
  }, [days, events])
  const handleEventClick = (event: TCalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelectAction(event)
  }
  const showAllDaySection = allDayEvents.length > 0
  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    'week'
  )

  return (
    <div className="flex h-full flex-col" data-slot="week-view">
      <div className="sticky top-0 z-30 grid grid-cols-8 border-border/70 border-y bg-background/80 uppercase backdrop-blur-md">
        <div className="py-2 text-center text-muted-foreground/70 text-xs">
          <span className="max-[479px]:sr-only">Horários</span>
        </div>
        {days.map((day) => (
          <div
            className="py-2 text-center text-muted-foreground/70 text-xs data-today:font-medium data-today:text-foreground"
            data-today={isToday(day) || undefined}
            key={day.toString()}
          >
            <span aria-hidden="true" className="sm:hidden">
              {format(day, 'E', { locale: ptBR })[0]}{' '}
              {format(day, 'd', { locale: ptBR })}
            </span>
            <span className="max-sm:hidden">
              {format(day, 'EEE dd', { locale: ptBR })}
            </span>
          </div>
        ))}
      </div>
      {showAllDaySection && (
        <div className="border-border/70 border-b bg-muted/50">
          <div className="grid grid-cols-8">
            <div className="relative border-border/70 border-r">
              <span className="absolute bottom-0 left-0 h-4 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                O dia todo
              </span>
            </div>
            {days.map((day, dayIndex) => {
              const dayAllDayEvents = allDayEvents.filter((event) => {
                const eventStart = new Date(event.start.dateTime || event.start.date || "")
                const eventEnd = new Date(event.end.dateTime || event.end.date || "")
                return (
                  isSameDay(day, eventStart) ||
                  (day > eventStart && day < eventEnd) ||
                  isSameDay(day, eventEnd)
                )
              })
              return (
                <div
                  className="relative border-border/70 border-r p-1 last:border-r-0"
                  data-today={isToday(day) || undefined}
                  key={day.toString()}
                >
                  {dayAllDayEvents.map((event) => {
                    const eventStart = new Date(event.start.dateTime || event.start.date || "")
                    const eventEnd = new Date(event.end.dateTime || event.end.date || "")
                    const isFirstDay = isSameDay(day, eventStart)
                    const isLastDay = isSameDay(day, eventEnd)
                    // Check if this is the first day in the current week view
                    const isFirstVisibleDay =
                      dayIndex === 0 && isBefore(eventStart, weekStart)
                    const shouldShowTitle = isFirstDay || isFirstVisibleDay
                    return (
                      <EventItem
                        event={event}
                        isFirstDay={isFirstDay}
                        isLastDay={isLastDay}
                        key={`spanning-${event.id}`}
                        onClick={(e) => handleEventClick(event, e)}
                        view="month"
                      >
                        {/* Show title if it's the first day of the event or the first visible day in the week */}
                        <div
                          aria-hidden={!shouldShowTitle}
                          className={cn(
                            'truncate',
                            !shouldShowTitle && 'invisible'
                          )}
                        >
                          {event.summary}
                        </div>
                      </EventItem>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid flex-1 grid-cols-8 overflow-hidden">
        <div className="grid auto-cols-fr border-border/70 border-r">
          {hours.map((hour, index) => (
            <div
              className="relative min-h-[var(--week-cells-height)] border-border/70 border-b last:border-b-0"
              key={hour.toString()}
            >
              {index > 0 && (
                <span className="-top-3 absolute left-0 flex h-5 w-18 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                  {format(hour, 'HH:mm', { locale: ptBR })}
                </span>
              )}
            </div>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div
            className="relative grid auto-cols-fr border-border/70 border-r last:border-r-0"
            data-today={isToday(day) || undefined}
            key={day.toString()}
          >
            {/* Positioned events */}
            {(processedDayEvents[dayIndex] ?? []).map((positionedEvent) => (
              <div
                role="button"
                aria-label={`Abrir evento: ${positionedEvent.event.summary}`}
                className="absolute z-10 w-full px-0.5"
                key={positionedEvent.event.id}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    handleEventClick(
                      positionedEvent.event,
                      e as unknown as React.MouseEvent
                    )
                  }
                }}
                style={{
                  top: `${positionedEvent.top}px`,
                  height: `${positionedEvent.height}px`,
                  left: `${positionedEvent.left * 100}%`,
                  width: `${positionedEvent.width * 100}%`,
                  zIndex: positionedEvent.zIndex,
                }}
                tabIndex={0}
              >
                <div className="pointer-events-none h-full w-full">
                  <DraggableEvent
                    event={positionedEvent.event}
                    height={positionedEvent.height}
                    onClick={(e) => handleEventClick(positionedEvent.event, e)}
                    showTime
                    view="week"
                  />
                </div>
              </div>
            ))}
            {/* Current time indicator - only show for today's column */}
            {currentTimeVisible && isToday(day) && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="relative flex items-center">
                  <div className="-left-1 absolute h-2 w-2 rounded-full bg-red-500" />
                  <div className="h-[2px] w-full bg-red-500" />
                </div>
              </div>
            )}
            {hours.map((hour) => {
              const hourValue = getHours(hour)
              return (
                <div
                  className="relative min-h-[var(--week-cells-height)] border-border/70 border-b last:border-b-0"
                  key={hour.toString()}
                >
                  {/* Quarter-hour intervals */}
                  {[0, 1, 2, 3].map((quarter) => {
                    const quarterHourTime = hourValue + quarter * 0.25
                    return (
                      <DroppableCell
                        className={cn(
                          'absolute h-[calc(var(--week-cells-height)/4)] w-full',
                          quarter === 0 && 'top-0',
                          quarter === 1 &&
                          'top-[calc(var(--week-cells-height)/4)]',
                          quarter === 2 &&
                          'top-[calc(var(--week-cells-height)/4*2)]',
                          quarter === 3 &&
                          'top-[calc(var(--week-cells-height)/4*3)]'
                        )}
                        date={day}
                        id={`week-cell-${day.toISOString()}-${quarterHourTime}`}
                        key={`${hour.toString()}-${quarter}`}
                        onClick={() => {
                          const startTime = new Date(day)
                          startTime.setHours(hourValue)
                          startTime.setMinutes(quarter * 15)
                          onEventCreateAction(startTime)
                        }}
                        time={quarterHourTime}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
