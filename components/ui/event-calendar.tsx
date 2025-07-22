'use client'

import {
  AgendaDaysToShow,
  AgendaView,
  CalendarDndProvider,
  type CalendarEvent,
  type CalendarView,
  DayView,
  EventDialog,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
} from '$/components/ui'
import { Button } from '$/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '$/components/ui/dropdown-menu'
import { SidebarTrigger, useSidebar } from '$/components/ui/sidebar'
import { cn } from '$/lib/utils'
import type { TCalendarEvent } from '$/types/google-calendar'
import { addHoursToDate } from '$/utils/add-hours-to-date'
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'



export interface EventCalendarProps {
  events?: TCalendarEvent[]
  onEventAdd?: (event: TCalendarEvent) => void
  onEventUpdate?: (event: TCalendarEvent) => void
  onEventDelete?: (eventId: string) => void
  className?: string
  initialView?: CalendarView
}

export function EventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = 'month',
}: EventCalendarProps) {
  const internalEvents = events
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>(initialView)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<TCalendarEvent | null>(null)
  const { open } = useSidebar()
  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }
      switch (e.key.toLowerCase()) {
        case 'm':
          setView('month')
          break
        case 'w':
          setView('week')
          break
        case 'd':
          setView('day')
          break
        case 'a':
          setView('agenda')
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEventDialogOpen])

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1))
    } else if (view === 'agenda') {
      // For agenda view, go back 30 days (a full month)
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow))
    }
  }

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1))
    } else if (view === 'agenda') {
      // For agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AgendaDaysToShow))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleEventSelect = (event: TCalendarEvent) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const handleEventCreate = (startTime: Date) => {
    // Snap to 15-minute intervals
    const minutes = startTime.getMinutes()
    const remainder = minutes % 15
    if (remainder !== 0) {
      if (remainder < 7.5) {
        // Round down to nearest 15 min
        startTime.setMinutes(minutes - remainder)
      } else {
        // Round up to nearest 15 min
        startTime.setMinutes(minutes + (15 - remainder))
      }
      startTime.setSeconds(0)
      startTime.setMilliseconds(0)
    }

    const newEvent: TCalendarEvent = {
      id: '',
      summary: '',
      start: {
        dateTime: startTime.toISOString(),
        date: startTime.toISOString().split('T')[0],
      },
      end: {
        dateTime: addHoursToDate(startTime, 1).toISOString(),
        date: addHoursToDate(startTime, 1).toISOString().split('T')[0],
      },
      kind: '',
      status: '',
      htmlLink: '',
      created: '',
      updated: '',
      creator: {
        email: '',
        displayName: undefined,
        self: undefined
      },
      organizer: {
        email: '',
        displayName: undefined,
        self: undefined
      }
    }
    setSelectedEvent(newEvent)
    setIsEventDialogOpen(true)
  }

  const handleEventSave = (event: TCalendarEvent) => {
    if (event.id) {
      onEventUpdate?.(event)
      // Show toast notification when an event is updated
      toast(`Evento "${event.summary}" atualizado`, {
        description: format(
          new Date(event.start.dateTime ?? event.start.date ?? ''),
          'dd/MM/yyyy',
          {
            locale: ptBR,
          }
        ),
        position: 'bottom-left',
      })
    } else {
      const newCalendarEvent = {
        ...event,
        id: Math.random().toString(36).substring(2, 11),
      }
      onEventAdd?.(event)
      // Show toast notification when an event is added
      toast(`Evento "${event.summary}" adicionado`, {
        description: format(new Date(event.start.dateTime ?? event.start.date ?? ''), 'dd/MM/yyyy', {
          locale: ptBR,
        }),
        position: 'bottom-left',
      })
    }
    setIsEventDialogOpen(false)
    setSelectedEvent(null)
  }

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId)
    onEventDelete?.(eventId)
    setIsEventDialogOpen(false)
    setSelectedEvent(null)

    // Show toast notification when an event is deleted
    if (deletedEvent) {
      toast(`Evento "${deletedEvent.summary || 'Sem título'}" excluído`, {
        description: format(
          new Date(
            String(deletedEvent.start.dateTime || deletedEvent.start.date)
          ),
          'dd/MM/yyyy',
          {
            locale: ptBR,
          }
        ),
        position: 'bottom-left',
      })
    }
  }

  const handleEventUpdate = (updatedEvent: TCalendarEvent) => {
    onEventUpdate?.(updatedEvent)
    // Show toast notification when an event is updated via drag and drop
    toast(`Evento "${updatedEvent.summary}" movido`, {
      description: format(new Date(updatedEvent.start.dateTime ?? updatedEvent.start.date ?? ''), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
      position: 'bottom-left',
    })
  }

  const viewTitle = useMemo(() => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: ptBR })
    }
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 })
      const end = endOfWeek(currentDate, { weekStartsOn: 0 })
      if (isSameMonth(start, end)) {
        return format(start, 'MMMM yyyy', { locale: ptBR })
      }
      return `${format(start, 'MMM')} - ${format(end, 'MMM yyyy', {
        locale: ptBR,
      })}`
    }
    if (view === 'day') {
      return (
        <>
          <span aria-hidden="true" className="min-sm:hidden">
            {format(currentDate, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
          <span aria-hidden="true" className="max-sm:hidden min-md:hidden">
            {format(currentDate, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </>
      )
    }
    if (view === 'agenda') {
      // Show the month range for agenda view
      const start = currentDate
      const end = addDays(currentDate, AgendaDaysToShow - 1)
      if (isSameMonth(start, end)) {
        return format(start, 'MMMM yyyy', { locale: ptBR })
      }
      return `${format(start, 'MMM')} - ${format(end, 'MMM yyyy', {
        locale: ptBR,
      })}`
    }
    return format(currentDate, 'MMMM yyyy', { locale: ptBR })
  }, [currentDate, view])

  return (
    <div
      className="flex flex-col rounded-lg has-data-[slot=month-view]:flex-1"
      style={
        {
          '--event-height': `${EventHeight}px`,
          '--event-gap': `${EventGap}px`,
          '--week-cells-height': `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdateAction={handleEventUpdate}>
        <div
          className={cn(
            'flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-center sm:px-4',
            className
          )}
        >
          <div className="flex justify-between gap-1.5 max-sm:items-center sm:flex-col">
            <div className="flex items-center gap-1.5">
              <SidebarTrigger
                className="peer sm:-ms-1.5 size-7 text-muted-foreground/80 transition-opacity duration-200 ease-in-out hover:bg-transparent! hover:text-foreground/80 lg:data-[state=invisible]:pointer-events-none lg:data-[state=invisible]:opacity-0"
                data-state={open ? 'invisible' : 'visible'}
              />
              <h2 className="lg:peer-data-[state=invisible]:-translate-x-7.5 font-semibold text-xl transition-transform duration-300 ease-in-out">
                {view === 'day' ? viewTitle : viewTitle.toString().toLowerCase()}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center max-sm:order-1 sm:gap-2">
                <Button
                  aria-label="Previous"
                  className="max-sm:size-8"
                  onClick={handlePrevious}
                  size="icon"
                  variant="ghost"
                >
                  <ChevronLeftIcon aria-hidden="true" size={16} />
                </Button>
                <Button
                  aria-label="Next"
                  className="max-sm:size-8"
                  onClick={handleNext}
                  size="icon"
                  variant="ghost"
                >
                  <ChevronRightIcon aria-hidden="true" size={16} />
                </Button>
              </div>
              <Button
                className="max-sm:h-8 max-sm:px-2.5!"
                onClick={handleToday}
              >
                Hoje
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button
                className="max-sm:h-8 max-sm:px-2.5!"
                onClick={() => {
                  setSelectedEvent(null) // Ensure we're creating a new event
                  setIsEventDialogOpen(true)
                }}
                variant="outline"
              >
                Novo evento
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="gap-1.5 max-sm:h-8 max-sm:gap-1 max-sm:px-2!"
                    variant="outline"
                  >
                    <span className="capitalize">
                      {
                        {
                          month: 'Mês',
                          week: 'Semana',
                          day: 'Dia',
                          agenda: 'Agenda',
                        }[view]
                      }
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-me-1 opacity-60"
                      size={16}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-32">
                  <DropdownMenuItem onClick={() => setView('month')}>
                    Mês <DropdownMenuShortcut>M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('week')}>
                    Semana <DropdownMenuShortcut>W</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('day')}>
                    Dia <DropdownMenuShortcut>D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('agenda')}>
                    Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={internalEvents}
            onEventCreateAction={handleEventCreate}
            onEventSelectAction={handleEventSelect}
          />
        )}
        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            events={internalEvents}
            onEventCreateAction={handleEventCreate}
            onEventSelectAction={handleEventSelect}
          />
        )}
        {view === 'day' && (
          <DayView
            currentDate={currentDate}
            events={internalEvents}
            onEventCreateAction={handleEventCreate}
            onEventSelectAction={handleEventSelect}
          />
        )}
        {view === 'agenda' && (
          <AgendaView
            currentDate={currentDate}
            events={internalEvents}
            onEventSelectAction={handleEventSelect}
          />
        )}
        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onCloseAction={() => {
            setIsEventDialogOpen(false)
            setSelectedEvent(null)
          }}
          onDeleteAction={handleEventDelete}
          onSaveAction={handleEventSave}
        />
      </CalendarDndProvider>
    </div>
  )
}
