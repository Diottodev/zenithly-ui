# Sistema de Onboarding Zenithly

Este sistema de onboarding foi desenvolvido para guiar novos usuários através da configuração inicial da aplicação Zenithly, incluindo integração com Google Calendar, Gmail e Outlook.

## Funcionalidades

### 🎯 Tutorial Guiado
- Interface wizard step-by-step
- Progresso visual com barra de progresso
- Validação de cada etapa
- Possibilidade de pular etapas não obrigatórias

### 🔐 Integrações Seguras
- **Google Calendar**: Sincronização de eventos
- **Gmail**: Integração de emails
- **Outlook**: Integração Microsoft (email + calendário)

### 📱 Experiência do Usuário
- Design responsivo
- Animações suaves
- Feedback visual
- Loading states
- Tratamento de erros

## Estrutura do Sistema

### Componentes Principais

#### 1. OnboardingWizard
- Componente principal que gerencia o fluxo
- Localização: `components/onboarding-wizard.tsx`

#### 2. Steps Individuais
- **Welcome**: Introdução e verificação de compatibilidade
- **Permissions**: Solicitação de permissões do navegador
- **Google Calendar**: Configuração do Google Calendar
- **Gmail**: Configuração do Gmail
- **Outlook**: Configuração do Outlook
- **Preferences**: Preferências pessoais
- **Completed**: Finalização com celebração

#### 3. Hooks
- `useOnboarding`: Gerencia estado do onboarding
- `useAuth`: Autenticação do usuário

#### 4. Guards
- `OnboardingGuard`: Redireciona usuários não configurados

### Fluxo de Dados

```
Usuário faz login → Verifica onboarding → Redireciona para /onboarding
↓
OnboardingWizard → Gerencia steps → Salva configurações
↓
Completa onboarding → Redireciona para /dashboard
```

## Configuração

### Variáveis de Ambiente

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft OAuth (para Outlook)
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# URLs
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Banco de Dados

O sistema usa as seguintes tabelas:

1. **user**: Informações do usuário + status de onboarding
2. **userIntegrations**: Tokens e configurações das integrações
3. **tutorialProgress**: Progresso detalhado do tutorial

### Scopes OAuth

#### Google
- `openid`: Identificação básica
- `email`: Email do usuário
- `profile`: Perfil básico
- `https://www.googleapis.com/auth/calendar`: Acesso ao calendário
- `https://www.googleapis.com/auth/gmail.readonly`: Leitura de emails
- `https://www.googleapis.com/auth/gmail.compose`: Composição de emails

#### Microsoft
- `https://graph.microsoft.com/Mail.Read`: Leitura de emails
- `https://graph.microsoft.com/Calendars.ReadWrite`: Acesso ao calendário

## Rotas da API

### Integrações

#### Google Calendar
- `GET /api/integrations/google-calendar`: Inicia OAuth
- `GET /api/integrations/google-calendar/callback`: Callback OAuth
- `POST /api/integrations/google-calendar`: Desconectar

#### Gmail
- `GET /api/integrations/gmail`: Inicia OAuth
- `GET /api/integrations/gmail/callback`: Callback OAuth
- `POST /api/integrations/gmail`: Desconectar

#### Outlook
- `GET /api/integrations/outlook`: Inicia OAuth
- `GET /api/integrations/outlook/callback`: Callback OAuth
- `POST /api/integrations/outlook`: Desconectar

## Como Usar

### 1. Implementar nas Páginas

```tsx
// app/dashboard/page.tsx
import OnboardingGuard from "$/components/onboarding-guard";

export default function DashboardPage() {
  return (
    <OnboardingGuard>
      <Dashboard />
    </OnboardingGuard>
  );
}
```

### 2. Verificar Estado do Onboarding

```tsx
import { useOnboarding } from "$/hooks/use-onboarding";

function MyComponent() {
  const { shouldShowOnboarding, isComplete } = useOnboarding();
  
  if (shouldShowOnboarding) {
    // Mostrar onboarding
  }
  
  return <div>Conteúdo normal</div>;
}
```

### 3. Resetar Onboarding (Desenvolvimento)

```tsx
import { useOnboarding } from "$/hooks/use-onboarding";

function DevTools() {
  const { resetOnboarding } = useOnboarding();
  
  return (
    <button onClick={resetOnboarding}>
      Resetar Onboarding
    </button>
  );
}
```

## Personalização

### Modificar Steps

Para adicionar ou modificar steps:

1. Adicione o step em `types/onboarding.ts`
2. Crie o componente do step em `components/onboarding/`
3. Atualize `tutorialSteps` com as informações
4. Adicione o case no `OnboardingWizard`

### Customizar Aparência

- Modifique os componentes em `components/onboarding/`
- Ajuste as animações usando Framer Motion
- Personalize os estilos Tailwind CSS

## Tratamento de Erros

O sistema trata os seguintes erros:

- **Falha no OAuth**: Redireciona com mensagem de erro
- **Token inválido**: Renova automaticamente (se implementado)
- **Permissões negadas**: Permite continuar sem a integração
- **Erro de rede**: Mostra mensagem de erro e retry

## Funcionalidades Futuras

- [ ] Integração com mais provedores (Apple Calendar, etc.)
- [ ] Tutorial interativo inline
- [ ] Onboarding progressivo (configuração gradual)
- [ ] Analytics de abandono
- [ ] Personalização por tipo de usuário
- [ ] Importação de configurações
- [ ] Backup/restore de configurações

## Troubleshooting

### Problemas Comuns

1. **OAuth não funciona**: Verifique URLs de callback
2. **Permissões negadas**: Verifique scopes na configuração
3. **Tokens expirados**: Implemente refresh de tokens
4. **Redirect loops**: Verifique lógica do OnboardingGuard

### Logs

Os logs importantes estão nos console.log das rotas de API e podem ser monitorados para debug.

## Contribuição

Para contribuir com o sistema de onboarding:

1. Siga a estrutura de componentes existente
2. Mantenha a consistência de design
3. Teste todos os fluxos de OAuth
4. Documente novas funcionalidades
5. Considere a experiência do usuário

## Licença

Este sistema é parte do projeto Zenithly e segue a mesma licença.
