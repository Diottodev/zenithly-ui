import { TCalendarEvent } from "$/types/google-calendar";
import { isSameDay } from "date-fns";

/**
 * Filters and sorts calendar events for a specific day.
 *
 * @param events - The array of calendar events to filter.
 * @param day - The date object representing the day to match events against.
 * @returns An array of `TCalendarEvent` objects that occur on the specified day,
 *          sorted by their start time in ascending order.
 *
 * @remarks
 * - The function checks if the event's start date or dateTime matches the provided day.
 * - Events are sorted chronologically by their start time.
 *
 * @example
 * ```typescript
 * const eventsForToday = getEventsForDay(events, new Date());
 * ```
 */
export function getEventsForDay(
  events: TCalendarEvent[],
  day: Date
): TCalendarEvent[] {
  return events
    .filter((event) => {
      const dateStart = String(event.start.dateTime || event.start.date);
      const eventStart = new Date(dateStart);
      return isSameDay(day, eventStart);
    })
    .sort((a, b) => {
      const dateStartA = String(a.start.dateTime || a.start.date);
      const dateStartB = String(b.start.dateTime || b.start.date);
      return new Date(dateStartA).getTime() - new Date(dateStartB).getTime();
    });
}
