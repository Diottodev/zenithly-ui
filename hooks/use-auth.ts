import { useAuthStore } from "$/stores/auth-store";
import type { TAuthStore } from "$/types/auth";

/**
 * Hook to access authentication state and actions
 *
 * @returns {TAuthStore} Authentication state and actions
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated, setUser, reset } = useAuth();
 *
 * // Check if user is authenticated
 * if (isAuthenticated) {
 * console.log('User logged in:', user.name);
 * }
 *
 * ```
 */
export const useAuth = (): TAuthStore => {
  return useAuthStore();
};
