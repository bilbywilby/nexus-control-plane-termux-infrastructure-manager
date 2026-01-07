import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { GitBranch, GitMerge, GitCommit, CheckCircle2, AlertCircle, RefreshCw, Layers, Terminal, ChevronRight, Github, RotateCcw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { WorkflowState } from '../../../worker/types';
export function WorkflowView() {
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchWorkflow = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data?.workflow) {
        setWorkflow(res.data.workflow);
      }
    };
    fetchWorkflow();
    const interval = setInterval(fetchWorkflow, 3000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [workflow?.scriptLogs]);
  const handleAction = async (action: string, fn: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const res = await fn();
      if (res.success) {
        toast.success(`${action} initiated successfully.`);
      } else {
        toast.error(`${action} failed: ${res.error}`);
      }
    } catch (e) {
      toast.error(`${action} service unavailable.`);
    } finally {
      setIsLoading(false);
    }
  };
  const isBusy = workflow?.pipelineStatus !== 'Idle' || isLoading;
  const getStepStatus = (id: string) => {
    if (!workflow) return 'pending';
    if (workflow.pipelineStatus === 'Idle' && workflow.executionStep === 'Idle') return 'completed';
    const stepOrder = ['CheckingVars', 'ValidatingBuild', 'AutoFixing', 'Snapshotting', 'Pushing'];
    const currentIdx = stepOrder.indexOf(workflow.executionStep || '');
    const stepIdx = stepOrder.indexOf(id);
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'processing';
    return 'pending';
  };
  return (
    <div className="space-y-8 animate-fade-in p-4">
      <div className="flex flex-col md:flex-row items-center justify-between bg-zinc-900/40 p-6 rounded-2xl border border-white/5 gap-6">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <GitBranch className="h-8 w-8 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Git Superuser v2.2</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 font-mono text-[10px]">
                HEAD: {workflow?.currentBranch || 'main'}
              </Badge>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                ID: {workflow?.lastCommitHash || '...'}
              </span>
              {workflow?.pipelineStatus !== 'Idle' && (
                <Badge className="bg-amber-500/20 text-amber-500 animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> {workflow?.pipelineStatus.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handleAction('SUPERUSER_V2', () => chatService.triggerWorkflowAction('superuser-v2'))} 
                  disabled={isBusy}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs"
                >
                  <Zap className="w-3.5 h-3.5 mr-2" /> EXEC_SUPERUSER
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-950 border-white/10 text-[10px] font-mono">
                Full v2.2: Validate (Gate V3) -> AutoFix -> Snapshot
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button 
            onClick={() => handleAction('GITHUB_PUSH', () => chatService.deployToGithub())} 
            disabled={isBusy}
            variant="outline"
            className="bg-zinc-900 border-white/10 text-xs font-mono text-cyan-400"
          >
            <Github className="w-3.5 h-3.5 mr-2" /> DEPLOY_GH
          </Button>
          <Button 
            onClick={() => handleAction('ROLLBACK', () => chatService.executeRollback())} 
            disabled={isBusy}
            variant="destructive"
            className="text-xs font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" /> ROLLBACK_LATEST
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader className="border-b border-white/5 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-mono uppercase text-zinc-500">Infrastructure Script Output</CardTitle>
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">set -euo pipefail</span>
            </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[300px] bg-black/40">
                  <div className="p-4 font-mono text-[10px] space-y-1">
                    {workflow?.scriptLogs.map((log, i) => (
                      <div key={i} className="flex gap-2 text-zinc-400 group">
                        <span className="text-zinc-700 shrink-0">[{i}]</span>
                        <span className={log.includes('GATE_PASS') ? 'text-emerald-500' : log.includes('WARN') ? 'text-amber-500' : ''}>{log}</span>
                      </div>
                    ))}
                    {workflow?.scriptLogs.length === 0 && <p className="text-zinc-600 italic">No script executions in current session buffer.</p>}
                    <div ref={logEndRef} />
                  </div>
               </ScrollArea>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 p-6">
            <h3 className="text-xs font-mono uppercase text-zinc-500 mb-4 tracking-widest">Active Pipeline Steps</h3>
            <div className="space-y-3">
              {[
                { id: 'CheckingVars', label: 'ENV_VARS_CHECK', desc: 'Verifying $PROJECTS_DIR and $BIN_DIR' },
                { id: 'ValidatingBuild', label: 'VALIDATE_BUILD_GATE', desc: 'Triple-path build integrity scan' },
                { id: 'AutoFixing', label: 'AUTO_FIX_LINT', desc: 'Synthesizing fixes for deferrable warnings' },
                { id: 'Snapshotting', label: 'ROLLING_SNAPSHOT', desc: 'Creating tar.gz archive to registry' },
                { id: 'Pushing', label: 'GITHUB_DEPLOY', desc: 'Pushing validated state to remote origin' },
              ].map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      {status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                       status === 'processing' ? <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" /> :
                       <div className="w-4 h-4 rounded-full border border-zinc-700" />}
                      <div>
                        <span className="text-xs font-mono text-zinc-300 uppercase block">{step.label}</span>
                        <span className="text-[9px] text-zinc-600 font-mono">{step.desc}</span>
                      </div>
                    </div>
                    <Badge className={status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : status === 'processing' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-zinc-800 text-zinc-500'}>
                      {status.toUpperCase()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/5 p-6 h-full">
            <h3 className="text-xs font-mono uppercase text-zinc-500 mb-6 tracking-widest">Last Infrastructure Events</h3>
            <div className="space-y-6">
              {workflow?.lastGithubPush && (
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-[10px] uppercase">
                    <Github className="w-3 h-3" /> Last GH Deploy
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">Successfully pushed main to origin</p>
                  <p className="text-[9px] text-zinc-500 font-mono">{new Date(workflow.lastGithubPush).toLocaleString()}</p>
                </div>
              )}
              {workflow?.lastRollback && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase">
                    <RotateCcw className="w-3 h-3" /> System Rollback
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">Restored state to {workflow.lastRollback.snapshotId}</p>
                  <p className="text-[9px] text-zinc-500 font-mono">{new Date(workflow.lastRollback.timestamp).toLocaleString()}</p>
                </div>
              )}
              {!workflow?.lastGithubPush && !workflow?.lastRollback && (
                <div className="py-10 text-center text-zinc-600">
                  <Layers className="w-10 h-10 mx-auto mb-3 opacity-10" />
                  <p className="text-[10px] font-mono uppercase">No recent deployment <br/> events recorded.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}