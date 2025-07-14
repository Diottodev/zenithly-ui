"use client";

import { useState } from "react";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$/components/ui/card";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface StepProps {
  onDataChangeAction: (data: any) => void;
}

export default function WelcomeStep({ onDataChangeAction }: StepProps) {
  const [browserSupported, setBrowserSupported] = useState(true);
  
  const checkBrowserSupport = () => {
    // Verificar se o navegador suporta as APIs necessárias
    const hasNotifications = 'Notification' in window;
    const hasCalendar = 'calendar' in navigator;
    const hasWebAuth = 'credentials' in navigator;
    
    const isSupported = hasNotifications && hasWebAuth;
    setBrowserSupported(isSupported);
    
    onDataChangeAction({ browserSupported: isSupported });
  };

  return (
    <div className="space-y-6">
      {/* Introdução */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-semibold">Bem-vindo ao Zenithly!</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          O Zenithly é sua plataforma completa para gerenciar agenda, emails e produtividade. 
          Vamos configurar tudo em alguns passos simples para você aproveitar ao máximo.
        </p>
      </div>

      {/* Recursos principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="text-2xl mb-2">📅</div>
            <CardTitle className="text-lg">Agenda Inteligente</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Sincronize com Google Calendar e visualize todos seus compromissos em um só lugar.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="text-2xl mb-2">✉️</div>
            <CardTitle className="text-lg">Gestão de Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Conecte Gmail e Outlook para uma visão unificada dos seus emails importantes.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="text-2xl mb-2">⚡</div>
            <CardTitle className="text-lg">Produtividade</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Ferramentas inteligentes para organizar seu tempo e maximizar sua eficiência.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Verificação de compatibilidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Verificação de Compatibilidade
          </CardTitle>
          <CardDescription>
            Vamos verificar se seu navegador suporta todos os recursos necessários.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Notificações do navegador</span>
            {'Notification' in window ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-red-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Autenticação segura</span>
            {'credentials' in navigator ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-red-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Armazenamento local</span>
            {'localStorage' in window ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-red-500" />
            )}
          </div>
          
          {!browserSupported && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                Seu navegador não suporta todas as funcionalidades. Recomendamos usar Chrome, Firefox ou Safari mais recentes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Próximos passos */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Próximos Passos</h3>
        <p className="text-muted-foreground">
          Vamos configurar suas integrações e preferências para personalizar sua experiência.
        </p>
        <div className="flex justify-center gap-2">
          <span className="text-sm text-muted-foreground">Tempo estimado:</span>
          <span className="text-sm font-medium">5-7 minutos</span>
        </div>
      </div>
    </div>
  );
}
