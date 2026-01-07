import React from "react";
import { 
  LayoutDashboard, 
  Database, 
  Cpu, 
  Terminal, 
  Settings, 
  Activity, 
  ShieldAlert,
  Server
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
export function AppSidebar(): JSX.Element {
  return (
    <Sidebar className="border-r border-white/5 bg-zinc-950">
      <SidebarHeader className="border-b border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]">
            <Server className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-zinc-100">NEXUS CORE</span>
            <span className="text-[10px] font-mono text-emerald-500/70 leading-none">V 1.0.42-STABLE</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono mb-2">Operations</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-zinc-900 transition-colors py-6">
                <LayoutDashboard className="h-5 w-5 mr-2 text-zinc-400" />
                <span className="font-mono text-xs uppercase">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-zinc-900 transition-colors py-6">
                <Database className="h-5 w-5 mr-2 text-zinc-400" />
                <span className="font-mono text-xs uppercase">Registry</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-zinc-900 transition-colors py-6">
                <Cpu className="h-5 w-5 mr-2 text-zinc-400" />
                <span className="font-mono text-xs uppercase">Skill Matrix</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-zinc-900 transition-colors py-6">
                <Terminal className="h-5 w-5 mr-2 text-zinc-400" />
                <span className="font-mono text-xs uppercase">Shell Console</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono mb-2">System Health</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="px-3 py-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">DISK: 4.2GB / 10GB</span>
                  <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[42%]" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">LOAD: 12%</span>
                  <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[12%]" />
                  </div>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 p-4 bg-zinc-950/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] font-mono text-zinc-400">GATEWAY_CONNECTED</span>
        </div>
        <div className="flex items-center justify-between text-zinc-600">
          <Settings className="w-3.5 h-3.5 hover:text-zinc-300 cursor-pointer" />
          <LifeBuoy className="w-3.5 h-3.5 hover:text-zinc-300 cursor-pointer" />
          <Activity className="w-3.5 h-3.5 hover:text-zinc-300 cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
import { LifeBuoy } from "lucide-react";