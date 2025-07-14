/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
'use client'

import { Badge } from '$/components/ui/badge'
import { Button } from '$/components/ui/button'
import { Card, CardContent } from '$/components/ui/card'
import WaitMoment from '$/components/wait-moment'
import type { OnboardingStep } from '$/types/onboarding'
import {
  getNextStep,
  getPreviousStep,
  getStepIndex,
  tutorialSteps,
} from '$/types/onboarding'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import CompletedStep from './onboarding/completed-step'
import GmailStep from './onboarding/gmail-step'
import GoogleCalendarStep from './onboarding/google-calendar-step'
import OutlookStep from './onboarding/outlook-step'
import PermissionsStep from './onboarding/permissions-step'
import PreferencesStep from './onboarding/preferences-step'
// Importar os componentes dos steps específicos
import WelcomeStep from './onboarding/welcome-step'

interface OnboardingWizardProps {
  currentStep: OnboardingStep
  onStepChangeAction: (step: OnboardingStep) => void
  onCompleteAction: () => void
}

export default function OnboardingWizard({
  currentStep,
  onStepChangeAction,
  onCompleteAction,
}: OnboardingWizardProps) {
  const [loading, setLoading] = useState(false)
  const [_stepData, setStepData] = useState<Record<string, any>>({})

  const currentStepIndex = getStepIndex(currentStep)
  const currentStepInfo = tutorialSteps[currentStepIndex]
  const totalSteps = tutorialSteps.length - 1 // Excluindo o step "completed"

  const handleNext = async () => {
    setLoading(true)

    // Simular processo de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const nextStep = getNextStep(currentStep)
    if (nextStep) {
      if (nextStep === 'completed') {
        onCompleteAction()
      } else {
        onStepChangeAction(nextStep)
      }
    }

    setLoading(false)
  }

  const handlePrevious = () => {
    const prevStep = getPreviousStep(currentStep)
    if (prevStep) {
      onStepChangeAction(prevStep)
    }
  }

  const handleSkip = () => {
    const nextStep = getNextStep(currentStep)
    if (nextStep) {
      onStepChangeAction(nextStep)
    }
  }

  const updateStepData = (stepId: string, data: any) => {
    setStepData((prev) => ({
      ...prev,
      [stepId]: data,
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeStep
            onDataChangeAction={(data: any) =>
              updateStepData(currentStep, data)
            }
          />
        )
      case 'permissions':
        return (
          <PermissionsStep
            onDataChangeAction={(data: any) =>
              updateStepData(currentStep, data)
            }
          />
        )
      case 'google-calendar':
        return (
          <GoogleCalendarStep
            onDataChangeAction={(data: any) =>
              updateStepData(currentStep, data)
            }
          />
        )
      case 'gmail':
        return (
          <GmailStep
            onDataChangeAction={(data: any) =>
              updateStepData(currentStep, data)
            }
          />
        )
      case 'outlook':
        return (
          <OutlookStep
            onDataChangeAction={(data: any) =>
              updateStepData(currentStep, data)
            }
          />
        )
      case 'preferences':
        return (
          <PreferencesStep
            onDataChangeAction={(data: any) =>
              updateStepData(currentStep, data)
            }
          />
        )
      case 'completed':
        return <CompletedStep onCompleteAction={onCompleteAction} />
      default:
        return null
    }
  }

  if (loading) {
    return <WaitMoment />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header com progresso */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="text-4xl">{currentStepInfo.icon}</div>
            <div>
              <h1 className="font-bold text-3xl">{currentStepInfo.title}</h1>
              <p className="text-muted-foreground">
                {currentStepInfo.description}
              </p>
            </div>
          </div>

          {/* Barra de progresso */}
          {currentStep !== 'completed' && (
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="text-muted-foreground text-sm">
                Passo {currentStepIndex + 1} de {totalSteps}
              </span>
              <Badge className="text-xs" variant="outline">
                {currentStepInfo.estimatedTime}
              </Badge>
            </div>
          )}

          {currentStep !== 'completed' && (
            <div className="mx-auto h-2 w-full max-w-md rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* Conteúdo do step */}
        <Card className="w-full">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        {/* Navegação */}
        {currentStep !== 'completed' && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              className="flex items-center gap-2"
              disabled={currentStepIndex === 0}
              onClick={handlePrevious}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {currentStep !== 'welcome' && (
                <Button
                  className="text-muted-foreground"
                  onClick={handleSkip}
                  variant="ghost"
                >
                  Pular
                </Button>
              )}

              <Button className="flex items-center gap-2" onClick={handleNext}>
                {currentStep === 'preferences' ? 'Finalizar' : 'Próximo'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
