"use client";

import { SignInForm } from "$/components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignInForm />
      </div>
    </div>
  );
}
