'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '$/components/ui/breadcrumb'
import { Button } from '$/components/ui/button'
import { Separator } from '$/components/ui/separator'
import { SidebarTrigger } from '$/components/ui/sidebar'
import ThemeToggle from '$/components/ui/theme-toggle'
import { useMounted } from '$/hooks/use-mounted'
import { useTab } from '$/hooks/use-tab'
import { cn } from '$/lib/utils'
import { APP_SIDEBAR_DATA } from '$/utils/constants'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

export default function Header() {
  const isMounted = useMounted()
  const [tab] = useTab()
  if (!(tab && isMounted)) {
    return null
  }
  const date = new Date()
  return (
    <header className="flex min-h-20 shrink-0 flex-wrap items-center gap-3 border-b py-4 transition-all ease-linear">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <div className="max-lg:hidden lg:contents">
          <Separator
            className="me-2 data-[orientation=vertical]:h-4"
            orientation="vertical"
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
      <div className="flex items-center gap-3">
        <Button className="justify-start" variant="outline">
          <CalendarIcon
            aria-hidden="true"
            className="-ms-1 shrink-0 opacity-40 transition-colors group-hover:text-foreground"
            size={18}
          />
          <span className={cn('truncate', !date && 'text-muted-foreground')}>
            {format(date, 'dd/MM/yyyy')}
          </span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
