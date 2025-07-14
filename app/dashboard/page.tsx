import Dashboard from '$/components/dashboard';
import OnboardingGuard from '$/components/onboarding-guard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zenithly - Dashboard',
};

export default function DashboardPage() {
  return (
    <OnboardingGuard>
      <main className="flex h-full w-full items-center justify-center">
        <Dashboard />
      </main>
    </OnboardingGuard>
  );
}
