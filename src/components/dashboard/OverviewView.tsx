import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Database, Zap, Activity, RefreshCw, Layers, Server, Terminal, AlertTriangle, Check, Wifi, Cloud, Bot, Timer } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { chatService } from '@/lib/chat';
import type { ChatState } from '../../../worker/types';
export function OverviewView() {
  const [state, setState] = useState<ChatState | null>(null);
  useEffect(() => {
    const fetchState = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setState(res.data);
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);
  const chartData = state?.reporting.uptimeTrend.map((val, i) => ({
    name: `Node ${i}`,
    latency: Math.floor(val * 0.8),
  })) || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> Infrastructure Dashboard
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <Timer className="w-3 h-3 text-violet-500" />
            <span className="text-[9px] font-mono text-violet-500 font-bold uppercase tracking-tighter">
              Daemon: {state?.faultTolerance.daemonLastRun ? new Date(state.faultTolerance.daemonLastRun).toLocaleTimeString() : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-tighter">
              {state?.alerts.length || 0} Alerts
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">MCP Connectivity</span>
              <Cloud className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="flex flex-col gap-1">
              {state?.mcpServers.map(mcp => (
                <div key={mcp.id} className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-mono truncate mr-2">{mcp.name}</span>
                  <Badge variant="outline" className="text-[8px] h-3 px-1 border-emerald-500/20 text-emerald-500">{mcp.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Daemon Health</span>
              <Bot className="w-4 h-4 text-violet-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{state?.reporting.daemonSuccessRate}%</h3>
              <p className="text-[9px] text-zinc-500 font-mono">AUTOMATED_MAINTENANCE_OK</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">CI Artifacts</span>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{state?.workflow.artifacts.length || 0}</h3>
              <p className="text-[9px] text-zinc-500 font-mono">GH_ACTIONS_READY</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">MCP Telemetry</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{state?.reporting.mcpToolCalls || 0}</h3>
              <p className="text-[9px] text-zinc-500 font-mono">TOOL_COMPLEXITY_NOMINAL</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5">
           <CardHeader className="bg-zinc-900/40 border-b border-white/5">
             <CardTitle className="text-xs font-mono uppercase text-zinc-400">Node Latency performance</CardTitle>
           </CardHeader>
           <CardContent className="h-[300px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#3f3f46" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="latency" stroke="#10b981" fill="url(#colorLat)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>
        <div className="space-y-6">
           <Card className="bg-emerald-500/5 border border-emerald-500/10 p-5">
              <h4 className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest mb-4">Self-Healing Trail</h4>
              <div className="space-y-4">
                 {state?.auditLogs.filter(l => l.level === 'Recovery').slice(0, 3).map((log, i) => (
                    <div key={i} className="space-y-1 pl-4 border-l border-emerald-500/20">
                       <p className="text-[10px] text-zinc-300 font-bold">{log.message}</p>
                       <p className="text-[9px] text-emerald-600 font-mono italic">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                 ))}
              </div>
           </Card>
           <Card className="bg-violet-500/5 border border-violet-500/10 p-5">
              <h4 className="text-[10px] font-mono text-violet-500 uppercase font-bold tracking-widest mb-4">Daemon Logs</h4>
              <div className="space-y-4">
                 {state?.auditLogs.filter(l => l.level === 'Daemon').slice(0, 3).map((log, i) => (
                    <div key={i} className="space-y-1 pl-4 border-l border-violet-500/20">
                       <p className="text-[10px] text-zinc-300 font-bold">{log.message}</p>
                       <p className="text-[9px] text-violet-400 font-mono italic">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}