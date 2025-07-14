'use client'

import { Badge } from '$/components/ui/badge'
import { Button } from '$/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '$/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '$/components/ui/dialog'
import { Progress } from '$/components/ui/progress'
// import { useAuth } from '$/hooks/use-auth'
import { type OnboardingStep, tutorialSteps } from '$/types/onboarding'
import { useState } from 'react'
import CompletedStep from './completed-step'
import GmailStep from './gmail-step'
import GoogleCalendarStep from './google-calendar-step'
import OutlookStep from './outlook-step'
import PermissionsStep from './permissions-step'
import PreferencesStep from './preferences-step'
import WelcomeStep from './welcome-step'

interface OnboardingDialogProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  currentStep: OnboardingStep
  onStepCompleteAction: (step: OnboardingStep) => void
}

export function OnboardingDialog({
  open,
  onOpenChangeAction,
  currentStep,
  onStepCompleteAction,
}: OnboardingDialogProps) {
  // const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false)

  const currentStepData = tutorialSteps.find((step) => step.id === currentStep)
  const currentStepIndex = tutorialSteps.findIndex(
    (step) => step.id === currentStep
  )
  const progress = ((currentStepIndex + 1) / tutorialSteps.length) * 100

  const handleNext = async () => {
    setIsLoading(true)
    try {
      await onStepCompleteAction(currentStep)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    setIsLoading(true)
    try {
      // Pular para o último step
      await onStepCompleteAction('completed')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onDataChangeAction={handleNext} />
      case 'permissions':
        return <PermissionsStep onDataChangeAction={handleNext} />
      case 'google-calendar':
        return <GoogleCalendarStep onDataChangeAction={handleNext} />
      case 'gmail':
        return <GmailStep onDataChangeAction={handleNext} />
      case 'outlook':
        return <OutlookStep onDataChangeAction={handleNext} />
      case 'preferences':
        return <PreferencesStep onDataChangeAction={handleNext} />
      case 'completed':
        return (
          <CompletedStep onCompleteAction={() => onOpenChangeAction(false)} />
        )
      default:
        return null
    }
  }

  return (
    <Dialog onOpenChange={onOpenChangeAction} open={open}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-bold text-2xl">
              Configuração Inicial
            </DialogTitle>
            <Badge className="text-sm" variant="outline">
              {currentStepIndex + 1} de {tutorialSteps.length}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress className="h-2" value={progress} />
          </div>

          {/* Current Step Info */}
          {currentStepData && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{currentStepData.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {currentStepData.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {currentStepData.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{renderStepContent()}</CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 'completed' && (
            <div className="flex justify-between">
              <Button
                disabled={isLoading}
                onClick={handleSkip}
                variant="outline"
              >
                Pular configuração
              </Button>

              <div className="flex gap-2">
                {currentStepIndex > 0 && (
                  <Button
                    disabled={isLoading}
                    onClick={() => {
                      const prevStep = tutorialSteps[currentStepIndex - 1]
                      if (prevStep) {
                        onStepCompleteAction(prevStep.id as OnboardingStep)
                      }
                    }}
                    variant="outline"
                  >
                    Voltar
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
