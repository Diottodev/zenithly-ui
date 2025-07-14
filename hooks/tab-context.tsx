'use client'

import { create } from 'zustand'

/**
 * Zustand store for global tab state management.
 * Allows access and modification of the tab from anywhere in the app.
 */
interface TTabState {
  tab: string
  setTab: (tab: string) => void
}

/**
 * Creates the Zustand store for the tab.
 * The initial value is "emails" by default.
 */
export const useTabStore = create<TTabState>((set) => ({
  tab: 'emails',
  setTab: (tab: string) => set({ tab }),
}))
