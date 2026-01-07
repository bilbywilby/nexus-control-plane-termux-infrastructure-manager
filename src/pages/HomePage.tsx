import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { SnapshotsView } from '@/components/dashboard/SnapshotsView';
import { SkillsView } from '@/components/dashboard/SkillsView';
import { ResearchView } from '@/components/dashboard/ResearchView';
import { TerminalWidget } from '@/components/dashboard/TerminalWidget';
import { AuditLogView } from '@/components/dashboard/AuditLogView';
import { ReportingView } from '@/components/dashboard/ReportingView';
import { WorkflowView } from '@/components/dashboard/WorkflowView';
import { DocumentationView } from '@/components/dashboard/DocumentationView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { LayoutDashboard, Database, Cpu, Terminal, ShieldCheck, Brain, WifiOff, ScrollText, FileBarChart, GitBranch, BookOpen, Info } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { useNetwork } from '@/hooks/use-network';
import { chatService } from '@/lib/chat';
import { cn } from '@/lib/utils';
export function HomePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTermuxMode, setIsTermuxMode] = useState(true);
  const [roadmapProgress, setRoadmapProgress] = useState(88);
  const { isOnline } = useNetwork();
  useEffect(() => {
    const fetchProgress = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data?.roadmap) {
        const current = res.data.roadmap.find(r => r.status === 'current');
        if (current) setRoadmapProgress(current.progress);
      }
    };
    fetchProgress();
  }, []);
  const nodeLabel = isTermuxMode ? 'TERMUX_ALPHA_V2' : 'DESKTOP_NODE_01';
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
              <h1 className="text-3xl font-display font-bold tracking-tight text-white">Nexus Control Plane</h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground text-[11px] font-mono">
                  Node ID: <span className="text-cyan-400 font-bold">{nodeLabel}</span>
                </p>
                <div className="flex items-center gap-2 w-32">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Roadmap: {roadmapProgress}%</span>
                  <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${roadmapProgress}%` }}
                    />
                  </div>
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
            <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
              <TabsList className="bg-transparent border-none shrink-0 p-1 gap-1">
                {[
                  { value: 'overview', icon: LayoutDashboard, label: 'Overview' },
                  { value: 'workflow', icon: GitBranch, label: 'Workflow' },
                  { value: 'snapshots', icon: Database, label: 'Registry' },
                  { value: 'skills', icon: Cpu, label: 'Skill Matrix' },
                  { value: 'docs', icon: BookOpen, label: 'Documentation' },
                  { value: 'audit', icon: ScrollText, label: 'Audit' },
                  { value: 'reports', icon: FileBarChart, label: 'Analytics' },
                  { value: 'research', icon: Brain, label: 'Research' },
                  { value: 'logs', icon: Terminal, label: 'Shell' },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="gap-2 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-500 border border-transparent data-[state=active]:border-emerald-500/20 px-4 py-2"
                  >
                    <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="mt-0 outline-none focus-visible:ring-0 min-h-[600px]">
              {activeTab === 'overview' && <OverviewView />}
              {activeTab === 'workflow' && <WorkflowView />}
              {activeTab === 'snapshots' && <SnapshotsView />}
              {activeTab === 'skills' && <SkillsView />}
              {activeTab === 'docs' && <DocumentationView />}
              {activeTab === 'audit' && <AuditLogView />}
              {activeTab === 'reports' && <ReportingView />}
              {activeTab === 'research' && <ResearchView />}
              {activeTab === 'logs' && <TerminalWidget />}
            </div>
          </Tabs>
        </div>
      </div>
      <Toaster richColors theme="dark" />
      <footer className="mt-auto py-12 border-t border-white/5 text-center px-4 bg-zinc-950/50">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-2 text-amber-500">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">AI Service Disclosure</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed max-w-xl">
              Nexus utilizes distributed LLM services for infrastructure synthesis. Please note there is a strictly enforced limit on the number of requests that can be made to the AI servers across all user instances in any given time window.
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
            NEXUS_OS // BUILD_GATE_VERIFIED // RL_772 // PLUGIN_LOADER_V2_ACTIVE
            <br />
            <span className="text-zinc-700">INFRA_ROADMAP_STAGE: 7 [FINAL_POLISH_STABLE] // {new Date().getFullYear()} CORE_LOGS</span>
          </p>
        </div>
      </footer>
    </AppLayout>
  );
}