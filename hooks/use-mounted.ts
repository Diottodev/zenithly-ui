import React from "react";

/**
 * Custom React hook that determines if the component has been mounted.
 * This hook sets a state variable to `true` once the component mounts,
 * @returns {boolean | undefined} - Returns `true` once the component is mounted, otherwise `undefined` on initial render.
 */
export function useMounted(): boolean | undefined {
  const [mounted, setMounted] = React.useState<boolean | undefined>(undefined);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
