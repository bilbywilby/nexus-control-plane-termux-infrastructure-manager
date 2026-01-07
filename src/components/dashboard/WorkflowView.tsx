import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch, GitMerge, GitCommit, CheckCircle2, AlertCircle, RefreshCw, Layers, Terminal, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { WorkflowState } from '../../../worker/types';
const defaultSteps = [
  { id: 'branch', title: 'Local Feature', status: 'completed', desc: 'Nexus_Core_v2-stable' },
  { id: 'validation', title: 'QA Validation', status: 'pending', desc: 'Running gate_v3 test suite' },
  { id: 'merge', title: 'Mainline Sync', status: 'pending', desc: 'Awaiting PR approval' }
];
export function WorkflowView() {
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  useEffect(() => {
    const fetchWorkflow = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data?.workflow) {
        setWorkflow(res.data.workflow);
      }
    };
    fetchWorkflow();
    const interval = setInterval(fetchWorkflow, 5000);
    return () => clearInterval(interval);
  }, []);
  const handleSync = async () => {
    setIsSyncing(true);
    const res = await chatService.triggerWorkflowAction('sync');
    if (res.success) {
      toast.success("Git workspace synchronized with remote origin.");
    }
    setIsSyncing(false);
  };
  const handleDeploy = async () => {
    const res = await chatService.triggerWorkflowAction('deploy');
    if (res.success) {
      toast.info("Production deployment sequence initiated.");
    }
  };
  const steps = defaultSteps.map(step => {
    if (step.id === 'validation' && workflow?.pipelineStatus === 'Validating') {
      return { ...step, status: 'processing' as const };
    }
    if (step.id === 'validation' && workflow?.pipelineStatus === 'Idle') {
      return { ...step, status: 'completed' as const };
    }
    return step;
  });
  return (
    <div className="space-y-8 animate-fade-in p-4">
      <div className="flex items-center justify-between bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <GitBranch className="h-8 w-8 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Git Superuser Workflow</h2>
            <div className="flex items-center gap-3">
              <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 font-mono text-[10px]">
                HEAD: {workflow?.currentBranch || 'main'}
              </Badge>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                Last Commit: {workflow?.lastCommitHash || '...'}
              </span>
              {workflow?.pipelineStatus !== 'Idle' && (
                <Badge className="bg-amber-500/20 text-amber-500 animate-pulse">{workflow?.pipelineStatus.toUpperCase()}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSync} disabled={isSyncing || workflow?.pipelineStatus !== 'Idle'} variant="outline" className="bg-zinc-900 border-white/10 text-xs font-mono">
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> : <RefreshCw className="w-3.5 h-3.5 mr-2" />}
            SYNC_REPO
          </Button>
          <Button onClick={handleDeploy} disabled={workflow?.pipelineStatus !== 'Idle'} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs">
            TRIGGER_DEPLOY
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
                { name: 'storage_io_bounds', status: workflow?.pipelineStatus === 'Validating' ? 'running' : 'pass', latency: '14ms' },
              ].map((test, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    {test.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                     test.status === 'running' ? <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" /> : 
                     <AlertCircle className="w-4 h-4 text-red-500" />}
                    <span className="text-xs font-mono text-zinc-300 uppercase">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-zinc-600">{test.latency}</span>
                    <Badge className={test.status === 'pass' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-500'}>
                      {test.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
             <div className="p-4 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Auto-Generated Changelog</span>
                <span className="text-[10px] text-zinc-600 font-mono">v{workflow?.version || '1.0.0'}</span>
             </div>
             <div className="p-6 font-mono text-[11px] text-zinc-500 space-y-2">
                {workflow?.changelog.map((log, i) => (
                  <div key={i} className="flex gap-2"><span className="text-emerald-500">[LOG]</span> {log}</div>
                ))}
             </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/5 p-6 h-full">
            <h3 className="text-xs font-mono uppercase text-zinc-500 mb-6 tracking-widest">Release Pipeline</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-zinc-800" />
              <AnimatePresence>
                {steps.map((step, i) => (
                  <motion.div 
                    key={i} 
                    layout
                    className="relative flex items-start gap-4 z-10"
                  >
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                       step.status === 'completed' ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                       step.status === 'processing' ? 'bg-zinc-900 border-cyan-500 animate-pulse' :
                       'bg-zinc-900 border-zinc-800'
                     }`}>
                       {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-zinc-700" />}
                     </div>
                     <div>
                        <p className={`text-xs font-bold uppercase ${step.status === 'completed' ? 'text-zinc-100' : 'text-zinc-500'}`}>{step.title}</p>
                        <p className="text-[10px] text-zinc-600 font-mono">{step.desc}</p>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}