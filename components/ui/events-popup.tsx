'use client'

import { type CalendarEvent, EventItem } from '$/components/ui'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { XIcon } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

interface EventsPopupProps {
  date: Date
  events: CalendarEvent[]
  position: { top: number; left: number }
  onCloseAction: () => void
  onEventSelectAction: (event: CalendarEvent) => void
}

export function EventsPopup({
  date,
  events,
  position,
  onCloseAction,
  onEventSelectAction,
}: EventsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onCloseAction()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onCloseAction])

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseAction()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [onCloseAction])

  const handleEventClick = (event: CalendarEvent) => {
    onEventSelectAction(event)
    onCloseAction()
  }

  // Adjust position to ensure popup stays within viewport
  const adjustedPosition = useMemo(() => {
    const positionCopy = { ...position }

    // Check if we need to adjust the position to fit in the viewport
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Adjust horizontally if needed
      if (positionCopy.left + rect.width > viewportWidth) {
        positionCopy.left = Math.max(0, viewportWidth - rect.width)
      }

      // Adjust vertically if needed
      if (positionCopy.top + rect.height > viewportHeight) {
        positionCopy.top = Math.max(0, viewportHeight - rect.height)
      }
    }

    return positionCopy
  }, [position])

  return (
    <div
      className="absolute z-50 max-h-96 w-80 overflow-auto rounded-md border bg-background shadow-lg"
      ref={popupRef}
      style={{
        top: `${adjustedPosition.top}px`,
        left: `${adjustedPosition.left}px`,
      }}
    >
      <div className="sticky top-0 flex items-center justify-between border-b bg-background p-3">
        <h3 className="font-medium">
          {format(date, 'dd MMMM yyyy', { locale: ptBR })}
        </h3>
        <button
          aria-label="Close"
          className="rounded-full p-1 hover:bg-muted"
          onClick={onCloseAction}
          type="button"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 p-3">
        {events.length === 0 ? (
          <div className="py-2 text-muted-foreground text-sm">No events</div>
        ) : (
          events.map((event) => {
            const eventStart = new Date(event.start)
            const eventEnd = new Date(event.end)
            const isFirstDay = isSameDay(date, eventStart)
            const isLastDay = isSameDay(date, eventEnd)

            return (
              <button
                className="w-full cursor-pointer text-left"
                key={event.id}
                onClick={() => handleEventClick(event)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleEventClick(event)
                  }
                }}
                type="button"
              >
                <EventItem
                  event={event}
                  isFirstDay={isFirstDay}
                  isLastDay={isLastDay}
                  view="agenda"
                />
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
