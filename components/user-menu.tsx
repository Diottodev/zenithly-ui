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
import { useSession } from "$/hooks/use-auth";
import { getFirstTwoNames } from "$/utils/get-first-two-names";
import { getInitialsName } from "$/utils/get-initials-name";
import { RiMore2Line } from "@remixicon/react";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserMenu() {
  const router = useRouter();
  const { user } = useSession();
  const { isMobile } = useSidebar();
  if (!user) {
    return null;
  }
  const handleSignOut = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth/logout`, {
        method: "POST",
      });
      localStorage.removeItem("auth_token");
      toast.success("Logout realizado com sucesso!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Erro ao fazer logout", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };
  const initials = getInitialsName(user);
  const isName = getFirstTwoNames(user.name);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="h-8 w-8 transition-[width,height] duration-200 ease-in-out">
                <AvatarImage alt={user.name || ""} src={user.image || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="ml-3 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{isName}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {user.email}
                </span>
              </div>
              <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-accent/50 in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent">
                <RiMore2Line className="size-5 opacity-40" size={20} />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuItem className="gap-3" disabled>
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3" disabled>
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
