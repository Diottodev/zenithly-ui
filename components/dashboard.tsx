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
import { APP_SIDEBAR_DATA } from "$/utils/constants";

export default function Dashboard() {
  const [hash, setHash] = useHash("#emails");
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
                              (i) => i.url === hash
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
              <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
                <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8">
                  <h1 className="text-2xl font-semibold">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome to your dashboard! Here you can manage your
                    applications, view analytics, and access various features.
                  </p>
                </div>
                {/* Additional content can go here */}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
