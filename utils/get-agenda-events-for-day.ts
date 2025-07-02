import { TCalendarEvent } from "$/types/google-calendar";
import { isSameDay } from "date-fns";

/**
 * Filters and sorts calendar events that occur on a specific day.
 *
 * This function returns all events from the provided list that either start, end,
 * or span across the given day. The resulting events are sorted by their start time in ascending order.
 *
 * @param events - An array of `CalendarEvent` objects to filter.
 * @param day - The `Date` object representing the day to check for events.
 * @returns An array of `CalendarEvent` objects that occur on the specified day, sorted by start time.
 *
 * @remarks
 * - An event is considered to occur on the given day if:
 *   - The event starts on the day,
 *   - The event ends on the day,
 *   - The day falls between the event's start and end times.
 *
 * @example
 * ```typescript
 * const events = [
 *   { start: { dateTime: '2024-06-01T09:00:00', timeZone: 'America/Sao_Paulo' }, end: { dateTime: '2024-06-01T10:00:00', timeZone: 'America/Sao_Paulo' } },
 *   { start: { dateTime: '2025-04-21T18:00:00', timeZone: 'America/Sao_Paulo' }, end: { dateTime: '2025-04-21T20:00:00', timeZone: 'America/Sao_Paulo' } }
 * ];
 * const day = new Date('2024-06-01');
 * const result = getAgendaEventsForDay(events, day);
 * // result contains both events
 * ```
 */
export function getAgendaEventsForDay(
  events: TCalendarEvent[],
  day: Date
): TCalendarEvent[] {
  return events
    .filter((event) => {
      const dateStart = String(event.start.dateTime || event.start.date);
      const dateEnd = String(event.end.dateTime || event.end.date);
      const eventStart = new Date(dateStart);
      const eventEnd = new Date(dateEnd);
      return (
        isSameDay(day, eventStart) ||
        isSameDay(day, eventEnd) ||
        (day > eventStart && day < eventEnd)
      );
    })
    .sort((a, b) => {
      const dateA = String(a.start.dateTime || a.start.date);
      const dateB = String(b.start.dateTime || b.start.date);
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
}
