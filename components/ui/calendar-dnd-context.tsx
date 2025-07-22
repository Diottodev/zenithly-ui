'use client'

import { type CalendarEvent, EventItem } from '$/components/ui'
import type { TCalendarEvent } from '$/types/google-calendar'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { addMinutes, differenceInMinutes } from 'date-fns'
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useRef,
  useState,
} from 'react'

// Define the context type
type CalendarDndContextType = {
  activeEvent: TCalendarEvent | null
  activeId: UniqueIdentifier | null
  activeView: 'month' | 'week' | 'day' | null
  currentTime: Date | null
  eventHeight: number | null
  isMultiDay: boolean
  multiDayWidth: number | null
  dragHandlePosition: {
    x?: number
    y?: number
    data?: {
      isFirstDay?: boolean
      isLastDay?: boolean
    }
  } | null
}

// Create the context
const CalendarDndContext = createContext<CalendarDndContextType>({
  activeEvent: null,
  activeId: null,
  activeView: null,
  currentTime: null,
  eventHeight: null,
  isMultiDay: false,
  multiDayWidth: null,
  dragHandlePosition: null,
})

// Hook to use the context
export const useCalendarDnd = () => useContext(CalendarDndContext)

// Props for the provider
interface CalendarDndProviderProps {
  children: ReactNode
  onEventUpdateAction: (event: TCalendarEvent) => void
}

