"use client";

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
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCalendarContext } from "./calendar-context";

import {
  AgendaDaysToShow,
  AgendaView,
  CalendarDndProvider,
  CalendarEvent,
  CalendarView,
  DayView,
  EventDialog,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
} from "$/components/ui";
import { Button } from "$/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "$/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "$/components/ui/sidebar";
import { cn } from "$/lib/utils";
import { TCalendarEvent } from "$/types/google-calendar";
import { addHoursToDate } from "$/utils/add-hours-to-date";

// Utility functions to convert between TCalendarEvent and CalendarEvent
const convertTCalendarEventToCalendarEvent = (
  event: TCalendarEvent
): CalendarEvent => {
  console.log(event._color, "COLLORR"); // Debug log
  // Ensure _color is always defined

  const dateStart = String(event.start.dateTime || event.start.date);
  const dateEnd = String(event.end.dateTime || event.end.date);
  return {
    id: event.id,
    title: event.summary || "Sem título",
    description: event.description,
    start: new Date(dateStart),
    end: new Date(dateEnd),
    allDay: false, // Google Calendar events with dateTime are not all-day
    location: event.location,
    // Default color since TCalendarEvent doesn't have color
    _color: event._color as { background: string; foreground: string }, // Ensure color is always defined
  };
};

const convertCalendarEventToTCalendarEvent = (
  event: CalendarEvent
): TCalendarEvent => {
  const now = new Date().toISOString();
  return {
    id: event.id,
    kind: "calendar#event",
    status: "confirmed",
    htmlLink: "",
    summary: event.title,
    description: event.description,
    location: event.location,
    start: {
      dateTime: event.start.toISOString(),
    },
    end: {
      dateTime: event.end.toISOString(),
    },
    created: now,
    updated: now,
    creator: {
      email: "",
      displayName: "User",
      self: true,
    },
    organizer: {
      email: "",
      displayName: "User",
      self: true,
    },
  };
};

