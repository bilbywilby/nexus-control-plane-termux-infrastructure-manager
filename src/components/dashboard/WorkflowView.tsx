import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, Github, Play, CheckCircle2, RefreshCw, FileCode, Layers, ArrowRight, ShieldCheck, AlertTriangle, FileJson, Wand2, Download, Terminal, Link, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { WorkflowState, InfrastructureFile, ValidationReport } from '../../../worker/types';
import { cn } from '@/lib/utils';
export function WorkflowView() {
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showJson, setShowJson] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setWorkflow(res.data.workflow);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleRunValidation = async () => {
    setIsRunning(true);
    toast.info("Triggering GitHub Action Pipeline...");
    const res = await chatService.runValidationV3({ fix: false });
    if (res.success) toast.success("CI/CD run complete.");
    setTimeout(() => setIsRunning(false), 2000);
  };
  const report = workflow?.lastValidationReport;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Github className="w-5 h-5 text-white" /> CI/CD & Actions Lifecycle
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Expanded Pipeline: PR_Review // DEP_AUDIT // DOCS</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded font-mono text-[9px] text-emerald-500">
            <Globe className="w-3 h-3" /> WEBHOOK_ACTIVE
          </div>
          <Button onClick={handleRunValidation} disabled={isRunning} className="bg-zinc-100 text-zinc-950 hover:bg-zinc-300 font-mono text-xs">
            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Play className="w-3 h-3 mr-2" />}
            RUN_CI_PIPELINE
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-mono uppercase text-zinc-500">Active Workflow: ci.yml</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { id: 'review', name: 'Claude PR Review', status: 'Completed', icon: ShieldCheck, time: '2m ago' },
                  { id: 'audit', name: 'Dependency Security Audit', status: 'Completed', icon: AlertTriangle, time: '4m ago' },
                  { id: 'docs', name: 'Auto-Generate Documentation', status: 'In_Progress', icon: RefreshCw, time: 'Now' },
                  { id: 'deploy', name: 'Infrastructure Validation', status: 'Pending', icon: Play, time: 'Scheduled' }
                ].map((step) => (
                  <div key={step.id} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg bg-zinc-800", step.status === 'In_Progress' && 'animate-spin')}>
                        <step.icon className={cn("w-4 h-4",
                          step.status === 'Completed' ? 'text-emerald-500' :
                          step.status === 'In_Progress' ? 'text-cyan-500' : 'text-zinc-500'
                        )} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{step.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase">{step.time}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-mono",
                      step.status === 'Completed' ? 'border-emerald-500/20 text-emerald-500' :
                      step.status === 'In_Progress' ? 'border-cyan-500/20 text-cyan-500' : 'border-zinc-500/20 text-zinc-500'
                    )}>
                      {step.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {report && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Build Telemetry</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowJson(!showJson)} className="text-[9px] font-mono h-6">
                  {showJson ? 'HIDE_RAW' : 'VIEW_RAW'}
                </Button>
              </div>
              {showJson ? (
                <Card className="bg-black/90 border-white/5 p-4">
                  <pre className="text-[10px] text-emerald-500 overflow-x-auto">
                    {JSON.stringify(report, null, 2)}
                  </pre>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {report?.checks?.slice(0, 4).map(check => (
                    <div key={check.id} className="p-4 rounded-lg bg-zinc-900/50 border border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase">{check.id}</span>
                        <span className="text-[11px] text-zinc-300 font-bold">{check.status}</span>
                      </div>
                      <CheckCircle2 className={cn("w-4 h-4", check.status === 'Pass' ? 'text-emerald-500' : 'text-amber-500')} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-mono uppercase text-zinc-500">Pipeline Artifacts</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {workflow?.artifacts?.map((art, i) => (
                    <div key={i} className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <FileCode className="w-4 h-4 text-zinc-500" />
                        <span className="text-[11px] font-mono text-zinc-300 truncate max-w-[120px]">{art}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="w-3 h-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Link className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  )) || []}
                  {(!workflow?.artifacts || workflow.artifacts.length === 0) && <p className="text-[10px] text-zinc-600 italic text-center py-10">No artifacts found for current run.</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="bg-violet-500/5 border border-violet-500/10 p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-violet-500" />
              <h4 className="text-[10px] font-mono text-violet-500 uppercase font-bold tracking-widest">Daemon Status</h4>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed bg-black/40 p-3 rounded border border-white/5">
              [INFO] Scheduled sweep in: 04:12:44<br/>
              [OK] Last run status: SUCCESS (0 exit code)<br/>
              [OK] Snapshots pruned: 12
            </p>
            <Button variant="outline" className="w-full text-[9px] font-mono h-8 border-violet-500/20 text-violet-400 hover:bg-violet-500/10">
              TRIGGER_MANUAL_SWEEP
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}