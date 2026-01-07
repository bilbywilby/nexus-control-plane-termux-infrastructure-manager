import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, Github, Play, CheckCircle2, RefreshCw, FileCode, Layers, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { WorkflowState, InfrastructureFile } from '../../../worker/types';
export function WorkflowView() {
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [infraFiles, setInfraFiles] = useState<InfrastructureFile[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setWorkflow(res.data.workflow);
        setInfraFiles(res.data.infraFiles.filter(f => f.path.startsWith('.github/workflows/')));
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleRunWorkflow = async (name: string) => {
    setIsRunning(true);
    toast.info(`Triggering GitHub Action: ${name}...`);
    const res = await chatService.triggerWorkflowAction(name);
    if (res.success) {
      toast.success("Action simulation initiated.");
    }
    setTimeout(() => setIsRunning(false), 3000);
  };
  return (
    <div className="space-y-8 animate-fade-in p-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Github className="w-5 h-5 text-zinc-100" /> CI/CD Blueprints
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Simulated GitHub Actions Infrastructure</p>
        </div>
        <Badge className="bg-cyan-500/10 text-cyan-500 border-none font-mono">NODE_RUNNER_V4</Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Workflow Specifications</h3>
          {infraFiles.map((file) => (
            <Card key={file.path} className="bg-zinc-900/50 border-white/5 p-5 flex items-center justify-between hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-800 rounded">
                  <FileCode className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{file.path.split('/').pop()}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase">Trigger: on pull_request</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleRunWorkflow(file.path)} 
                disabled={isRunning || workflow?.pipelineStatus === 'ActionRunning'}
                className="bg-zinc-100 text-black hover:bg-white text-[10px] font-mono h-8"
              >
                {workflow?.pipelineStatus === 'ActionRunning' ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Play className="w-3 h-3 mr-2" />}
                RUN_SIM
              </Button>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Pipeline Visualization</h3>
          <Card className="bg-black/40 border-white/5 p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="flex items-center gap-4">
              {[
                { label: 'Static Analysis', status: 'completed' },
                { label: 'Security Scan', status: 'completed' },
                { label: 'Deployment', status: isRunning ? 'processing' : 'pending' }
              ].map((stage, i, arr) => (
                <React.Fragment key={stage.label}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${stage.status === 'completed' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : stage.status === 'processing' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 animate-pulse' : 'border-zinc-800 text-zinc-800'}`}>
                      {stage.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                    </div>
                    <span className={`text-[9px] font-mono uppercase font-bold ${stage.status !== 'pending' ? 'text-zinc-300' : 'text-zinc-600'}`}>{stage.label}</span>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-zinc-800" />}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <Card className="bg-zinc-900/50 border-white/5">
        <CardHeader className="py-4 border-b border-white/5">
          <CardTitle className="text-xs font-mono uppercase text-zinc-500">Live Infrastructure Feedback</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-40 bg-black/60 font-mono text-[10px] p-4 text-zinc-500 space-y-1">
             {workflow?.scriptLogs.slice(-10).map((log, i) => (
               <div key={i} className="flex gap-2">
                 <span className="text-zinc-800">[{i}]</span>
                 <span className={log.includes('GATE_PASS') ? 'text-emerald-500' : ''}>{log}</span>
               </div>
             ))}
             {(!workflow?.scriptLogs.length) && <p className="italic">No telemetry from latest action.</p>}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}