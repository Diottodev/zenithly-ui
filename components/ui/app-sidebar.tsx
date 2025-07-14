'use client'

import Logo from '$/components/ui/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '$/components/ui/sidebar'
import { UserMenu } from '$/components/user-menu'
import { useTab } from '$/hooks/use-tab'
import { APP_SIDEBAR_DATA } from '$/utils/constants'

function SidebarLogo() {
  const { state } = useSidebar()
  return (
    <div className="flex items-center transition-[padding] duration-200 ease-in-out group-data-[collapsible=icon]:px-0">
      <Logo />
      {/* Show the logo text only when the sidebar is expanded */}
      {state === 'expanded' && (
        <span className="ml-3 font-bold font-jetbrains text-[22px] text-[color:var(--color-primary,_#6366F1)] tracking-[-0.5px]">
          Zenithly
        </span>
      )}
    </div>
  )
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [tab, setTab] = useTab()

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="mb-2 ml-[-8px] h-16 justify-center max-md:mt-2">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {[APP_SIDEBAR_DATA.navMain].map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-muted-foreground/65 uppercase">
              {group.icon && (
                <group.icon
                  aria-hidden="true"
                  className="mr-2 text-muted-foreground/65"
                  size={22}
                />
              )}
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button h-9 gap-3 font-medium group-data-[collapsible=icon]:px-[5px]! [&>svg]:size-auto"
                      isActive={tab === item.tab}
                      tooltip={item.title}
                    >
                      <button
                        className="m-0 flex w-full items-center gap-3 border-0 bg-transparent p-0 text-left"
                        onClick={() => setTab(item.tab)}
                        type="button"
                      >
                        {item.icon && (
                          <item.icon
                            aria-hidden="true"
                            className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                          />
                        )}
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
