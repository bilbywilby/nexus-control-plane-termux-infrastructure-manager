import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { SnapshotsView } from '@/components/dashboard/SnapshotsView';
import { SkillsView } from '@/components/dashboard/SkillsView';
import { ResearchView } from '@/components/dashboard/ResearchView';
import { TerminalWidget } from '@/components/dashboard/TerminalWidget';
import { AuditLogView } from '@/components/dashboard/AuditLogView';
import { ReportingView } from '@/components/dashboard/ReportingView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { LayoutDashboard, Database, Cpu, Terminal, ShieldCheck, Brain, WifiOff, ScrollText, FileBarChart } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { useNetwork } from '@/hooks/use-network';
import { cn } from '@/lib/utils';
export function HomePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTermuxMode, setIsTermuxMode] = useState(true);
  const { isOnline } = useNetwork();
  return (
    <AppLayout className={cn("bg-zinc-950 text-zinc-100 transition-all duration-700", !isOnline && "grayscale-[0.3]")}>
      {!isOnline && (
        <div className="bg-amber-600 text-white text-[10px] font-mono py-1 px-4 flex items-center justify-center gap-2 animate-pulse sticky top-0 z-50">
          <WifiOff className="w-3 h-3" /> DEGRADED_MODE_ACTIVE // PERSISTENCE_LAYER_CACHED // OFFLINE
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 lg:py-10">
          <header className={cn(
            "mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 transition-colors",
            isOnline ? "border-emerald-500/10 shadow-[0_4px_30px_-10px_rgba(16,185,129,0.05)]" : "border-amber-500/10"
          )}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/80">Infrastructure Verified</span>
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Nexus Control Plane</h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground text-[11px] font-mono">
                  Node ID: <span className="text-cyan-400 font-bold">{isTermuxMode ? 'TERMUX_ALPHA_V2' : 'DESKTOP_NODE_01'}</span>
                </p>
                <div className="flex items-center gap-2 w-32">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Roadmap: 75%</span>
                  <Progress value={75} className="h-1 bg-zinc-900" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900 border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Termux</span>
                <Switch checked={isTermuxMode} onCheckedChange={setIsTermuxMode} />
              </div>
              <div className={cn(
                "flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all",
                isOnline ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                <span className="text-[10px] font-mono uppercase tracking-tighter">{isOnline ? 'System Online' : 'Degraded Mode'}</span>
              </div>
            </div>
          </header>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="bg-zinc-900 border-zinc-800 shrink-0 p-1">
                <TabsTrigger value="overview" className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </TabsTrigger>
                <TabsTrigger value="snapshots" className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Database className="w-3.5 h-3.5" /> Snapshots
                </TabsTrigger>
                <TabsTrigger value="skills" className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Cpu className="w-3.5 h-3.5" /> Skills
                </TabsTrigger>
                <TabsTrigger value="audit" className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <ScrollText className="w-3.5 h-3.5" /> Audit
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <FileBarChart className="w-3.5 h-3.5" /> Analytics
                </TabsTrigger>
                <TabsTrigger value="research" className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  <Brain className="w-3.5 h-3.5" /> Research
                </TabsTrigger>
                <TabsTrigger value="logs" className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Terminal className="w-3.5 h-3.5" /> Shell
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="mt-0 outline-none"><OverviewView /></TabsContent>
            <TabsContent value="snapshots" className="mt-0 outline-none"><SnapshotsView /></TabsContent>
            <TabsContent value="skills" className="mt-0 outline-none"><SkillsView /></TabsContent>
            <TabsContent value="audit" className="mt-0 outline-none"><AuditLogView /></TabsContent>
            <TabsContent value="reports" className="mt-0 outline-none"><ReportingView /></TabsContent>
            <TabsContent value="research" className="mt-0 outline-none"><ResearchView /></TabsContent>
            <TabsContent value="logs" className="mt-0 outline-none"><TerminalWidget /></TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster richColors theme="dark" />
      <footer className="mt-auto py-8 border-t border-white/5 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
            NEXUS_OS // BUILD_GATE_VERIFIED // RL_772 // FAULT_TOLERANCE_V3_ACTIVE
            <br />
            <span className="text-zinc-700">INFRA_ROADMAP_STAGE: 3 [SKILL_COMPILATION]</span>
          </p>
          <p className="text-[9px] text-zinc-600 font-mono italic">
            Note: AI request limits apply across all user apps. System maintains local buffer for offline resilience.
          </p>
        </div>
      </footer>
    </AppLayout>
  );
}