export interface EventCalendarProps {
  events?: TCalendarEvent[];
  onEventAdd?: (event: TCalendarEvent) => void;
  onEventUpdate?: (event: TCalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
}

export function EventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "month",
}: EventCalendarProps) {
  // Convert TCalendarEvent[] to CalendarEvent[] for internal use
  const internalEvents = events.map(convertTCalendarEventToCalendarEvent);

  // Use the shared calendar context instead of local state
  const { currentDate, setCurrentDate } = useCalendarContext();
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const { open } = useSidebar();

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
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "w":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      // For agenda view, go back 30 days (a full month)
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      // For agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: CalendarEvent) => {
    console.log("Event selected:", event); // Debug log
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleEventCreate = (startTime: Date) => {
    console.log("Creating new event at:", startTime); // Debug log
    // Snap to 15-minute intervals
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        // Round down to nearest 15 min
        startTime.setMinutes(minutes - remainder);
      } else {
        // Round up to nearest 15 min
        startTime.setMinutes(minutes + (15 - remainder));
      }
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: startTime,
      end: addHoursToDate(startTime, 1),
      allDay: false,
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const handleEventSave = (event: CalendarEvent) => {
    if (event.id) {
      onEventUpdate?.(convertCalendarEventToTCalendarEvent(event));
      // Show toast notification when an event is updated
      toast(`Evento "${event.title}" atualizado`, {
        description: format(new Date(event.start), "dd/MM/yyyy", {
          locale: ptBR,
        }),
        position: "bottom-left",
      });
    } else {
      const newCalendarEvent = {
        ...event,
        id: Math.random().toString(36).substring(2, 11),
      };
      onEventAdd?.(convertCalendarEventToTCalendarEvent(newCalendarEvent));
      // Show toast notification when an event is added
      toast(`Evento "${event.title}" adicionado`, {
        description: format(new Date(event.start), "dd/MM/yyyy", {
          locale: ptBR,
        }),
        position: "bottom-left",
      });
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId);
    onEventDelete?.(eventId);
    setIsEventDialogOpen(false);
    setSelectedEvent(null);

    // Show toast notification when an event is deleted
    if (deletedEvent) {
      toast(`Evento "${deletedEvent.summary || "Sem título"}" excluído`, {
        description: format(
          new Date(
            String(deletedEvent.start.dateTime || deletedEvent.start.date)
          ),
          "dd/MM/yyyy",
          {
            locale: ptBR,
          }
        ),
        position: "bottom-left",
      });
    }
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(convertCalendarEventToTCalendarEvent(updatedEvent));
    // Show toast notification when an event is updated via drag and drop
    toast(`Evento "${updatedEvent.title}" movido`, {
      description: format(new Date(updatedEvent.start), "dd/MM/yyyy", {
        locale: ptBR,
      }),
      position: "bottom-left",
    });
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: ptBR });
      } else {
        return `${format(start, "MMM")} - ${format(end, "MMM yyyy", {
          locale: ptBR,
        })}`;
      }
    } else if (view === "day") {
      return (
        <>
          <span className="min-sm:hidden" aria-hidden="true">
            {format(currentDate, "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <span className="max-sm:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </>
      );
    } else if (view === "agenda") {
      // Show the month range for agenda view
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: ptBR });
      } else {
        return `${format(start, "MMM")} - ${format(end, "MMM yyyy", {
          locale: ptBR,
        })}`;
      }
    } else {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    }
  }, [currentDate, view]);

  return (
    <div
      className="flex has-data-[slot=month-view]:flex-1 flex-col rounded-lg"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdateAction={handleEventUpdate}>
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-5 sm:px-4",
            className
          )}
        >
          <div className="flex sm:flex-col max-sm:items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <SidebarTrigger
                data-state={open ? "invisible" : "visible"}
                className="peer size-7 text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent! sm:-ms-1.5 lg:data-[state=invisible]:opacity-0 lg:data-[state=invisible]:pointer-events-none transition-opacity ease-in-out duration-200"
              />
              <h2 className="font-semibold text-xl lg:peer-data-[state=invisible]:-translate-x-7.5 transition-transform ease-in-out duration-300">
                {viewTitle.toString().toLowerCase()}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center sm:gap-2 max-sm:order-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="max-sm:size-8"
                  onClick={handlePrevious}
                  aria-label="Previous"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="max-sm:size-8"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
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
                variant="outline"
                className="max-sm:h-8 max-sm:px-2.5!"
                onClick={() => {
                  setSelectedEvent(null); // Ensure we're creating a new event
                  setIsEventDialogOpen(true);
                }}
              >
                Novo evento
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1.5 max-sm:h-8 max-sm:px-2! max-sm:gap-1"
                  >
                    <span className="capitalize">
                      {view === "month"
                        ? "Mês"
                        : view === "week"
                        ? "Semana"
                        : view === "day"
                        ? "Dia"
                        : "Agenda"}
                    </span>
                    <ChevronDownIcon
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-32">
                  <DropdownMenuItem onClick={() => setView("month")}>
                    Mês <DropdownMenuShortcut>M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("week")}>
                    Semana <DropdownMenuShortcut>W</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("day")}>
                    Dia <DropdownMenuShortcut>D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("agenda")}>
                    Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={internalEvents}
              onEventSelectAction={handleEventSelect}
              onEventCreateAction={handleEventCreate}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={internalEvents}
              onEventSelectAction={handleEventSelect}
              onEventCreateAction={handleEventCreate}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={internalEvents}
              onEventSelectAction={handleEventSelect}
              onEventCreateAction={handleEventCreate}
            />
          )}
          {view === "agenda" && (
            <AgendaView
              currentDate={currentDate}
              events={internalEvents}
              onEventSelectAction={handleEventSelect}
            />
          )}
        </div>

        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onCloseAction={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
          onSaveAction={handleEventSave}
          onDeleteAction={handleEventDelete}
        />
      </CalendarDndProvider>
    </div>
  );
}
