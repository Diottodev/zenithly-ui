import * as v from 'valibot'

export const onboardingStepSchema = v.picklist([
  'welcome',
  'permissions',
  'google-calendar',
  'gmail',
  'outlook',
  'preferences',
  'completed',
])

export const integrationSettingsSchema = v.object({
  googleCalendar: v.object({
    enabled: v.optional(v.boolean(), false),
    syncFrequency: v.optional(
      v.picklist(['realtime', 'hourly', 'daily']),
      'hourly'
    ),
    defaultCalendarId: v.optional(v.string()),
    autoCreateEvents: v.optional(v.boolean(), true),
  }),
  gmail: v.object({
    enabled: v.optional(v.boolean(), false),
    autoSync: v.optional(v.boolean(), true),
    filterImportant: v.optional(v.boolean(), true),
    maxEmails: v.optional(
      v.pipe(v.number(), v.minValue(50), v.maxValue(1000)),
      100
    ),
  }),
  outlook: v.object({
    enabled: v.optional(v.boolean(), false),
    autoSync: v.optional(v.boolean(), true),
    filterImportant: v.optional(v.boolean(), true),
    maxEmails: v.optional(
      v.pipe(v.number(), v.minValue(50), v.maxValue(1000)),
      100
    ),
  }),
  preferences: v.object({
    theme: v.optional(v.picklist(['light', 'dark', 'system']), 'system'),
    language: v.optional(v.string(), 'pt-BR'),
    timezone: v.optional(v.string(), 'America/Sao_Paulo'),
    notifications: v.optional(v.boolean(), true),
    weekStartsOn: v.optional(v.picklist(['sunday', 'monday']), 'sunday'),
  }),
})

export type OnboardingStep = v.InferInput<typeof onboardingStepSchema>
export type IntegrationSettings = v.InferInput<typeof integrationSettingsSchema>

export const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Zenithly!',
    description: 'Vamos configurar sua conta em poucos passos simples.',
    icon: '👋',
    estimatedTime: '1 min',
  },
  {
    id: 'permissions',
    title: 'Permissões necessárias',
    description:
      'Precisamos de algumas permissões para funcionar perfeitamente.',
    icon: '🔒',
    estimatedTime: '2 min',
  },
  {
    id: 'google-calendar',
    title: 'Conectar Google Calendar',
    description: 'Sincronize seus eventos e compromissos automaticamente.',
    icon: '📅',
    estimatedTime: '1 min',
  },
  {
    id: 'gmail',
    title: 'Conectar Gmail',
    description: 'Integre seus emails para uma experiência completa.',
    icon: '✉️',
    estimatedTime: '1 min',
  },
  {
    id: 'outlook',
    title: 'Conectar Outlook',
    description: 'Conecte sua conta Microsoft para sincronização.',
    icon: '📧',
    estimatedTime: '1 min',
  },
  {
    id: 'preferences',
    title: 'Preferências pessoais',
    description: 'Personalize sua experiência no Zenithly.',
    icon: '⚙️',
    estimatedTime: '2 min',
  },
  {
    id: 'completed',
    title: 'Configuração concluída!',
    description: 'Tudo pronto! Agora você pode usar o Zenithly.',
    icon: '🎉',
    estimatedTime: '0 min',
  },
] as const

export const getStepIndex = (stepId: string) => {
  return tutorialSteps.findIndex((step) => step.id === stepId)
}

export const getNextStep = (currentStep: string) => {
  const currentIndex = getStepIndex(currentStep)
  return currentIndex < tutorialSteps.length - 1
    ? tutorialSteps[currentIndex + 1].id
    : null
}

export const getPreviousStep = (currentStep: string) => {
  const currentIndex = getStepIndex(currentStep)
  return currentIndex > 0 ? tutorialSteps[currentIndex - 1].id : null
}
