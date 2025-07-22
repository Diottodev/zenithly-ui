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
        const eventStart = new Date(event.start.dateTime || event.start.date || "")
        return (
          currentDate.getDate() === eventStart.getDate() &&
          currentDate.getMonth() === eventStart.getMonth() &&
          currentDate.getFullYear() === eventStart.getFullYear()
        )
      })
  }, [currentDate, events])

  const allDayEvents = useMemo(() => {
    return dayEvents.filter((event) => {
      return event.start.date || isMultiDayEvent(event as unknown as TCalendarEvent)
    })
  }, [dayEvents])

  // Get only single-day time-based events
  const timeEvents = useMemo(() => {
    return dayEvents.filter((event) => {
      // Exclude all-day events and multi-day events
      return !(
        event.start.date || isMultiDayEvent(event as unknown as TCalendarEvent)
      )
    })
  }, [dayEvents])

  // Process events to calculate positions
  const positionedEvents = useMemo(() => {
    const result: PositionedEvent[] = []
    const dayStart = startOfDay(currentDate)
    // Sort events by start time and duration
    const sortedEvents = [...timeEvents].sort((a, b) => {
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
    // Track columns for overlapping events
    const columns: { event: TCalendarEvent; end: Date }[][] = []
    function adjustEventTimes(
      event: TCalendarEvent,
      prevDate: Date,
      prevDayStart: Date
    ) {
      const eventStart = new Date(event.start.dateTime || event.start.date || "")
      const eventEnd = new Date(event.end.dateTime || event.end.date || "")
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
      prevColumns: { event: TCalendarEvent; end: Date }[][],
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
              { start: new Date(c.event.start.dateTime || c.event.start.date || ""), end: new Date(c.event.end.dateTime || c.event.end.date || "") }
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

  const handleEventClick = (event: TCalendarEvent, e: React.MouseEvent) => {
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
              <span className="absolute bottom-5 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                O dia todo
              </span>
            </div>
            <div className="relative border-border/70 border-r p-3 last:border-r-0">
              {allDayEvents.map((event) => {
                const eventStart = new Date(event.start.dateTime || event.start.date || "")
                const eventEnd = new Date(event.end.dateTime || event.end.date || "")
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
                    {/* Always show the summary in day view for better usability */}
                    <div>{event.summary}</div>
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
              <DraggableEvent
                event={positionedEvent.event}
                height={positionedEvent.height}
                onClick={(e) => handleEventClick(positionedEvent.event, e)}
                showTime
                view="day"
              />
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
