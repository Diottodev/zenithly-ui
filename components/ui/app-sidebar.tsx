"use client";

// import Link from "next/link";
import * as React from "react";

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
} from "$/components/ui/sidebar";
import {
  RiCalendar2Line,
  RiKey2Line,
  RiListCheck3,
  RiMailLine,
  RiSlowDownLine,
  RiTaskLine,
} from "@remixicon/react";

export const data = {
  user: {
    name: "Nicolas Diotto",
    email: "nicodiottodev@gmail.com",
    avatar:
      "https://avatars.githubusercontent.com/u/89016052?s=400&u=638d0a351e2a12409358ae553803b2f42e286411&v=4",
  },
  navMain: [
    {
      title: "funcionalidades",
      icon: RiSlowDownLine,
      url: "#emails",
      items: [
        {
          title: "Emails",
          singular: "Email",
          article: "o",
          url: "#emails",
          icon: RiMailLine,
        },
        {
          title: "Agenda",
          singular: "Evento",
          article: "o",
          url: "#agenda",
          icon: RiCalendar2Line,
        },
        {
          title: "Anotações",
          singular: "Anotação",
          article: "a",
          url: "#notes",
          icon: RiListCheck3,
        },
        {
          title: "Tarefas",
          singular: "Tarefa",
          article: "a",
          url: "#tasks",
          icon: RiTaskLine,
        },
        {
          title: "Minhas Senhas",
          singular: "Senha",
          article: "a",
          url: "#passwords",
          icon: RiKey2Line,
        },
      ],
    },
  ],
};

function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:px-0 transition-[padding] duration-200 ease-in-out">
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
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "-0.5px",
          color: "var(--color-primary, #6366F1)",
        }}
      >
        Zenithly
      </span>
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeTab, setActiveTab] = React.useState<string | undefined>(
    undefined
  );
  React.useEffect(() => {
    let hash = window.location.hash || "#emails";
    if (
      (window.location.pathname === "/" || window.location.pathname === "") &&
      !window.location.hash
    ) {
      window.location.hash = "#emails";
      hash = "#emails";
    }
    setActiveTab(hash);
    const onHashChange = () => setActiveTab(window.location.hash || "#emails");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {data.navMain.map((group) => (
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
                      isActive={activeTab === item.url}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 bg-transparent border-0 p-0 m-0 text-left"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.location.hash = item.url;
                          }
                          setActiveTab(item.url);
                        }}
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
