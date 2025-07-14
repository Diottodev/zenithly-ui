"use client";

import { useState } from "react";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$/components/ui/card";
import { Badge } from "$/components/ui/badge";
import { Switch } from "$/components/ui/switch";
import { Label } from "$/components/ui/label";
import { CheckCircle, Calendar, Clock, Users, Settings, ExternalLink } from "lucide-react";
import WaitMoment from "$/components/wait-moment";

interface StepProps {
  onDataChangeAction: (data: any) => void;
}

export default function GoogleCalendarStep({ onDataChangeAction }: StepProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [settings, setSettings] = useState({
    syncFrequency: 'hourly',
    autoCreateEvents: true,
    syncAllCalendars: true,
    showNotifications: true,
  });

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      // Simular conexão com Google Calendar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para o OAuth do Google
      // window.location.href = `/api/auth/google-calendar`;
      
      setConnected(true);
      onDataChangeAction({ connected: true, settings });
    } catch (error) {
      console.error('Erro ao conectar com Google Calendar:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    onDataChangeAction({ connected: false, settings });
  };

  const updateSettings = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onDataChangeAction({ connected, settings: newSettings });
  };

  if (connecting) {
    return <WaitMoment />;
  }

  return (
    <div className="space-y-6">
      {/* Introdução */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-semibold">Conectar Google Calendar</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sincronize seus eventos do Google Calendar para ter uma visão completa 
          de sua agenda diretamente no Zenithly.
        </p>
      </div>

      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Status da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {connected ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
              )}
              <div>
                <p className="font-medium">
                  {connected ? 'Conectado ao Google Calendar' : 'Não conectado'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {connected 
                    ? 'Seus eventos estão sendo sincronizados'
                    : 'Clique para conectar sua conta do Google'
                  }
                </p>
              </div>
            </div>
            <div>
              {connected ? (
                <Button variant="outline" onClick={handleDisconnect}>
                  Desconectar
                </Button>
              ) : (
                <Button onClick={handleConnect} className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Conectar Google
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefícios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Sincronização Automática</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Seus eventos são atualizados automaticamente, mantendo tudo sempre em sincronia.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <CardTitle className="text-lg">Múltiplos Calendários</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Visualize todos os seus calendários (pessoal, trabalho, família) em um só lugar.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Configurações */}
      {connected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações de Sincronização
            </CardTitle>
            <CardDescription>
              Personalize como seus eventos do Google Calendar serão sincronizados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="syncFrequency" className="text-sm font-medium">
                  Frequência de Sincronização
                </Label>
                <select
                  id="syncFrequency"
                  value={settings.syncFrequency}
                  onChange={(e) => updateSettings('syncFrequency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="realtime">Tempo Real</option>
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Uma vez por dia</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoCreateEvents" className="text-sm font-medium">
                    Criar Eventos Automaticamente
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que o Zenithly crie eventos no seu Google Calendar
                  </p>
                </div>
                <Switch
                  id="autoCreateEvents"
                  checked={settings.autoCreateEvents}
                  onCheckedChange={(checked) => updateSettings('autoCreateEvents', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="syncAllCalendars" className="text-sm font-medium">
                    Sincronizar Todos os Calendários
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Inclui todos os calendários da sua conta Google
                  </p>
                </div>
                <Switch
                  id="syncAllCalendars"
                  checked={settings.syncAllCalendars}
                  onCheckedChange={(checked) => updateSettings('syncAllCalendars', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showNotifications" className="text-sm font-medium">
                    Notificações de Eventos
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes dos seus compromissos
                  </p>
                </div>
                <Switch
                  id="showNotifications"
                  checked={settings.showNotifications}
                  onCheckedChange={(checked) => updateSettings('showNotifications', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações de Privacidade */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Privacidade e Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Apenas lemos e sincronizamos seus eventos - nunca os modificamos sem sua permissão</p>
            <p>• Seus dados do Google Calendar são criptografados e armazenados com segurança</p>
            <p>• Você pode desconectar a qualquer momento sem perder dados</p>
            <p>• Seguimos as diretrizes de segurança do Google OAuth 2.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
