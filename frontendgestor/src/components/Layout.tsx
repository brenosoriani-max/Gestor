import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { logout } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-slate-200 px-4 py-5">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Gestor</p>
              <p className="text-sm font-bold text-slate-900">Financeiro</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-10" isActive>
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton className="h-10">Relatórios</SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton className="h-10">Transações</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200 p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-600 hover:text-red-600"
            onClick={logout}
          >
            Sair
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-slate-50">{children}</SidebarInset>
    </SidebarProvider>
  );
}
