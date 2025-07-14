'use client'

import Agenda from '$/components/agenda'
import Header from '$/components/header'
import { AppSidebar } from '$/components/ui'
import { SidebarInset, SidebarProvider } from '$/components/ui/sidebar'
import { useMounted } from '$/hooks/use-mounted'
import { useTab } from '$/hooks/use-tab'

export default function Dashboard() {
  const [tab] = useTab()
  const isMounted = useMounted()
  if (!(tab && isMounted)) {
    return null
  }
  const actualTabRendered: Record<string, React.ReactNode> = {
    emails: <div>Welcome to email</div>,
    agenda: <Agenda />,
    notes: <div>Welcome to notes</div>,
    tasks: <div>Welcome to tasks</div>,
    passwords: <div>Welcome to password</div>,
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="@container px-4 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Header />
            <div className="overflow-hidden">{actualTabRendered[tab]}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
