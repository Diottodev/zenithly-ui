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
  eachHourOfInterval,
  format,
  getHours,
  getMinutes,
  isSameDay,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type React from 'react'
import { useMemo } from 'react'

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventSelectAction: (event: CalendarEvent) => void
  onEventCreateAction: (startTime: Date) => void
}

interface PositionedEvent {
  event: CalendarEvent
  top: number
  height: number
  left: number
  width: number
  zIndex: number
}

export function DayView({
  currentDate,
  events,
  onEventSelectAction,
  onEventCreateAction,
}: DayViewProps) {
  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate)
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    })
  }, [currentDate])

  const dayEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)
        return (
          isSameDay(currentDate, eventStart) ||
          isSameDay(currentDate, eventEnd) ||
          (currentDate > eventStart && currentDate < eventEnd)
        )
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }, [currentDate, events])

  // Filter all-day events
  const allDayEvents = useMemo(() => {
    return dayEvents.filter((event) => {
      // Include explicitly marked all-day events or multi-day events
      return event.allDay || isMultiDayEvent(event as unknown as TCalendarEvent)
    })
  }, [dayEvents])

  // Get only single-day time-based events
  const timeEvents = useMemo(() => {
    return dayEvents.filter((event) => {
      // Exclude all-day events and multi-day events
      return !(
        event.allDay || isMultiDayEvent(event as unknown as TCalendarEvent)
      )
    })
  }, [dayEvents])

  // Process events to calculate positions
  const positionedEvents = useMemo(() => {
    const result: PositionedEvent[] = []
    const dayStart = startOfDay(currentDate)

    // Sort events by start time and duration
    const sortedEvents = [...timeEvents].sort((a, b) => {
      const aStart = new Date(a.start)
      const bStart = new Date(b.start)
      const aEnd = new Date(a.end)
      const bEnd = new Date(b.end)

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

    // Track columns for overlapping events
    const columns: { event: CalendarEvent; end: Date }[][] = []

    function adjustEventTimes(
      event: CalendarEvent,
      prevDate: Date,
      prevDayStart: Date
    ) {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      const adjustedStart = isSameDay(prevDate, eventStart)
        ? eventStart
        : prevDayStart
      const adjustedEnd = isSameDay(prevDate, eventEnd)
        ? eventEnd
        : addHours(prevDayStart, 24)
      return { adjustedStart, adjustedEnd }
    }

    function calculatePosition(
      adjustedStart: Date,
      adjustedEnd: Date
    ): { top: number; height: number } {
      const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60
      const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60
      const top = (startHour - StartHour) * WeekCellsHeight
      const height = (endHour - startHour) * WeekCellsHeight
      return { top, height }
    }

    function findColumn(
      prevColumns: { event: CalendarEvent; end: Date }[][],
      adjustedStart: Date,
      adjustedEnd: Date
    ): number {
      let columnIndex = 0
      let placed = false
      while (!placed) {
        const col = prevColumns[columnIndex] || []
        if (col.length === 0) {
          prevColumns[columnIndex] = col
          placed = true
        } else {
          const overlaps = col.some((c) =>
            areIntervalsOverlapping(
              { start: adjustedStart, end: adjustedEnd },
              { start: new Date(c.event.start), end: new Date(c.event.end) }
            )
          )
          if (overlaps) {
            columnIndex++
          } else {
            placed = true
          }
        }
      }
      return columnIndex
    }

    for (const event of sortedEvents) {
      const { adjustedStart, adjustedEnd } = adjustEventTimes(
        event,
        currentDate,
        dayStart
      )
      const { top, height } = calculatePosition(adjustedStart, adjustedEnd)
      const columnIndex = findColumn(columns, adjustedStart, adjustedEnd)

      // Ensure column is initialized before pushing
      const currentColumn = columns[columnIndex] || []
      columns[columnIndex] = currentColumn
      currentColumn.push({ event, end: adjustedEnd })

      // First column takes full width, others are indented by 10% and take 90% width
      const width = columnIndex === 0 ? 1 : 0.9
      const left = columnIndex === 0 ? 0 : columnIndex * 0.1

      result.push({
        event,
        top,
        height,
        left,
        width,
        zIndex: 10 + columnIndex, // Higher columns get higher z-index
      })
    }

    return result
  }, [currentDate, timeEvents])

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelectAction(event)
  }

  const showAllDaySection = allDayEvents.length > 0
  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    'day'
  )

  return (
    <div className="contents" data-slot="day-view">
      {showAllDaySection && (
        <div className="border-border/70 border-t bg-muted/50">
          <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr]">
            <div className="relative">
              <span className="absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                O dia todo
              </span>
            </div>
            <div className="relative border-border/70 border-r p-1 last:border-r-0">
              {allDayEvents.map((event) => {
                const eventStart = new Date(event.start)
                const eventEnd = new Date(event.end)
                const isFirstDay = isSameDay(currentDate, eventStart)
                const isLastDay = isSameDay(currentDate, eventEnd)
                return (
                  <EventItem
                    event={event}
                    isFirstDay={isFirstDay}
                    isLastDay={isLastDay}
                    key={`spanning-${event.id}`}
                    onClick={(e) => handleEventClick(event, e)}
                    view="month"
                  >
                    {/* Always show the title in day view for better usability */}
                    <div>{event.title}</div>
                  </EventItem>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid flex-1 grid-cols-[3rem_1fr] overflow-hidden border-border/70 border-t sm:grid-cols-[4rem_1fr]">
        <div>
          {hours.map((hour, index) => (
            <div
              className="relative h-[var(--week-cells-height)] border-border/70 border-b last:border-b-0"
              key={hour.toString()}
            >
              {index > 0 && (
                <span className="-top-3 absolute left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                  {format(hour, 'HH:mm', { locale: ptBR })}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="relative">
          {/* Positioned events */}
          {positionedEvents.map((positionedEvent) => (
            <div
              className="absolute z-10 px-0.5"
              key={positionedEvent.event.id}
              style={{
                top: `${positionedEvent.top}px`,
                height: `${positionedEvent.height}px`,
                left: `${positionedEvent.left * 100}%`,
                width: `${positionedEvent.width * 100}%`,
                zIndex: positionedEvent.zIndex,
              }}
            >
              <div className="h-full w-full">
                <DraggableEvent
                  event={positionedEvent.event}
                  height={positionedEvent.height}
                  onClick={(e) => handleEventClick(positionedEvent.event, e)}
                  showTime
                  view="day"
                />
              </div>
            </div>
          ))}

          {/* Current time indicator */}
          {currentTimeVisible && (
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

          {/* Time grid */}
          {hours.map((hour) => {
            const hourValue = getHours(hour)
            return (
              <div
                className="relative h-[var(--week-cells-height)] border-border/70 border-b last:border-b-0"
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
                      date={currentDate}
                      id={`day-cell-${currentDate.toISOString()}-${quarterHourTime}`}
                      key={`${hour.toString()}-${quarter}`}
                      onClick={() => {
                        const startTime = new Date(currentDate)
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
      </div>
    </div>
  )
}
