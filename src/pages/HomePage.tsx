import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { SnapshotsView } from '@/components/dashboard/SnapshotsView';
import { SkillsView } from '@/components/dashboard/SkillsView';
import { TerminalWidget } from '@/components/dashboard/TerminalWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Database, Cpu, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <AppLayout className="bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 lg:py-10">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-2xs font-mono uppercase tracking-widest text-emerald-500/80">Infrastructure Verified</span>
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Nexus Control Plane</h1>
              <p className="text-muted-foreground text-sm font-mono mt-1">Termux Node: <span className="text-cyan-400">0x-alpha-v2</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400">System Online</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-mono text-zinc-400">Latency: 24ms</span>
              </div>
            </div>
          </header>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-zinc-900 border-zinc-800">
                <TabsTrigger value="overview" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="snapshots" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Database className="w-4 h-4" /> Snapshots
                </TabsTrigger>
                <TabsTrigger value="skills" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Cpu className="w-4 h-4" /> Skills
                </TabsTrigger>
                <TabsTrigger value="logs" className="gap-2 font-mono text-xs uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Terminal className="w-4 h-4" /> Console
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
              <OverviewView />
            </TabsContent>
            <TabsContent value="snapshots" className="mt-0 focus-visible:outline-none">
              <SnapshotsView />
            </TabsContent>
            <TabsContent value="skills" className="mt-0 focus-visible:outline-none">
              <SkillsView />
            </TabsContent>
            <TabsContent value="logs" className="mt-0 focus-visible:outline-none">
              <TerminalWidget />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster richColors theme="dark" />
      <div className="fixed bottom-4 right-4 text-[10px] font-mono text-zinc-600 pointer-events-none select-none">
        NEXUS_OS // BUILD_GATE_VERIFIED // RL_772
      </div>
      <footer className="mt-auto py-6 border-t border-white/5 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Note: AI request limits apply across all user apps.
        </p>
      </footer>
    </AppLayout>
  );
}