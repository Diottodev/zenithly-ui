import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<{
      role: string;
    }>(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  resetPassword,
  sendVerificationEmail,
  forgetPassword,
  changePassword,
  updateUser,
} = authClient;
