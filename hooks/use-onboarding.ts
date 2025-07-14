'use client'

import { useAuth } from '$/hooks/use-auth'
import type { OnboardingStep } from '$/types/onboarding'
import { useEffect, useState } from 'react'

export interface OnboardingState {
  currentStep: OnboardingStep
  isComplete: boolean
  isLoading: boolean
  error: string | null
}

export function useOnboarding() {
  const { user } = useAuth()
  const [state, setState] = useState<OnboardingState>({
    currentStep: 'welcome',
    isComplete: false,
    isLoading: true,
    error: null,
  })

  // Verificar se o usuário já completou o onboarding
  useEffect(() => {
    const checkOnboardingStatus = () => {
      if (!user) {
        setState((prev) => ({ ...prev, isLoading: false }))
        return
      }
      try {
        // Aqui você faria uma chamada para a API para verificar o status
        // const response = await fetch('/api/user/onboarding-status');
        // const data = await response.json();

        // Simulando verificação
        const hasCompletedOnboarding = localStorage.getItem(
          `onboarding_complete_${user.id}`
        )
        const currentStep =
          (localStorage.getItem(
            `onboarding_step_${user.id}`
          ) as OnboardingStep) || 'welcome'

        setState((prev) => ({
          ...prev,
          isComplete: !!hasCompletedOnboarding,
          currentStep: hasCompletedOnboarding ? 'completed' : currentStep,
          isLoading: false,
        }))
      } catch (error) {
        console.log('Erro ao verificar status do onboarding:', error)
        setState((prev) => ({
          ...prev,
          error: 'Erro ao carregar dados do onboarding',
          isLoading: false,
        }))
      }
    }

    checkOnboardingStatus()
  }, [user])

  const updateStep = (step: OnboardingStep) => {
    if (!user) {
      return
    }

    try {
      setState((prev) => ({ ...prev, currentStep: step }))

      // Salvar no localStorage temporariamente
      localStorage.setItem(`onboarding_step_${user.id}`, step)

      // Aqui você faria uma chamada para a API para salvar o progresso
      // await fetch('/api/user/onboarding-progress', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ step }),
      // });
    } catch (error) {
      console.log('Erro ao atualizar step do onboarding:', error)
      setState((prev) => ({
        ...prev,
        error: 'Erro ao salvar progresso',
      }))
    }
  }

  const completeOnboarding = () => {
    if (!user) {
      return
    }

    try {
      setState((prev) => ({
        ...prev,
        isComplete: true,
        currentStep: 'completed',
      }))

      // Salvar no localStorage temporariamente
      localStorage.setItem(`onboarding_complete_${user.id}`, 'true')
      localStorage.removeItem(`onboarding_step_${user.id}`)

      // Aqui você faria uma chamada para a API para marcar como completo
      // await fetch('/api/user/onboarding-complete', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ completed: true }),
      // });
    } catch (error) {
      console.log('Erro ao completar onboarding:', error)
      setState((prev) => ({
        ...prev,
        error: 'Erro ao finalizar configuração',
      }))
    }
  }

  const resetOnboarding = () => {
    if (!user) {
      return
    }
    localStorage.removeItem(`onboarding_complete_${user.id}`)
    localStorage.removeItem(`onboarding_step_${user.id}`)
    setState({
      currentStep: 'welcome',
      isComplete: false,
      isLoading: false,
      error: null,
    })
  }
  return {
    ...state,
    updateStep,
    completeOnboarding,
    resetOnboarding,
    shouldShowOnboarding: !(state.isComplete || state.isLoading),
  }
}
