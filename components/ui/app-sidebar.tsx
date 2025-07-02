"use client";

import { NavUser } from "$/components/ui/nav-user";
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
import { useTab } from "$/hooks/use-tab";
import { APP_SIDEBAR_DATA } from "$/utils/constants";

function SidebarLogo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center group-data-[collapsible=icon]:px-0 transition-[padding] duration-200 ease-in-out">
      <div className="group/logo inline-flex">
        <span className="sr-only">Logo</span>
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="url(#zenithly-logo-gradient)"
            stroke="url(#zenithly-logo-gradient)"
            strokeWidth="2.5"
          />
          <path
            d="M16 26 L24 14 L32 26"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="24" cy="29" r="2" fill="#fff" />
          <line
            x1="18"
            y1="34"
            x2="30"
            y2="34"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="20.5"
            y1="38"
            x2="27.5"
            y2="38"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="zenithly-logo-gradient"
              x1="10"
              x2="38"
              y1="10"
              y2="38"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--color-primary, #6366F1)" />
              <stop offset="0.7" stopColor="#A1A1AA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
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
        <NavUser user={APP_SIDEBAR_DATA.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
