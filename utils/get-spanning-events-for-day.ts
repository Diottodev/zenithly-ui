import { TCalendarEvent } from "$/types/google-calendar";
import { isSameDay } from "date-fns";
import { isMultiDayEvent } from "./is-multi-day-event";

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
/**
 * Filters and returns calendar events that span across multiple days and include the specified day,
 * but are not starting on that day.
 *
 * @param events - An array of calendar events to filter.
 * @param day - The day to check for spanning events.
 * @returns An array of events that span the given day, excluding those that start on the given day.
 *
 * @remarks
 * - Only multi-day events are considered.
 * - An event is included if:
 *   - It does not start on the given day, and
 *   - It either ends on the given day or the given day falls between the event's start and end dates.
 *
 * @example
 * ```typescript
 * const spanningEvents = getSpanningEventsForDay(events, new Date('2024-06-10'));
 * ```
 */
export function getSpanningEventsForDay(
  events: TCalendarEvent[],
  day: Date
): TCalendarEvent[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false;
    const dateStart = String(event.start.dateTime || event.start.date);
    const dateEnd = String(event.end.dateTime || event.end.date);
    // Convert to Date objects
    const eventStart = new Date(dateStart);
    const eventEnd = new Date(dateEnd);
    // Only include if it's not the start day but is either the end day or a middle day
    return (
      !isSameDay(day, eventStart) &&
      (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
    );
  });
}
