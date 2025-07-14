'use client';

import OnboardingWizard from '$/components/onboarding-wizard';
import WaitMoment from '$/components/wait-moment';
import { useAuth } from '$/hooks/use-auth';
import { useOnboarding } from '$/hooks/use-onboarding';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const {
    currentStep,
    isComplete,
    isLoading,
    error,
    updateStep,
    completeOnboarding,
    shouldShowOnboarding,
  } = useOnboarding();

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!(authLoading || user)) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  // Redirecionar se já completou o onboarding
  useEffect(() => {
    if (isComplete) {
      router.push('/dashboard');
    }
  }, [isComplete, router]);

  const handleComplete = async () => {
    await completeOnboarding();
    router.push('/dashboard');
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <WaitMoment />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <h1 className="font-bold text-2xl text-red-600">Erro</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={() => window.location.reload()}
            type="button"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!(user && shouldShowOnboarding)) {
    return null;
  }

  return (
    <OnboardingWizard
      currentStep={currentStep}
      onCompleteAction={handleComplete}
      onStepChangeAction={updateStep}
    />
  );
}
