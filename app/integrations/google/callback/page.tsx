"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function GoogleIntegrationCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const userId = state?.replace("user_", "");
    if (!code || !userId) {
      toast.error("Dados de autenticação inválidos");
      router.push("/dashboard");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/integrations/google/callback/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          toast.error(err.error || "Erro ao conectar Google");
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        localStorage.setItem("google_token", data.accessToken);
        toast.success(data.message || "Google conectado com sucesso!");
        router.push("/dashboard");
      })
      .catch(() => {
        toast.error("Erro ao conectar Google");
        router.push("/dashboard");
      })
      .finally(() => setIsProcessing(false));
  }, [searchParams, router]);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Processando integração Google...</h2>
        {isProcessing ? (
          <p className="text-muted-foreground">Aguarde, estamos conectando sua conta Google.</p>
        ) : (
          <p className="text-muted-foreground">Redirecionando...</p>
        )}
      </div>
    </div>
  );
}
