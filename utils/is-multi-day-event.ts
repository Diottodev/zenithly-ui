import { TCalendarEvent } from "$/types/google-calendar";

/**
 * Determines if a calendar event spans multiple days.
 *
 * @param event - The calendar event to check.
 *   - `start`: The start date/time of the event (string or Date).
 *   - `end`: The end date/time of the event (string or Date).
 *   - `allDay`: Boolean indicating if the event is an all-day event.
 * @returns `true` if the event is an all-day event or if the start and end dates are on different days; otherwise, `false`.
 *
 * @remarks
 * This function considers an event as multi-day if:
 * - The event is marked as `allDay`, or
 * - The start and end dates fall on different calendar days.
 */
export function isMultiDayEvent(event: TCalendarEvent): boolean {
  // All-day event: uses 'date' instead of 'dateTime'
  if (event.start.date && event.end.date) {
    // Google Calendar: end.date is the day after the last day of the event
    const start = new Date(event.start.date);
    const end = new Date(event.end.date);
    // If the difference is greater than 1 day, it's multi-day
    return end.getTime() - start.getTime() > 24 * 60 * 60 * 1000;
  }
  // Timed event
  if (event.start.dateTime && event.end.dateTime) {
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    return (
      startDate.getFullYear() !== endDate.getFullYear() ||
      startDate.getMonth() !== endDate.getMonth() ||
      startDate.getDate() !== endDate.getDate()
    );
  }
  // If you don't have enough information, it's not multi-day
  return false;
}
