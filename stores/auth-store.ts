import { TAuthStore } from "$/types/auth";
import { create } from "zustand";

/**
 * Store Zustand to manage authentication state
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated, setUser } = useAuthStore();
 * ```
 */
export const useAuthStore = create<TAuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    }),
}));
