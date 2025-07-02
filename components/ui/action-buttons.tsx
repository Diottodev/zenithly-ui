"use client";

import { Button } from "$/components/ui/button";
import ThemeToggle from "$/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "$/components/ui/tooltip";
import { useIsMobile } from "$/hooks/use-mobile";
import { useMounted } from "$/hooks/use-mounted";
import { useTab } from "$/hooks/use-tab";
import { cn } from "$/lib/utils";
import { APP_SIDEBAR_DATA } from "$/utils/constants";
import { RiAddLine } from "@remixicon/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

function ActionButtons() {
  const isMounted = useMounted();
  const isMobile = useIsMobile();
  const [tab] = useTab();
  if (!tab || !isMounted) return null;
  const date = new Date();
  return (
    <div className="flex gap-3">
      <ThemeToggle />
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
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="aspect-square max-lg:p-0">
              <RiAddLine
                className="lg:-ms-1 size-5"
                size={20}
                aria-hidden="true"
              />
              <span className="max-lg:sr-only">
                Nov
                {
                  APP_SIDEBAR_DATA.navMain.items.find((i) => i.tab === tab)
                    ?.article
                }{" "}
                {
                  APP_SIDEBAR_DATA.navMain.items.find((i) => i.tab === tab)
                    ?.singular
                }
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden" hidden={isMobile}>
            Nov
            {
              APP_SIDEBAR_DATA.navMain.items.find((i) => i.tab === tab)?.article
            }{" "}
            {
              APP_SIDEBAR_DATA.navMain.items.find((i) => i.tab === tab)
                ?.singular
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ActionButtons;
