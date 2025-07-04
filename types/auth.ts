type TUser = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
};

export type TAuthState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type TAuthActions = {
  setUser: (user: TUser | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export type TAuthFormType = "signin" | "signup";

export type TAuthFormState = {
  currentForm: TAuthFormType | undefined;
  setCurrentForm: (form: TAuthFormType) => void;
  toggleForm: () => void;
  initializeFromHash: () => "signin" | "signup" | undefined;
};

export type TAuthStore = TAuthState & TAuthActions;

export type TAuthFormProviderProps = {
  children: React.ReactNode;
};
