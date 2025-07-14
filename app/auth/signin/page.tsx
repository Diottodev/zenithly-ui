'use client';

import { SignInForm } from '$/components/sign-in-form';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <SignInForm />
      </div>
    </div>
  );
}
