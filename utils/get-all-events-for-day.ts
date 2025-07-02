import { TCalendarEvent } from "$/types/google-calendar";
import { isSameDay } from "date-fns";

/**
 * Filters and returns all calendar events that occur on a specific day.
 *
 * An event is considered to occur on the given day if:
 * - The event starts on the day,
 * - The event ends on the day, or
 * - The day falls between the event's start and end times.
 *
 * @param events - Array of calendar events to filter.
 * @param day - The day to check for events (time is ignored).
 * @returns An array of events that occur on the specified day.
 *
 * @remarks
 * This function assumes that each event has `start.dateTime` and `end.dateTime` properties
 * that are valid date strings or Date objects.
 *
 * @example
 * ```typescript
 * const events = [
 *   { start: { dateTime: '2024-06-10T09:00:00Z' }, end: { dateTime: '2024-06-10T10:00:00Z' } },
 *   { start: { dateTime: '2024-06-09T23:00:00Z' }, end: { dateTime: '2024-06-10T01:00:00Z' } }
 * ];
 * const day = new Date('2024-06-10');
 * const result = getAllEventsForDay(events, day);
 * // result contains both events
 * ```
 */
export function getAllEventsForDay(
  events: TCalendarEvent[],
  day: Date
): TCalendarEvent[] {
  return events.filter((event) => {
    const dateStart = String(event.start.dateTime || event.start.date);
    const dateEnd = String(event.end.dateTime || event.end.date);
    const eventStart = new Date(dateStart);
    const eventEnd = new Date(dateEnd);
    return (
      isSameDay(day, eventStart) ||
      isSameDay(day, eventEnd) ||
      (day > eventStart && day < eventEnd)
    );
  });
}
