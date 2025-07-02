import { TCalendarEvent } from "$/types/google-calendar";
import { isMultiDayEvent } from "./is-multi-day-event";

/**
 * Sorts an array of calendar events, prioritizing multi-day events before single-day events.
 *
 * Multi-day events are placed at the top of the list. Within each group (multi-day or single-day),
 * events are sorted by their start date in ascending order.
 *
 * @param events - The array of `TCalendarEvent` objects to sort.
 * @returns A new array of `TCalendarEvent` objects, sorted by multi-day status and start date.
 *
 * @remarks
 * - This function does not mutate the original array; it returns a sorted copy.
 * - The function relies on the helper `isMultiDayEvent` to determine if an event spans multiple days.
 *
 * @example
 * ```typescript
 * const sorted = sortEvents(events);
 * ```
 */
export function sortEvents(events: TCalendarEvent[]): TCalendarEvent[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a);
    const bIsMultiDay = isMultiDayEvent(b);
    if (aIsMultiDay && !bIsMultiDay) return -1;
    if (!aIsMultiDay && bIsMultiDay) return 1;
    const dateStartA = String(a.start.dateTime || a.start.date);
    const dateStartB = String(b.start.dateTime || b.start.date);
    const aStart = new Date(dateStartA);
    const bStart = new Date(dateStartB);
    return aStart.getTime() - bStart.getTime();
  });
}
