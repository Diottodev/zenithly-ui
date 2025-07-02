/**
 * Returns a string of CSS classes for event color styling.
 *
 * If a color object with `background` and `foreground` properties is provided,
 * it generates Tailwind utility classes for background and text color using those values.
 * Otherwise, it returns a default set of classes for event appearance, including
 * hover and dark mode variants.
 *
 * @param _color - Optional object containing `background` and `foreground` color strings.
 * @returns A string of CSS classes for styling the event.
 *
 * @example
 * // With custom colors
 * getEventColorClasses({ background: "#ff0000", foreground: "#ffffff" });
 * // => "!bg-[#ff0000] !text-[#ffffff]"
 *
 * @example
 * // With no color provided
 * getEventColorClasses();
 * // => "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/8"
 */
export function getEventColorClasses(_color?: {
  background: string;
  foreground: string;
}): string[] {
  if (_color && _color.background && _color.foreground) {
    return [_color.background, _color.foreground];
  }
  return ["bg-blue-200/50", "text-blue-900/90"];
}
