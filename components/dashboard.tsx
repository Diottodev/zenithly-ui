"use client";

import Agenda from "$/components/agenda";
import { AppSidebar } from "$/components/ui";
import ActionButtons from "$/components/ui/action-buttons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "$/components/ui/breadcrumb";
import { Separator } from "$/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "$/components/ui/sidebar";
import { useTab } from "$/hooks/use-tab";
import { APP_SIDEBAR_DATA } from "$/utils/constants";

export default function Dashboard() {
  const [tab] = useTab();
  const actualTabRendered: Record<string, React.ReactNode> = {
    emails: <div>Welcome to email</div>,
    agenda: <Agenda />,
    notes: <div>Welcome to notes</div>,
    tasks: <div>Welcome to tasks</div>,
    passwords: <div>Welcome to password</div>,
  };
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="px-4 md:px-6 lg:px-8 @container">
          <div className="w-full max-w-6xl mx-auto">
            <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b">
              {/* Left side */}
              <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ms-1" />
                <div className="max-lg:hidden lg:contents">
                  <Separator
                    orientation="vertical"
                    className="me-2 data-[orientation=vertical]:h-4"
                  />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {
                            APP_SIDEBAR_DATA.navMain.items.find(
                              (i) => i.tab === tab
                            )?.title
                          }
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
              <ActionButtons />
            </header>
            <div className="overflow-hidden">{actualTabRendered[tab]}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
