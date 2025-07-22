'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";

interface IntegrationSelectorProps {
  userId: string;
}

interface IntegrationStatus {
  googleCalendar: {
    enabled: boolean;
    connected: boolean;
    tokenExpires?: string;
  };
  gmail: {
    enabled: boolean;
    connected: boolean;
    tokenExpires?: string;
  };
  outlook: {
    enabled: boolean;
    connected: boolean;
    tokenExpires?: string;
  };
  settings?: unknown;
}


export function IntegrationSelector({ userId }: IntegrationSelectorProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const token = localStorage.getItem('google_token') || '';
  const {
    data: status,
    isLoading,
    isError,
    error,
  } = useQuery<IntegrationStatus>({
    queryKey: ["integration-status", userId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/integrations/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
  const connectMutation = useMutation({
    mutationFn: async (provider: "google" | "microsoft") => {
      setLoadingProvider(provider);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/integrations/${provider}/auth-url`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    },
    onSettled: () => setLoadingProvider(null),
  });
  console.log("IntegrationSelector status:", status, isError, error);

  return (
    <Card className="max-w-md mx-auto mt-8 p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Conectar integrações</h2>
      {isLoading ? (
        <Skeleton className="h-10 w-full mb-2" />
      ) : isError ? (
        <Badge variant="destructive">Erro ao carregar status</Badge>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => connectMutation.mutate("google")}
            disabled={loadingProvider === "google" || status?.googleCalendar?.connected}
            aria-label="Conectar Google"
            type="button"
            className={status?.googleCalendar?.connected ? "opacity-60" : ""}
          >
            {status?.googleCalendar?.connected
              ? "Google conectado"
              : loadingProvider === "google"
                ? "Conectando..."
                : "Conectar Google"}
          </Button>
          <Button
            onClick={() => connectMutation.mutate("microsoft")}
            disabled={loadingProvider === "microsoft" || status?.outlook?.connected}
            aria-label="Conectar Microsoft"
            type="button"
            className={status?.outlook?.connected ? "opacity-60" : ""}
          >
            {status?.outlook?.connected
              ? "Microsoft conectado"
              : loadingProvider === "microsoft"
                ? "Conectando..."
                : "Conectar Microsoft"}
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        Você pode conectar com Google Agenda, Gmails e Microsoft Outlook.
      </p>
      <div className="mt-4 flex flex-col gap-1">
        {status?.googleCalendar?.connected && (
          <Badge variant="default">Google Calendar conectado</Badge>
        )}
        {status?.gmail?.connected && (
          <Badge variant="default">Gmail conectado</Badge>
        )}
        {status?.outlook?.connected && (
          <Badge variant="default">Outlook conectado</Badge>
        )}
      </div>
    </Card>
  );
}
