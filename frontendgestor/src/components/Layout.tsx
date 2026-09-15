import type React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, CreditCard, LayoutDashboard, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

type Props = { children: React.ReactNode };

const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Transações", path: "/transactions", icon: CreditCard },
  { label: "Carteiras", path: "/wallets", icon: Wallet },
];

export default function Layout({ children }: Props) {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Controlfy</span>
          </div>
        </div>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map(({ label, path, icon: Icon }) => (
                  <SidebarMenuItem key={path}>
                    <SidebarMenuButton
                      className="h-10"
                      isActive={pathname === path}
                      onClick={() => navigate(path)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200 p-3">
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600 hover:text-red-600" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-slate-50">{children}</SidebarInset>
    </SidebarProvider>
  );
}
