import React from "react";
import { useTabStore } from "./tab-context";

/**
 * Hook to access and set the current tab using Zustand only.
 * Synchronizes the Zustand store with the URL query string.
 *
 * @returns {[string, (tab: string) => void]} - Current tab and function to change the tab.
 * @param {string} [defaultTab="emails"] - The default tab to use if no tab is set in the URL.
 *
 * @example
 * const [tab, setTab] = useTab();
 * setTab('settings');
 */
export function useTab(
  defaultTab: string = "emails"
): [string, (tab: string) => void] {
  const { tab, setTab } = useTabStore();
  // Get the current tab from the URL or use the default
  const getCurrentTab = React.useCallback(() => {
    if (typeof window === "undefined") return defaultTab;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("tab") || defaultTab;
  }, [defaultTab]);
  // Synchronize Zustand with the URL and vice versa
  React.useEffect(() => {
    const currentTab = getCurrentTab();
    setTab(currentTab);
    const onPopState = () => setTab(getCurrentTab());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentTab]);
  /**
   * Updates the URL when changing the tab and updates Zustand.
   * @param {string} newTab - The new tab to set.
   */
  const setTabAndUrl = React.useCallback(
    (newTab: string) => {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      url.searchParams.set("tab", newTab);
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
      setTab(newTab);
    },
    [setTab]
  );
  return [tab, setTabAndUrl];
}
