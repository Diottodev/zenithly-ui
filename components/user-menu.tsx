"use client";

import { Avatar, AvatarFallback, AvatarImage } from "$/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "$/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "$/components/ui/sidebar";
import { signOut } from "$/lib/auth-client";
import { useAuth } from "$/hooks/use-auth";
import { getFirstTwoNames } from "$/utils/get-first-two-names";
import { getInitialsName } from "$/utils/get-initials-name";
import { RiMore2Line } from "@remixicon/react";
import { LogOut, Settings, User } from "lucide-react";

export function UserMenu() {
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  if (!user) return null;
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth#signin";
  };
  const initials = getInitialsName(user);
  const isName = getFirstTwoNames(user.name);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 transition-[width,height] duration-200 ease-in-out">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                <span className="truncate font-medium">{isName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <div className="size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent">
                <RiMore2Line className="size-5 opacity-40" size={20} />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem disabled className="gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-3">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="gap-3">
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
