"use client";

import { useState } from "react";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$/components/ui/card";
import { Badge } from "$/components/ui/badge";
import { Switch } from "$/components/ui/switch";
import { Label } from "$/components/ui/label";
import { RadioGroup, RadioGroupItem } from "$/components/ui/radio-group";
import { Palette, Globe, Bell, Calendar, Clock, Settings } from "lucide-react";

interface StepProps {
  onDataChangeAction: (data: any) => void;
}

export default function PreferencesStep({ onDataChangeAction }: StepProps) {
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    notifications: true,
    weekStartsOn: 'sunday',
    timeFormat: '24h',
    dateFormat: 'dd/MM/yyyy',
    defaultView: 'month',
    showWeekNumbers: false,
    compactMode: false,
  });

  const updatePreference = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onDataChangeAction(newPreferences);
  };

  const timezones = [
    { value: 'America/Sao_Paulo', label: 'São Paulo (UTC-3)' },
    { value: 'America/New_York', label: 'Nova York (UTC-5)' },
    { value: 'Europe/London', label: 'Londres (UTC+0)' },
    { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
    { value: 'Asia/Tokyo', label: 'Tóquio (UTC+9)' },
    { value: 'Australia/Sydney', label: 'Sydney (UTC+10)' },
  ];

  const languages = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (United States)' },
    { value: 'es-ES', label: 'Español (España)' },
    { value: 'fr-FR', label: 'Français (France)' },
  ];

  return (
    <div className="space-y-6">
      {/* Introdução */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-2xl font-semibold">Preferências Pessoais</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Personalize sua experiência no Zenithly. Você pode alterar essas configurações 
          a qualquer momento nas configurações do sistema.
        </p>
      </div>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Aparência
          </CardTitle>
          <CardDescription>
            Personalize a aparência da interface do Zenithly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tema</Label>
            <RadioGroup
              value={preferences.theme}
              onValueChange={(value) => updatePreference('theme', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Claro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Escuro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">Automático (sistema)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compactMode" className="text-sm font-medium">
                Modo Compacto
              </Label>
              <p className="text-sm text-muted-foreground">
                Reduz espaçamentos para mostrar mais informações
              </p>
            </div>
            <Switch
              id="compactMode"
              checked={preferences.compactMode}
              onCheckedChange={(checked) => updatePreference('compactMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Localização e Idioma
          </CardTitle>
          <CardDescription>
            Configure seu idioma, fuso horário e formatos de data/hora.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="language" className="text-sm font-medium">
              Idioma
            </Label>
            <select
              id="language"
              value={preferences.language}
              onChange={(e) => updatePreference('language', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="timezone" className="text-sm font-medium">
              Fuso Horário
            </Label>
            <select
              id="timezone"
              value={preferences.timezone}
              onChange={(e) => updatePreference('timezone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeFormat" className="text-sm font-medium">
                Formato de Hora
              </Label>
              <select
                id="timeFormat"
                value={preferences.timeFormat}
                onChange={(e) => updatePreference('timeFormat', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="24h">24 horas (14:30)</option>
                <option value="12h">12 horas (2:30 PM)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dateFormat" className="text-sm font-medium">
                Formato de Data
              </Label>
              <select
                id="dateFormat"
                value={preferences.dateFormat}
                onChange={(e) => updatePreference('dateFormat', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                <option value="yyyy-MM-dd">AAAA-MM-DD</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Configurações do Calendário
          </CardTitle>
          <CardDescription>
            Personalize como o calendário é exibido e funciona.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="defaultView" className="text-sm font-medium">
              Visualização Padrão
            </Label>
            <select
              id="defaultView"
              value={preferences.defaultView}
              onChange={(e) => updatePreference('defaultView', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="month">Mês</option>
              <option value="week">Semana</option>
              <option value="day">Dia</option>
              <option value="agenda">Agenda</option>
            </select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Primeiro Dia da Semana</Label>
            <RadioGroup
              value={preferences.weekStartsOn}
              onValueChange={(value) => updatePreference('weekStartsOn', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sunday" id="sunday" />
                <Label htmlFor="sunday">Domingo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monday" id="monday" />
                <Label htmlFor="monday">Segunda-feira</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showWeekNumbers" className="text-sm font-medium">
                Mostrar Números das Semanas
              </Label>
              <p className="text-sm text-muted-foreground">
                Exibe o número da semana na visualização do calendário
              </p>
            </div>
            <Switch
              id="showWeekNumbers"
              checked={preferences.showWeekNumbers}
              onCheckedChange={(checked) => updatePreference('showWeekNumbers', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como e quando receber notificações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-sm font-medium">
                Ativar Notificações
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes de eventos e tarefas importantes
              </p>
            </div>
            <Switch
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={(checked) => updatePreference('notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Resumo das Preferências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Tema:</strong> {preferences.theme === 'system' ? 'Automático' : preferences.theme === 'dark' ? 'Escuro' : 'Claro'}</p>
              <p><strong>Idioma:</strong> {languages.find(l => l.value === preferences.language)?.label}</p>
              <p><strong>Fuso Horário:</strong> {timezones.find(tz => tz.value === preferences.timezone)?.label}</p>
            </div>
            <div>
              <p><strong>Visualização:</strong> {preferences.defaultView === 'month' ? 'Mês' : preferences.defaultView === 'week' ? 'Semana' : preferences.defaultView === 'day' ? 'Dia' : 'Agenda'}</p>
              <p><strong>Semana inicia:</strong> {preferences.weekStartsOn === 'sunday' ? 'Domingo' : 'Segunda-feira'}</p>
              <p><strong>Notificações:</strong> {preferences.notifications ? 'Ativadas' : 'Desativadas'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
