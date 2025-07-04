"use client";

import { AuthLoadingScreen } from "$/components/auth-loading";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <AuthLoadingScreen />
        <p className="text-sm text-muted-foreground">Finalizando login...</p>
      </div>
    </div>
  );
}
