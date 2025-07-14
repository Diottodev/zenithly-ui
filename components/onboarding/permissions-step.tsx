"use client";

import { useState } from "react";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$/components/ui/card";
import { Badge } from "$/components/ui/badge";
import { CheckCircle, Circle, AlertCircle, Shield, Lock, Eye } from "lucide-react";

interface StepProps {
  onDataChangeAction: (data: any) => void;
}

export default function PermissionsStep({ onDataChangeAction }: StepProps) {
  const [permissions, setPermissions] = useState({
    notifications: false,
    calendar: false,
    location: false,
  });

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissions(prev => ({ ...prev, notifications: permission === 'granted' }));
      onDataChangeAction({ notifications: permission === 'granted' });
    }
  };

  const requestCalendarPermission = async () => {
    // Simular permissão do calendário
    setPermissions(prev => ({ ...prev, calendar: true }));
    onDataChangeAction({ calendar: true });
  };

  const requestLocationPermission = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissions(prev => ({ ...prev, location: true }));
          onDataChangeAction({ location: true });
        },
        () => {
          setPermissions(prev => ({ ...prev, location: false }));
          onDataChangeAction({ location: false });
        }
      );
    }
  };

  const permissionsList = [
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Receba lembretes de eventos e tarefas importantes',
      icon: <AlertCircle className="w-5 h-5" />,
      required: true,
      granted: permissions.notifications,
      action: requestNotificationPermission,
    },
    {
      id: 'calendar',
      title: 'Acesso ao Calendário',
      description: 'Sincronize e gerencie seus eventos do Google Calendar',
      icon: <Shield className="w-5 h-5" />,
      required: true,
      granted: permissions.calendar,
      action: requestCalendarPermission,
    },
    {
      id: 'location',
      title: 'Localização',
      description: 'Adicione localização aos eventos e receba sugestões baseadas em proximidade',
      icon: <Eye className="w-5 h-5" />,
      required: false,
      granted: permissions.location,
      action: requestLocationPermission,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Introdução */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-semibold">Permissões Necessárias</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Para fornecer a melhor experiência, o Zenithly precisa de algumas permissões. 
          Seus dados sempre permanecerão privados e seguros.
        </p>
      </div>

      {/* Segurança e Privacidade */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Lock className="w-5 h-5" />
            Sua Privacidade é Protegida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-700">
            <p>• Todos os dados são criptografados em trânsito e em repouso</p>
            <p>• Nunca compartilhamos seus dados com terceiros</p>
            <p>• Você pode revogar qualquer permissão a qualquer momento</p>
            <p>• Seguimos as melhores práticas de segurança GDPR/LGPD</p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Permissões */}
      <div className="space-y-4">
        {permissionsList.map((permission) => (
          <Card key={permission.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {permission.icon}
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {permission.title}
                      {permission.required && (
                        <Badge variant="destructive" className="text-xs">
                          Obrigatório
                        </Badge>
                      )}
                      {!permission.required && (
                        <Badge variant="secondary" className="text-xs">
                          Opcional
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {permission.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {permission.granted ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {permission.granted ? (
                    <span className="text-green-600 font-medium">✓ Permissão concedida</span>
                  ) : (
                    <span className="text-amber-600">Permissão pendente</span>
                  )}
                </div>
                {!permission.granted && (
                  <Button onClick={permission.action} variant="outline" size="sm">
                    Conceder Permissão
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {permissionsList.filter(p => p.granted).length}
              </div>
              <div className="text-sm text-muted-foreground">Concedidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {permissionsList.filter(p => !p.granted).length}
              </div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
          </div>
          
          {permissionsList.filter(p => p.required && !p.granted).length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                Algumas permissões obrigatórias ainda não foram concedidas. 
                Elas são necessárias para o funcionamento completo do Zenithly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