export function CalendarDndProvider({
  children,
  onEventUpdateAction,
}: CalendarDndProviderProps) {
  const [activeEvent, setActiveEvent] = useState<TCalendarEvent | null>(null)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [activeView, setActiveView] = useState<'month' | 'week' | 'day' | null>(
    null
  )
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [eventHeight, setEventHeight] = useState<number | null>(null)
  const [isMultiDay, setIsMultiDay] = useState(false)
  const [multiDayWidth, setMultiDayWidth] = useState<number | null>(null)
  const [dragHandlePosition, setDragHandlePosition] = useState<{
    x?: number
    y?: number
    data?: {
      isFirstDay?: boolean
      isLastDay?: boolean
    }
  } | null>(null)

  // Store original event dimensions
  const eventDimensions = useRef<{ height: number }>({ height: 0 })

  // Configure sensors for better drag detection
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 5px before activating
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      // Require the pointer to move by 5px before activating
      activationConstraint: {
        distance: 5,
      },
    })
  )

  // Generate a stable ID for the DndContext
  const dndContextId = useId()

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    // Add safety check for data.current
    if (!active.data.current) {
      console.log('Missing data in drag start event', event)
      return
    }
    const {
      event: calendarEvent,
      view,
      height,
      isMultiDay: eventIsMultiDay,
      multiDayWidth: eventMultiDayWidth,
      dragHandlePosition: eventDragHandlePosition,
    } = active.data.current as {
      event: TCalendarEvent
      view: 'month' | 'week' | 'day'
      height?: number
      isMultiDay?: boolean
      multiDayWidth?: number
      dragHandlePosition?: {
        x?: number
        y?: number
        data?: {
          isFirstDay?: boolean
          isLastDay?: boolean
        }
      }
    }
    setActiveEvent(calendarEvent)
    setActiveId(active.id)
    setActiveView(view)
    setCurrentTime(new Date(calendarEvent.start.dateTime || calendarEvent.start.date || ''))
    setIsMultiDay(Boolean(eventIsMultiDay))
    setMultiDayWidth(eventMultiDayWidth || null)
    setDragHandlePosition(eventDragHandlePosition || null)
    // Store event height if provided
    if (height) {
      eventDimensions.current.height = height
      setEventHeight(height)
    }
  }

  function getNearestQuarterHourMinutes(fractionalHour: number): number {
    if (fractionalHour < 0.125) {
      return 0
    }
    if (fractionalHour < 0.375) {
      return 15
    }
    if (fractionalHour < 0.625) {
      return 30
    }
    return 45
  }

  function shouldUpdateTime(newTime: Date, prevTime: Date | null): boolean {
    if (!prevTime) {
      return true
    }
    return (
      newTime.getHours() !== prevTime.getHours() ||
      newTime.getMinutes() !== prevTime.getMinutes() ||
      newTime.getDate() !== prevTime.getDate() ||
      newTime.getMonth() !== prevTime.getMonth() ||
      newTime.getFullYear() !== prevTime.getFullYear()
    )
  }

  function shouldUpdateDate(newTime: Date, prevTime: Date | null): boolean {
    if (!prevTime) {
      return true
    }
    return (
      newTime.getDate() !== prevTime.getDate() ||
      newTime.getMonth() !== prevTime.getMonth() ||
      newTime.getFullYear() !== prevTime.getFullYear()
    )
  }

  function updateTimeForWeekOrDayView(
    date: Date,
    time: number,
    prevTime: Date | null
  ) {
    const newTime = new Date(date)
    const hours = Math.floor(time)
    const fractionalHour = time - hours
    const minutes = getNearestQuarterHourMinutes(fractionalHour)
    newTime.setHours(hours, minutes, 0, 0)
    if (shouldUpdateTime(newTime, prevTime)) {
      setCurrentTime(newTime)
    }
  }

  function updateTimeForMonthView(date: Date, prevTime: Date | null) {
    const newTime = new Date(date)
    if (prevTime) {
      newTime.setHours(
        prevTime.getHours(),
        prevTime.getMinutes(),
        prevTime.getSeconds(),
        prevTime.getMilliseconds()
      )
    }
    if (shouldUpdateDate(newTime, prevTime)) {
      setCurrentTime(newTime)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (!(over && activeEvent && over.data.current)) {
      return
    }
    const { date, time } = over.data.current as { date: Date; time?: number }
    if (time !== undefined && activeView !== 'month') {
      updateTimeForWeekOrDayView(date, time, currentTime)
    } else if (activeView === 'month') {
      updateTimeForMonthView(date, currentTime)
    }
  }

  function resetDragState() {
    setActiveEvent(null)
    setActiveId(null)
    setActiveView(null)
    setCurrentTime(null)
    setEventHeight(null)
    setIsMultiDay(false)
    setMultiDayWidth(null)
    setDragHandlePosition(null)
  }

  function getNewStartTime(
    date: Date,
    time: number | undefined,
    referenceTime: Date | null
  ): Date {
    const newStart = new Date(date)
    if (time !== undefined) {
      const hours = Math.floor(time)
      const fractionalHour = time - hours
      let minutes = 0
      if (fractionalHour < 0.125) {
        minutes = 0
      } else if (fractionalHour < 0.375) {
        minutes = 15
      } else if (fractionalHour < 0.625) {
        minutes = 30
      } else {
        minutes = 45
      }
      newStart.setHours(hours, minutes, 0, 0)
    } else if (referenceTime) {
      newStart.setHours(
        referenceTime.getHours(),
        referenceTime.getMinutes(),
        referenceTime.getSeconds(),
        referenceTime.getMilliseconds()
      )
    }
    return newStart
  }

  function hasStartTimeChanged(originalStart: Date, newStart: Date): boolean {
    return (
      originalStart.getFullYear() !== newStart.getFullYear() ||
      originalStart.getMonth() !== newStart.getMonth() ||
      originalStart.getDate() !== newStart.getDate() ||
      originalStart.getHours() !== newStart.getHours() ||
      originalStart.getMinutes() !== newStart.getMinutes()
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!(over && activeEvent && currentTime)) {
      resetDragState()
      return
    }

    try {
      if (!(active.data.current && over.data.current)) {
        throw new Error('Missing data in drag event')
      }

      const activeData = active.data.current as {
        event?: TCalendarEvent
        view?: string
      }
      const overData = over.data.current as { date?: Date; time?: number }

      if (!(activeData.event && overData.date)) {
        throw new Error('Missing required event data')
      }

      const calendarEvent = activeData.event
      const date = overData.date
      const time = overData.time

      const newStart = getNewStartTime(date, time, currentTime)

      const originalStart = new Date(calendarEvent.start.dateTime ?? calendarEvent.start.date ?? '')
      const originalEnd = new Date(calendarEvent.end.dateTime ?? calendarEvent.end.date ?? '')
      const durationMinutes = differenceInMinutes(originalEnd, originalStart)
      const newEnd = addMinutes(newStart, durationMinutes)

      if (hasStartTimeChanged(originalStart, newStart)) {
        onEventUpdateAction({
          ...calendarEvent,
          start: { dateTime: newStart.toISOString() },
          end: { dateTime: newEnd.toISOString() },
        })
      }
    } catch (error) {
      console.log('Error in drag end handler:', error)
    } finally {
      resetDragState()
    }
  }

  return (
    <DndContext
      id={dndContextId}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <CalendarDndContext.Provider
        value={{
          activeEvent,
          activeId,
          activeView,
          currentTime,
          eventHeight,
          isMultiDay,
          multiDayWidth,
          dragHandlePosition,
        }}
      >
        {children}
        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeEvent && activeView && (
            <div
              style={{
                height: eventHeight ? `${eventHeight}px` : 'auto',
                width:
                  isMultiDay && multiDayWidth ? `${multiDayWidth}%` : '100%',
                // Remove the transform that was causing the shift
              }}
            >
              <EventItem
                currentTime={currentTime || undefined}
                event={activeEvent}
                isDragging={true}
                isFirstDay={dragHandlePosition?.data?.isFirstDay !== false}
                isLastDay={dragHandlePosition?.data?.isLastDay !== false}
                showTime={activeView !== 'month'}
                view={activeView}
              />
            </div>
          )}
        </DragOverlay>
      </CalendarDndContext.Provider>
    </DndContext>
  )
}
