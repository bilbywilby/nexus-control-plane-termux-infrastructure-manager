import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Database, Zap, Activity, RefreshCw, Layers, Server, Terminal, ArrowRight, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
const buildData = [
  { name: '00:00', retries: 0, time: 42 }, { name: '04:00', retries: 1, time: 55 },
  { name: '08:00', retries: 0, time: 38 }, { name: '12:00', retries: 3, time: 82 },
  { name: '16:00', retries: 0, time: 40 }, { name: '20:00', retries: 0, time: 41 },
  { name: '23:59', retries: 1, time: 44 },
];
const gaugeData = [{ value: 99.9, color: '#10b981' }, { value: 0.1, color: '#27272a' }];
export function OverviewView() {
  const roadmap = [
    { id: 'R1', title: 'Core Infra', status: 'completed' },
    { id: 'R2', title: 'Validation Gate', status: 'completed' },
    { id: 'R3', title: 'Skill Matrix', status: 'current' },
    { id: 'R4', title: 'Autonomic Healing', status: 'upcoming' }
  ];
  return (
    <div className="max-w-7xl mx-auto py-4 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> Infrastructure Health
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {roadmap.map((stage, idx) => (
            <div key={stage.id} className="flex items-center gap-2 shrink-0">
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono border",
                stage.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                stage.status === 'current' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.2)]" :
                "bg-zinc-900 border-white/5 text-zinc-600"
              )}>
                {stage.status === 'completed' && <Check className="w-2.5 h-2.5" />}
                {stage.title.toUpperCase()}
              </div>
              {idx < roadmap.length - 1 && <div className="w-2 h-[1px] bg-zinc-800" />}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
             <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gaugeData} innerRadius={25} outerRadius={35} startAngle={180} endAngle={0} dataKey="value">
                      {gaugeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest -mt-2">Uptime Score</p>
             <h3 className="text-2xl font-bold text-emerald-500">99.9%</h3>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Self-Healing</p>
              <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin-slow" />
            </div>
            <h3 className="text-2xl font-bold text-cyan-400">94.2%</h3>
            <span className="text-[10px] text-zinc-500 font-mono italic">Recovery success rate</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Environment Arch</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-5 font-mono">AARCH64</Badge>
              <Badge variant="outline" className="text-zinc-500 border-white/5 text-[9px] h-5 font-mono">LINUX_20.X</Badge>
            </div>
            <p className="text-[10px] text-emerald-500/70 mt-2 font-mono">NODE_PERSISTENCE_ENABLED</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Avg Build Time</p>
            <div className="flex items-end gap-1">
              <h3 className="text-2xl font-bold text-zinc-100">42.8</h3>
              <span className="text-xs text-zinc-500 mb-1 font-mono">SEC</span>
            </div>
            <div className="flex gap-1 mt-3">
               {[1,2,3,4].map(i => <div key={i} className={cn("flex-1 h-1 rounded-full", i < 4 ? "bg-emerald-500" : "bg-zinc-800")} />)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-mono uppercase text-zinc-400">Recovery Pulse & Build Latency</CardTitle>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-mono text-zinc-500">BUILD_MS</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-mono text-zinc-500">RETRIES</span></div>
            </div>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={buildData}>
                <defs>
                  <linearGradient id="colorRetry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBuild" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', fontSize: '10px' }}
                  itemStyle={{ fontSize: '9px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="retries" stroke="#ef4444" fill="url(#colorRetry)" />
                <Area type="monotone" dataKey="time" stroke="#10b981" fill="url(#colorBuild)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="bg-zinc-900/50 border-white/5 p-5">
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-4 flex items-center gap-2">
              <Terminal className="w-3 h-3 text-cyan-500" /> Environment Context
            </p>
            <div className="space-y-3">
              {[
                { k: 'SYS_ARCH', v: 'AARCH64' },
                { k: 'NODE_V', v: '20.12.0' },
                { k: 'BUILD_GATE', v: 'V3_ACTIVE' },
                { k: 'SNAPSHOTS', v: '142_COMMITTED' },
              ].map((item) => (
                <div key={item.k} className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0">
                  <span className="text-[9px] font-mono text-zinc-500">{item.k}</span>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold">{item.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-2 bg-emerald-500/5 rounded border border-emerald-500/10 text-[9px] font-mono text-emerald-500/80 text-center uppercase tracking-widest">
              Security Shield Engaged
            </div>
          </Card>
          <Card className="bg-emerald-600/10 border-emerald-500/20 p-5 flex flex-col justify-center gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform duration-500">
               <ShieldCheck className="w-16 h-16 text-emerald-500" />
            </div>
            <p className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Autonomic Status</p>
            <h4 className="text-xl font-bold text-zinc-100">STABLE</h4>
            <p className="text-[9px] text-zinc-400 font-mono leading-tight">
              Healing matrix monitoring all sub-processes. 0 anomalies in 24h.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}