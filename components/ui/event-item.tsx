'use client'

import type { CalendarEvent } from '$/components/ui'
import { cn } from '$/lib/utils'
import { getBorderRadiusClasses } from '$/utils/get-border-radius-classes'
import { getEventColorClasses } from '$/utils/get-event-color-classes'
import type { DraggableAttributes } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { differenceInMinutes, format, getMinutes, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo } from 'react'

// format time whith 24h, ex: 13:00 ou 13:30
const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? 'HH:mm' : 'HH:mm', {
    locale: ptBR,
  })
}

interface EventWrapperProps {
  event: CalendarEvent
  isFirstDay?: boolean
  isLastDay?: boolean
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
  children: React.ReactNode
  currentTime?: Date
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

// Shared wrapper component for event styling
function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  // Always use the currentTime (if provided) to determine if the event is in the past
  const displayEnd = currentTime
    ? new Date(
        new Date(currentTime).getTime() +
          (new Date(event.end).getTime() - new Date(event.start).getTime())
      )
    : new Date(event.end)

  const isEventInPast = isPast(displayEnd)
  console.log(
    getEventColorClasses(
      event._color as { background: string; foreground: string }
    ),
    getBorderRadiusClasses(isFirstDay, isLastDay),
    'LOG DEBUG'
  )

  return (
    <button
      className={cn(
        'flex h-full w-full select-none overflow-hidden px-1 text-left font-medium outline-none backdrop-blur-md transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-past-event:line-through data-dragging:shadow-lg sm:px-2',
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className
      )}
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        background: getEventColorClasses(
          event._color as { background: string; foreground: string }
        )[0],
        color: getEventColorClasses(
          event._color as { background: string; foreground: string }
        )[1],
      }}
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  )
}

interface EventItemProps {
  event: CalendarEvent
  view: 'month' | 'week' | 'day' | 'agenda'
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  showTime?: boolean
  currentTime?: Date // For updating time during drag
  isFirstDay?: boolean
  isLastDay?: boolean
  children?: React.ReactNode
  className?: string
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

function AgendaEventItem({
  event,
  eventColor,
  displayStart,
  displayEnd,
  className,
  onClick,
  onMouseDown,
  onTouchStart,
  dndListeners,
  dndAttributes,
}: {
  event: CalendarEvent
  eventColor: unknown
  displayStart: Date
  displayEnd: Date
  className?: string
  onClick?: (e: React.MouseEvent) => void
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
}) {
  return (
    <button
      className={cn(
        'flex w-full flex-col gap-1 rounded p-2 text-left outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-past-event:line-through data-past-event:opacity-90',
        getEventColorClasses(
          eventColor as { background: string; foreground: string }
        ),
        className
      )}
      data-past-event={isPast(new Date(event.end)) || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      <div className="font-medium text-sm">{event.title}</div>
      <div className="text-xs opacity-70">
        {event.allDay ? (
          <span>All day</span>
        ) : (
          <span className="uppercase">
            {formatTimeWithOptionalMinutes(displayStart)} -{' '}
            {formatTimeWithOptionalMinutes(displayEnd)}
          </span>
        )}
        {event.location && (
          <>
            <span className="px-1 opacity-35"> · </span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {event.description && (
        <div className="my-1 text-xs opacity-90">{event.description}</div>
      )}
    </button>
  )
}

export function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  const eventColor = event._color
  console.log(
    'color',
    getEventColorClasses(
      eventColor as { background: string; foreground: string }
    )
  )
  // Use the provided currentTime (for dragging) or the event's actual time
  const displayStart = useMemo(() => {
    return currentTime || new Date(event.start)
  }, [currentTime, event.start])

  const displayEnd = useMemo(() => {
    return currentTime
      ? new Date(
          new Date(currentTime).getTime() +
            (new Date(event.end).getTime() - new Date(event.start).getTime())
        )
      : new Date(event.end)
  }, [currentTime, event.start, event.end])

  // Calculate event duration in minutes
  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart)
  }, [displayStart, displayEnd])

  const getEventTime = () => {
    if (event.allDay) {
      return 'All day'
    }

    // For short events (less than 45 minutes), only show start time
    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart)
    }

    // For longer events, show both start and end time
    return `${formatTimeWithOptionalMinutes(
      displayStart
    )} - ${formatTimeWithOptionalMinutes(displayEnd)}`
  }

  if (view === 'month') {
    return (
      <EventWrapper
        className={cn(
          'mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-[13px]',
          className
        )}
        currentTime={currentTime}
        dndAttributes={dndAttributes}
        dndListeners={dndListeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children || (
          <span className="truncate">
            {!event.allDay && (
              <span className="truncate font-normal uppercase opacity-70 sm:text-xs">
                {formatTimeWithOptionalMinutes(displayStart)}{' '}
              </span>
            )}
            {event.title}
          </span>
        )}
      </EventWrapper>
    )
  }

  if (view === 'week' || view === 'day') {
    return (
      <EventWrapper
        className={cn(
          'py-1',
          durationMinutes < 45 ? 'items-center' : 'flex-col',
          view === 'week' ? 'text-[10px] sm:text-[13px]' : 'text-[13px]',
          className
        )}
        currentTime={currentTime}
        dndAttributes={dndAttributes}
        dndListeners={dndListeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {durationMinutes < 45 ? (
          <div className="truncate">
            {event.title}{' '}
            {showTime && (
              <span className="opacity-70">
                {formatTimeWithOptionalMinutes(displayStart)}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.title}</div>
            {showTime && (
              <div className="truncate font-normal uppercase opacity-70 sm:text-xs">
                {getEventTime()}
              </div>
            )}
          </>
        )}
      </EventWrapper>
    )
  }

  if (view === 'agenda') {
    return (
      <AgendaEventItem
        className={className}
        displayEnd={displayEnd}
        displayStart={displayStart}
        dndAttributes={dndAttributes}
        dndListeners={dndListeners}
        event={event}
        eventColor={eventColor}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      />
    )
  }

  return null
}
