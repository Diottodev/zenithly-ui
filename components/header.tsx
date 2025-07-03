"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "$/components/ui/breadcrumb";
import { Button } from "$/components/ui/button";
import { Separator } from "$/components/ui/separator";
import { SidebarTrigger } from "$/components/ui/sidebar";
import ThemeToggle from "$/components/ui/theme-toggle";
import { useMounted } from "$/hooks/use-mounted";
import { useTab } from "$/hooks/use-tab";
import { cn } from "$/lib/utils";
import { APP_SIDEBAR_DATA } from "$/utils/constants";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function Header() {
  const isMounted = useMounted();
  const [tab] = useTab();
  if (!tab) return null;
  if (!tab || !isMounted) return null;
  const date = new Date();
  return (
    <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b">
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
                    APP_SIDEBAR_DATA.navMain.items.find((i) => i.tab === tab)
                      ?.title
                  }
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="justify-start">
          <CalendarIcon
            size={18}
            className="opacity-40 -ms-1 group-hover:text-foreground shrink-0 transition-colors"
            aria-hidden="true"
          />
          <span className={cn("truncate", !date && "text-muted-foreground")}>
            {format(date, "dd/MM/yyyy")}
          </span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
