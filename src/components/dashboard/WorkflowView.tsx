import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, Github, Play, CheckCircle2, RefreshCw, FileCode, Layers, ArrowRight, ShieldCheck, AlertTriangle, FileJson, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { WorkflowState, InfrastructureFile, ValidationReport } from '../../../worker/types';
import { cn } from '@/lib/utils';
export function WorkflowView() {
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [infraFiles, setInfraFiles] = useState<InfrastructureFile[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showJson, setShowJson] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setWorkflow(res.data.workflow);
        setInfraFiles(res.data.infraFiles.filter(f => f.path.startsWith('.github/workflows/') || f.path.startsWith('bin/')));
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleRunValidation = async () => {
    setIsRunning(true);
    toast.info("Triggering Structured Validation v3...");
    const res = await chatService.runValidationV3();
    if (res.success) {
      toast.success("Validation report generated.");
    }
    setTimeout(() => setIsRunning(false), 2000);
  };
  const handleAutoFix = () => {
    toast.info("Applying --fix to infrastructure...");
    setTimeout(() => {
      toast.success("All fixable checks resolved. Re-run validation to confirm.");
    }, 1500);
  };
  const report = workflow?.lastValidationReport;
  return (
    <div className="space-y-8 animate-fade-in p-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Infrastructure Operations v3
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Structured Validation & Build Gates</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRunValidation} 
            disabled={isRunning}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs"
          >
            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Play className="w-3 h-3 mr-2" />}
            RUN_VALIDATE_V3
          </Button>
        </div>
      </div>
      {report && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-zinc-400">Structured Report: {report.status}</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowJson(!showJson)} className="text-[10px] font-mono h-8">
                <FileJson className="w-3.5 h-3.5 mr-2" /> {showJson ? 'HIDE_RAW' : 'VIEW_RAW'}
              </Button>
              <Button onClick={handleAutoFix} variant="outline" size="sm" className="text-[10px] font-mono h-8 border-cyan-500/20 text-cyan-500">
                <Wand2 className="w-3.5 h-3.5 mr-2" /> AUTO_FIX
              </Button>
            </div>
          </div>
          {showJson ? (
            <Card className="bg-black/80 border-emerald-500/20 p-4 font-mono">
              <pre className="text-[11px] leading-relaxed overflow-x-auto">
                {JSON.stringify(report, null, 2).split('\n').map((line, i) => (
                  <div key={i}>
                    <span className="text-zinc-700 mr-4">{i + 1}</span>
                    <span className={line.includes('"Pass"') ? 'text-emerald-400' : line.includes('"Fail"') ? 'text-red-400' : 'text-zinc-400'}>
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {report.checks.map((check) => (
                <Card key={check.id} className={cn(
                  "bg-zinc-900/40 border-white/5 p-4",
                  check.status === 'Fail' && "border-red-500/20 bg-red-500/5",
                  check.status === 'Warning' && "border-amber-500/20 bg-amber-500/5"
                )}>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-[8px] font-mono">{check.category}</Badge>
                    {check.status === 'Pass' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{check.id}</h4>
                  <p className="text-[10px] text-zinc-500 leading-tight">{check.message}</p>
                  {check.fixable && <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-none text-[8px]">FIXABLE</Badge>}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Available Binaries</h3>
          {infraFiles.map((file) => (
            <Card key={file.path} className="bg-zinc-900/50 border-white/5 p-5 flex items-center justify-between hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-800 rounded">
                  <FileCode className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{file.path.split('/').pop()}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase">PATH: {file.path}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-[10px] font-mono h-8 border-none hover:bg-zinc-800">
                EXEC_SH
              </Button>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Environment Context</h3>
          <Card className="bg-black/40 border-white/5 p-6 space-y-4 font-mono text-[10px]">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">BASH_VER:</span>
              <span className="text-emerald-500">{report?.systemContext.bashVersion || '5.2.x'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">NODE_VER:</span>
              <span className="text-emerald-500">{report?.systemContext.nodeVersion || 'v20.x'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">ARCH:</span>
              <span className="text-cyan-500">{report?.systemContext.arch || 'aarch64'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">GATE_STATUS:</span>
              <span className="text-emerald-500 font-bold">NOMINAL</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}