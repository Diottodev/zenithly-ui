"use client";

import { data } from "$/components/ui/app-sidebar";
import { Button } from "$/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "$/components/ui/tooltip";
import { useIsMobile } from "$/hooks/use-mobile";
import { cn } from "$/lib/utils";
import { RiAddLine } from "@remixicon/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";

export function ActionButtons() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();
  const [hash, setHash] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setDate(new Date());
    setHash(window.location.hash || "#emails");
    const onHashChange = () => setHash(window.location.hash || "#emails");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (!hash || !date) return null;

  return (
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
                  data.navMain[0].items.find((i) => i.url === hash)?.article
                }{" "}
                {data.navMain[0].items.find((i) => i.url === hash)?.singular}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden" hidden={isMobile}>
            Nov(
            {data.navMain[0].items.find((i) => i.url === hash)?.article}){" "}
            {data.navMain[0].items.find((i) => i.url === hash)?.singular}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
