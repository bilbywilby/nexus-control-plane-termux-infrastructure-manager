import React from "react";
import {
  LayoutDashboard,
  Database,
  Cpu,
  Terminal,
  Settings,
  Activity,
  Server,
  ScrollText,
  FileBarChart,
  LifeBuoy,
  ShieldCheck,
  GitBranch,
  BookOpen,
  Bell
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
            <span className="text-[10px] font-mono text-emerald-500/70 leading-none uppercase tracking-tighter">V 1.0.42-STABLE</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono mb-2">Operations</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Workflow', icon: GitBranch },
              { label: 'Registry', icon: Database },
              { label: 'Skill Matrix', icon: Cpu },
              { label: 'Documentation', icon: BookOpen },
              { label: 'Audit Trail', icon: ScrollText },
              { label: 'Analytics', icon: FileBarChart },
              { label: 'Shell Console', icon: Terminal },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton className="hover:bg-zinc-900 transition-colors py-6">
                  <item.icon className="h-5 w-5 mr-2 text-zinc-400" />
                  <span className="font-mono text-xs uppercase">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono mb-2">Runtime Context</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem className="px-3 py-2 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono">
                   <span className="text-zinc-500">GIT_BRANCH:</span>
                   <span className="text-cyan-500">feature/nexus-7</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                   <span className="text-zinc-500">ACTIVE_ALERTS:</span>
                   <span className="text-red-500 font-bold flex items-center gap-1">2 <Bell className="w-2.5 h-2.5" /></span>
                </div>
                <div className="space-y-1 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase">DISK_USAGE</span>
                    <span className="text-[9px] font-mono text-red-500">88%</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[88%] transition-all duration-500" />
                  </div>
                </div>
             </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 p-4 bg-zinc-950/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500/80 uppercase font-bold tracking-tighter">Gateway_Secure</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-60" />
        </div>
        <div className="flex items-center justify-between text-zinc-600">
          <Settings className="w-3.5 h-3.5 hover:text-zinc-300 cursor-pointer" />
          <LifeBuoy className="w-3.5 h-3.5 hover:text-zinc-300 cursor-pointer" />
          <Activity className="w-3.5 h-3.5 hover:text-zinc-300 cursor-pointer" />
        </div>
        <div className="mt-4 pt-2 border-t border-white/5 text-center">
          <span className="text-[8px] font-mono text-zinc-700 hover:text-zinc-500 cursor-pointer uppercase tracking-widest">Node ID: RGC0_ALPHA_V7</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}