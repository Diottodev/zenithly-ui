import { useQuery } from "@tanstack/react-query";

export type TAuthUser = {
	name: string;
	email: string;
	emailVerified: boolean;
	image: string;
	createdAt: string;
	updatedAt: string;
	id: string;
}
export type TAuthSession = {
	expiresAt: string;
	token: string;
	createdAt: string;
	updatedAt: string;
	ipAddress: string;
	userAgent: string;
	userId: string;
	id: string;
}
export type TAuthApiResponse = {
	user: TAuthUser;
	session: TAuthSession;
}
type TAuthState = {
	session: TAuthApiResponse | null;
	isPending: boolean;
	error: string | null;
}

/**
 * Hook to access authentication state and actions
 *
 * @returns Authentication state and actions
 *
 * @example
 * ```typescript
 * const { session, isPending, error } = useAuth();
 *
 * // Check if user is authenticated
 * if (session?.user) {
 *   console.log('User logged in:', session.user.name);
 * }
 * ```
 */
export const useAuth = (): TAuthState => {
	const fetchSession = async (): Promise<TAuthApiResponse> => {
		if (typeof window === "undefined") {
			throw new Error("Not in browser environment");
		}
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth/session`,
			{
				method: "GET",
				credentials: "include",
			},
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	};
	const {
		data: session,
		isPending,
		error,
	} = useQuery<TAuthApiResponse>({
		queryKey: ["auth-session"],
		queryFn: fetchSession,
		retry: 3,
		refetchInterval: false,
	});
	let errorMessage: string | null = null;
	if (error) {
		if (error instanceof Error) {
			errorMessage = error.message;
		} else {
			errorMessage = String(error);
		}
	}
	return {
		session: session!,
		isPending,
		error: errorMessage,
	};
};


/**
 * Custom hook that provides authentication session information.
 *
 * @returns An object containing the authenticated user, loading state, and any authentication error.
 * @property {User} user - The currently authenticated user.
 * @property {boolean} isPending - Indicates if the authentication request is in progress.
 * @property {Error | null} error - Any error encountered during authentication.
 */
export const useSession = () => {
	const { session, isPending, error } = useAuth();
	return {
		user: session?.user,
		isPending,
		error,
	};
}