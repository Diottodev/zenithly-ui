/**
 * Returns the appropriate Tailwind CSS classes for border radius styling
 * based on whether the current day is the first or last in a range.
 *
 * - If both `isFirstDay` and `isLastDay` are true, applies fully rounded corners.
 * - If only `isFirstDay` is true, applies rounded corners to the left side only.
 * - If only `isLastDay` is true, applies rounded corners to the right side only.
 * - If neither is true, applies no rounded corners.
 *
 * Additional utility classes are conditionally applied for elements not in a popover context,
 * adjusting width and horizontal translation for visual alignment.
 *
 * @param isFirstDay - Indicates if the current day is the first in the range.
 * @param isLastDay - Indicates if the current day is the last in the range.
 * @returns A string of Tailwind CSS classes for border radius and layout adjustments.
 */
export function getBorderRadiusClasses(
  isFirstDay: boolean,
  isLastDay: boolean
): string {
  if (isFirstDay && isLastDay) {
    return "rounded"; // Both ends rounded
  } else if (isFirstDay) {
    return "rounded-l rounded-r-none not-in-data-[slot=popover-content]:w-[calc(100%+5px)]"; // Only left end rounded
  } else if (isLastDay) {
    return "rounded-r rounded-l-none not-in-data-[slot=popover-content]:w-[calc(100%+4px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"; // Only right end rounded
  } else {
    return "rounded-none not-in-data-[slot=popover-content]:w-[calc(100%+9px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"; // No rounded corners
  }
}
