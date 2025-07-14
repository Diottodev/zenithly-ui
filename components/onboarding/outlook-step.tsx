"use client";

import { useState } from "react";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$/components/ui/card";
import { Badge } from "$/components/ui/badge";
import { Switch } from "$/components/ui/switch";
import { Label } from "$/components/ui/label";
import { CheckCircle, Mail, Inbox, Filter, Settings, ExternalLink } from "lucide-react";
import WaitMoment from "$/components/wait-moment";

interface StepProps {
  onDataChangeAction: (data: any) => void;
}

export default function OutlookStep({ onDataChangeAction }: StepProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [settings, setSettings] = useState({
    autoSync: true,
    filterImportant: true,
    maxEmails: 100,
    syncFrequency: 'hourly',
    includeArchived: false,
    includeDeleted: false,
    syncCalendar: true,
  });

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      // Simular conexão com Outlook
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para o OAuth da Microsoft
      // window.location.href = `/api/auth/outlook`;
      
      setConnected(true);
      onDataChangeAction({ connected: true, settings });
    } catch (error) {
      console.error('Erro ao conectar com Outlook:', error);
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
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-semibold">Conectar Outlook</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Integre sua conta Microsoft Outlook para gerenciar emails e calendário 
          de forma unificada no Zenithly.
        </p>
      </div>

      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
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
                  {connected ? 'Conectado ao Outlook' : 'Não conectado'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {connected 
                    ? 'Seus emails e calendário estão sendo sincronizados'
                    : 'Clique para conectar sua conta Microsoft'
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
                  Conectar Outlook
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
              <Inbox className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Integração Completa</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Sincronize emails, calendário e contatos da sua conta Microsoft em um só lugar.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-green-500" />
              <CardTitle className="text-lg">Organização Inteligente</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Filtre emails por importância e organize automaticamente sua caixa de entrada.
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
              Personalize como seus dados do Outlook serão sincronizados no Zenithly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxEmails" className="text-sm font-medium">
                  Máximo de Emails para Sincronizar
                </Label>
                <input
                  type="number"
                  id="maxEmails"
                  min="50"
                  max="1000"
                  value={settings.maxEmails}
                  onChange={(e) => updateSettings('maxEmails', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recomendado: 100-200 emails para melhor performance
                </p>
              </div>
              
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
                  <Label htmlFor="autoSync" className="text-sm font-medium">
                    Sincronização Automática
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Mantém seus emails sempre atualizados
                  </p>
                </div>
                <Switch
                  id="autoSync"
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => updateSettings('autoSync', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="filterImportant" className="text-sm font-medium">
                    Filtrar Emails Importantes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Prioriza emails marcados como importantes
                  </p>
                </div>
                <Switch
                  id="filterImportant"
                  checked={settings.filterImportant}
                  onCheckedChange={(checked) => updateSettings('filterImportant', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="syncCalendar" className="text-sm font-medium">
                    Sincronizar Calendário do Outlook
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Inclui eventos do calendário do Outlook
                  </p>
                </div>
                <Switch
                  id="syncCalendar"
                  checked={settings.syncCalendar}
                  onCheckedChange={(checked) => updateSettings('syncCalendar', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeArchived" className="text-sm font-medium">
                    Incluir Emails Arquivados
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sincroniza emails da pasta de arquivos
                  </p>
                </div>
                <Switch
                  id="includeArchived"
                  checked={settings.includeArchived}
                  onCheckedChange={(checked) => updateSettings('includeArchived', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeDeleted" className="text-sm font-medium">
                    Incluir Emails Excluídos
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sincroniza emails da lixeira
                  </p>
                </div>
                <Switch
                  id="includeDeleted"
                  checked={settings.includeDeleted}
                  onCheckedChange={(checked) => updateSettings('includeDeleted', checked)}
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
            <p>• Apenas lemos seus dados - nunca modificamos emails ou eventos</p>
            <p>• Todos os dados são criptografados durante o transporte e armazenamento</p>
            <p>• Não armazenamos senhas - usamos tokens seguros da Microsoft</p>
            <p>• Você pode desconectar a qualquer momento</p>
            <p>• Seguimos rigorosamente as políticas de privacidade da Microsoft</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
