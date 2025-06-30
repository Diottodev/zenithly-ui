import * as React from "react";

/**
 * Hook to manage the URL hash as reactive state.
 * @param defaultHash Default hash if it does not exist in the URL
 */
export function useHash(
  defaultHash: string = "#emails"
): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>
] {
  const [hash, setHash] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    let currentHash = window.location.hash || defaultHash;
    if (
      (window.location.pathname === "/" || window.location.pathname === "") &&
      !window.location.hash
    ) {
      window.location.hash = defaultHash;
      currentHash = defaultHash;
    }
    setHash(currentHash);
    const onHashChange = () => setHash(window.location.hash || defaultHash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [defaultHash]);
  return [hash, setHash] as const;
}
