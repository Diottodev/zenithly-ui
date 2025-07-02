/**
 * Adds a specified number of hours to a given date and returns a new Date instance.
 *
 * @param date - The original Date object to which hours will be added.
 * @param hours - The number of hours to add to the date.
 * @returns A new Date object with the added hours.
 *
 * @remarks
 * This function does not mutate the original date; it returns a new Date instance.
 *
 * @example
 * ```typescript
 * const now = new Date();
 * const later = addHoursToDate(now, 5);
 * ```
 */
export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}
