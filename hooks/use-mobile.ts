import React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom React hook that determines if the current viewport width is considered "mobile".
 *
 * Uses a media query to listen for changes in the viewport width and updates the state accordingly.
 * Returns a boolean indicating whether the viewport width is less than the `MOBILE_BREAKPOINT` value.
 *
 * @returns {boolean} `true` if the viewport width is less than the mobile breakpoint, otherwise `false`.
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Render mobile-specific UI
 * }
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
