import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { SnapshotsView } from '@/components/dashboard/SnapshotsView';
import { SkillsView } from '@/components/dashboard/SkillsView';
import { ResearchView } from '@/components/dashboard/ResearchView';
import { TerminalWidget } from '@/components/dashboard/TerminalWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { LayoutDashboard, Database, Cpu, Terminal, ShieldCheck, Zap, Brain, Globe, WifiOff, AlertTriangle } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { useNetwork } from '@/hooks/use-network';
export function HomePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTermuxMode, setIsTermuxMode] = useState(true);
  const { isOnline } = useNetwork();
  return (
    <AppLayout className="bg-zinc-950 text-zinc-100">
      {!isOnline && (
        <div className="bg-amber-600 text-white text-[10px] font-mono py-1 px-4 flex items-center justify-center gap-2 animate-pulse">
          <WifiOff className="w-3 h-3" /> DEGRADED_MODE_ACTIVE // PERSISTENCE_LAYER_CACHED // OFFLINE
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 lg:py-10">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-2xs font-mono uppercase tracking-widest text-emerald-500/80">Infrastructure Verified</span>
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Nexus Control Plane</h1>
              <p className="text-muted-foreground text-sm font-mono mt-1">
                Node ID: <span className="text-cyan-400 font-bold">{isTermuxMode ? 'TERMUX_ALPHA_V2' : 'DESKTOP_NODE_01'}</span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900 border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Termux Mode</span>
                <Switch checked={isTermuxMode} onCheckedChange={setIsTermuxMode} />
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border",
                  isOnline ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                  <span className="text-xs font-mono uppercase">{isOnline ? 'System Online' : 'Local Only'}</span>
                </div>
              </div>
            </div>
          </header>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="bg-zinc-900 border-zinc-800 shrink-0">
                <TabsTrigger value="overview" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="snapshots" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Database className="w-4 h-4" /> Snapshots
                </TabsTrigger>
                <TabsTrigger value="skills" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Cpu className="w-4 h-4" /> Skills
                </TabsTrigger>
                <TabsTrigger value="research" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  <Brain className="w-4 h-4" /> Research
                </TabsTrigger>
                <TabsTrigger value="logs" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Terminal className="w-4 h-4" /> Console
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="mt-0 outline-none">
              <OverviewView />
            </TabsContent>
            <TabsContent value="snapshots" className="mt-0 outline-none">
              <SnapshotsView />
            </TabsContent>
            <TabsContent value="skills" className="mt-0 outline-none">
              <SkillsView />
            </TabsContent>
            <TabsContent value="research" className="mt-0 outline-none">
              <ResearchView />
            </TabsContent>
            <TabsContent value="logs" className="mt-0 outline-none">
              <TerminalWidget />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster richColors theme="dark" />
      <footer className="mt-auto py-6 border-t border-white/5 text-center px-4">
        <p className="text-[10px] text-muted-foreground font-mono max-w-2xl mx-auto">
          NEXUS_OS // BUILD_GATE_VERIFIED // RL_772 // FAULT_TOLERANCE_V3_ACTIVE
          <br />
          Note: AI request limits apply across all user apps. System maintains local cache for offline resilience.
        </p>
      </footer>
    </AppLayout>
  );
}