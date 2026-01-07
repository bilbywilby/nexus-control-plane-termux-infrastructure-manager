import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch, GitMerge, GitCommit, CheckCircle2, AlertCircle, RefreshCw, Layers, Terminal, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
const workflowSteps = [
  { id: 'branch', title: 'Local Feature', status: 'completed', desc: 'Nexus_Core_v2-stable' },
  { id: 'validation', title: 'QA Validation', status: 'processing', desc: 'Running gate_v3 test suite' },
  { id: 'merge', title: 'Mainline Sync', status: 'pending', desc: 'Awaiting PR approval' }
];
export function WorkflowView() {
  const [isSyncing, setIsSyncing] = useState(false);
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Git workspace synchronized with remote origin.");
    }, 2000);
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <GitBranch className="h-8 w-8 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Git Superuser Workflow</h2>
            <div className="flex items-center gap-3">
              <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 font-mono text-[10px]">HEAD: feature/nexus-automation</Badge>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Last Commit: 8f2c3d4e</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="bg-zinc-900 border-white/10 text-xs font-mono">
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> : <RefreshCw className="w-3.5 h-3.5 mr-2" />}
            SYNC_REPO
          </Button>
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs">
            CREATE_PR
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader className="border-b border-white/5 py-4">
              <CardTitle className="text-xs font-mono uppercase text-zinc-500">Post-Validation QA Suite</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { name: 'gate_syntax_integrity', status: 'pass', latency: '12ms' },
                { name: 'skill_regex_matching', status: 'pass', latency: '4ms' },
                { name: 'storage_io_bounds', status: 'fail', latency: '142ms' },
              ].map((test, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    {test.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                    <span className="text-xs font-mono text-zinc-300 uppercase">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-zinc-600">{test.latency}</span>
                    <Badge className={test.status === 'pass' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}>{test.status.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-mono text-zinc-500 hover:text-emerald-500 border border-dashed border-white/5 mt-2">
                RE-RUN_FULL_QA_SUITE
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
             <div className="p-4 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Auto-Generated Changelog</span>
                <span className="text-[10px] text-zinc-600 font-mono">v1.0.42-STABLE</span>
             </div>
             <div className="p-6 font-mono text-[11px] text-zinc-500 space-y-2">
                <div className="flex gap-2"><span className="text-emerald-500">[ADD]</span> Integrated Git Workflow module.</div>
                <div className="flex gap-2"><span className="text-cyan-500">[FIX]</span> Latency spike in snapshot integrity gate.</div>
                <div className="flex gap-2"><span className="text-yellow-500">[MOD]</span> Enhanced Skill Matrix discovery regex.</div>
             </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/5 p-6 h-full">
            <h3 className="text-xs font-mono uppercase text-zinc-500 mb-6 tracking-widest">Release Pipeline</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-zinc-800" />
              {workflowSteps.map((step, i) => (
                <div key={i} className="relative flex items-start gap-4 z-10">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                     step.status === 'completed' ? 'bg-emerald-500 border-emerald-400' :
                     step.status === 'processing' ? 'bg-zinc-900 border-cyan-500 animate-pulse' :
                     'bg-zinc-900 border-zinc-800'
                   }`}>
                     {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-zinc-700" />}
                   </div>
                   <div>
                      <p className={`text-xs font-bold uppercase ${step.status === 'completed' ? 'text-zinc-100' : 'text-zinc-500'}`}>{step.title}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{step.desc}</p>
                   </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
               <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-mono text-emerald-500 uppercase">Release Summary</span>
               </div>
               <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                  Infrastructure meets 94.2% stability criteria. Recommended for Workers deployment.
               </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}