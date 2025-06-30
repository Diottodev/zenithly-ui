"use client";

import { ActionButtons } from "$/components/ui/action-buttons";
import { AppSidebar } from "$/components/ui/app-sidebar";
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
import { useHash } from "$/hooks/use-hash";
import { THashEnum } from "$/schemas/app-sidebar";
import { APP_SIDEBAR_DATA } from "$/utils/constants";
import { ComponentProps } from "react";

export default function Dashboard() {
  const [hash] = useHash("#emails");
  const actualHashRendered: Record<THashEnum, ComponentProps<any>> = {
    "#emails": <div>Welcome to email</div>,
    "#agenda": <div>Welcome to agenda</div>,
    "#notes": <div>Welcome to notes</div>,
    "#tasks": <div>Welcome to tasks</div>,
    "#passwords": <div>Welcome to password</div>,
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
                              (i) => i.hash === hash
                            )?.title
                          }
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
              {/* Right side */}
              <ActionButtons />
            </header>
            <div className="overflow-hidden">
              <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px">
                {actualHashRendered[hash as THashEnum]}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
