import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Database, Zap, Activity, RefreshCw, Layers, Server, Terminal, AlertTriangle, Check, Wifi, WifiOff } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';
const buildData = [
  { name: '00:00', latency: 42, threshold: 80 }, { name: '04:00', latency: 55, threshold: 80 },
  { name: '08:00', latency: 38, threshold: 80 }, { name: '12:00', latency: 82, threshold: 80 },
  { name: '16:00', latency: 40, threshold: 80 }, { name: '20:00', latency: 41, threshold: 80 },
  { name: '23:59', latency: 44, threshold: 80 },
];
export function OverviewView() {
  const [isLocal, setIsLocal] = React.useState(true);
  return (
    <div className="max-w-7xl mx-auto py-4 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> System Metrics & Alerts
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 rounded-lg p-1">
            <button onClick={() => setIsLocal(true)} className={cn("px-3 py-1 rounded text-[10px] font-mono transition-all", isLocal ? "bg-emerald-600 text-white" : "text-zinc-500 hover:text-zinc-300")}>LOCAL_PKG</button>
            <button onClick={() => setIsLocal(false)} className={cn("px-3 py-1 rounded text-[10px] font-mono transition-all", !isLocal ? "bg-cyan-600 text-white" : "text-zinc-500 hover:text-zinc-300")}>REMOTE_SYNC</button>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-tighter">2 Active Warnings</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5 overflow-hidden">
           <CardHeader className="flex flex-row items-center justify-between bg-zinc-900/40 border-b border-white/5 pb-4">
             <CardTitle className="text-xs font-mono uppercase text-zinc-400">Node Latency Performance</CardTitle>
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-mono text-zinc-500">THRESHOLD_GATE</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-mono text-zinc-500">LATENCY_MS</span></div>
             </div>
           </CardHeader>
           <CardContent className="h-[300px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={buildData}>
                  <defs>
                    <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#3f3f46" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '10px' }} />
                  <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="latency" stroke="#10b981" fill="url(#colorLat)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>
        <div className="space-y-6">
           <Card className="bg-red-500/5 border border-red-500/10 p-5 space-y-4">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-widest">System Alerts</h4>
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </div>
              <div className="space-y-3">
                 <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
                    <p className="text-[10px] text-zinc-100 font-bold mb-1">LATENCY_GATE_EXCEEDED</p>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase">Current: 82ms | Threshold: 80ms</p>
                 </div>
                 <div className="p-3 bg-amber-500/10 rounded border border-amber-500/20">
                    <p className="text-[10px] text-zinc-100 font-bold mb-1">DISK_USAGE_CRITICAL</p>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase">Partition: /data | Usage: 88%</p>
                 </div>
              </div>
           </Card>
           <Card className="bg-emerald-500/5 border border-emerald-500/10 p-5 space-y-4">
              <h4 className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Self-Healing History</h4>
              <div className="space-y-4">
                 {[
                   { msg: 'Secondary path failure', fix: 'Proactive failover to local mirror' },
                   { msg: 'Orphaned buffer detected', fix: 'Cleaned temp files to restore disk IO' }
                 ].map((h, i) => (
                    <div key={i} className="space-y-1 relative pl-4 border-l border-emerald-500/20">
                       <p className="text-[10px] text-zinc-300 font-bold">{h.msg}</p>
                       <p className="text-[9px] text-emerald-600 italic font-mono">RESOLVED: {h.fix}</p>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}