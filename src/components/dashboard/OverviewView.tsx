import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Database, Zap, Activity, RefreshCw, Layers, Server, Terminal, AlertTriangle, Check, Wifi, WifiOff } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';
import { chatService } from '@/lib/chat';
import type { ChatState, AuditLog } from '../../../worker/types';
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
    latency: Math.floor(val * 0.8), // Simulated for visual
  })) || [];
  const recoveries = state?.auditLogs.filter(l => l.level === 'Recovery') || [];
  return (
    <div className="max-w-7xl mx-auto py-4 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> System Metrics & Alerts
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-tighter">
              {state?.alerts.length || 0} Active Alerts
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5 overflow-hidden">
           <CardHeader className="flex flex-row items-center justify-between bg-zinc-900/40 border-b border-white/5 pb-4">
             <CardTitle className="text-xs font-mono uppercase text-zinc-400">Node Latency Performance</CardTitle>
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
           <Card className="bg-red-500/5 border border-red-500/10 p-5 space-y-4">
              <h4 className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-widest">Active System Alerts</h4>
              <div className="space-y-3">
                 {state?.alerts.map(alert => (
                   <div key={alert.id} className={cn(
                     "p-3 rounded border",
                     alert.level === 'Critical' ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"
                   )}>
                      <p className="text-[10px] text-zinc-100 font-bold mb-1">{alert.message}</p>
                      <p className="text-[9px] text-zinc-500 font-mono uppercase">Value: {alert.currentValue}% | Target: {alert.threshold}%</p>
                   </div>
                 ))}
                 {!state?.alerts.length && <p className="text-[10px] text-zinc-500 italic">No active alerts detected.</p>}
              </div>
           </Card>
           <Card className="bg-emerald-500/5 border border-emerald-500/10 p-5 space-y-4">
              <h4 className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Self-Healing History</h4>
              <div className="space-y-4">
                 {recoveries.slice(0, 3).map((log, i) => (
                    <div key={i} className="space-y-1 relative pl-4 border-l border-emerald-500/20">
                       <p className="text-[10px] text-zinc-300 font-bold">{log.message}</p>
                       <p className="text-[9px] text-emerald-600 italic font-mono">RESOLVED: {new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                 ))}
                 {!recoveries.length && <p className="text-[10px] text-zinc-500 italic">Nominal operations. No recent recoveries.</p>}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}