'use client'

import Agenda from '$/components/agenda'
import Header from '$/components/header'
import { AppSidebar } from '$/components/ui'
import { SidebarInset, SidebarProvider } from '$/components/ui/sidebar'
import { useSession } from '$/hooks/use-auth'
import { useMounted } from '$/hooks/use-mounted'
import { useTab } from '$/hooks/use-tab'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { IntegrationSelector } from './integration-selector'
import Emails from './email'

export default function Dashboard() {
  const [tab] = useTab();
  const isMounted = useMounted();
  const { user, isPending } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!user && !isPending) {
      router.push("/auth/login");
    }
  }, [user, isPending, router]);
  if (!(tab && isMounted)) {
    return null;
  }
  if (!user && !isPending) {
    return null;
  }
  const userId = user?.id;
  const actualTabRendered: Record<string, React.ReactNode> = {
    emails: <Emails />,
    agenda: <Agenda />,
    notes: <div>Welcome to notes</div>,
    tasks: <div>Welcome to tasks</div>,
    passwords: <div>Welcome to password</div>,
  };
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="@container px-4 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Header />
            {/* {userId && <IntegrationSelector userId={userId} />} */}
            <div className="overflow-hidden">{actualTabRendered[tab]}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
