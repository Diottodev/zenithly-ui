
import Dashboard from '$/components/dashboard';
import { IntegrationSelector } from '$/components/integration-selector';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zenithly - Dashboard',
};


export default function DashboardPage() {
  return (
    <main className="flex flex-col h-full w-full items-center justify-center gap-8">
      <Dashboard />
    </main>
  );
}
