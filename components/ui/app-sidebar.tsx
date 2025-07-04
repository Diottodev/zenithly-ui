"use client";

import Logo from "$/components/ui/logo";
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
} from "$/components/ui/sidebar";
import { UserMenu } from "$/components/user-menu";
import { useTab } from "$/hooks/use-tab";
import { APP_SIDEBAR_DATA } from "$/utils/constants";

function SidebarLogo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center group-data-[collapsible=icon]:px-0 transition-[padding] duration-200 ease-in-out">
      <Logo />
      {/* Show the logo text only when the sidebar is expanded */}
      {state === `expanded` && (
        <span className="font-jetbrains ml-3 font-bold text-[22px] tracking-[-0.5px] text-[color:var(--color-primary,_#6366F1)]">
          Zenithly
        </span>
      )}
    </div>
  );
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [tab, setTab] = useTab();
  console.log("TAB:", tab);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 ml-[-8px] justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {[APP_SIDEBAR_DATA.navMain].map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/65">
              {group.icon && (
                <group.icon
                  className="text-muted-foreground/65 mr-2"
                  size={22}
                  aria-hidden="true"
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
                      className="group/menu-button group-data-[collapsible=icon]:px-[5px]! font-medium gap-3 h-9 [&>svg]:size-auto"
                      tooltip={item.title}
                      isActive={tab === item.tab}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 bg-transparent border-0 p-0 m-0 text-left"
                        onClick={() => setTab(item.tab)}
                      >
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
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
  );
}
