import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Database, Zap, Brain, Activity, RefreshCw, Layers, Server } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const buildData = [
  { name: '00:00', retries: 0 }, { name: '04:00', retries: 1 },
  { name: '08:00', retries: 0 }, { name: '12:00', retries: 3 },
  { name: '16:00', retries: 0 }, { name: '20:00', retries: 0 },
  { name: '23:59', retries: 1 },
];
const gaugeData = [{ value: 99.9, color: '#10b981' }, { value: 0.1, color: '#27272a' }];
export function OverviewView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> Infrastructure Health
        </h2>
        <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-500 gap-1 bg-emerald-500/5 px-2">
          <Server className="w-3 h-3" /> TERMUX_V8_ACTIVE
        </Badge>
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
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Fault Path</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-5">PRIMARY</Badge>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <Badge variant="outline" className="text-zinc-500 border-white/5 text-[9px] h-5">FAILOVER</Badge>
            </div>
            <p className="text-[10px] text-emerald-500/70 mt-2 font-mono">NOMINAL_PATH_ACTIVE</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Gate Redundancy</p>
            <div className="flex items-end gap-1">
              <h3 className="text-2xl font-bold text-zinc-100">3</h3>
              <span className="text-xs text-zinc-500 mb-1 font-mono">X</span>
            </div>
            <div className="flex gap-1 mt-3">
               {[1,2,3].map(i => <div key={i} className="flex-1 h-1 bg-emerald-500 rounded-full" />)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-zinc-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-mono uppercase text-zinc-400 flex items-center gap-2">
             Resilient Flow Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[240px] flex items-center justify-center overflow-hidden bg-black/40 rounded-lg border border-white/5 px-4">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl gap-4 sm:gap-0">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded bg-zinc-800 border border-white/10 flex items-center justify-center"><Layers className="w-5 h-5 text-zinc-500" /></div>
                <span className="text-[9px] font-mono text-zinc-600">INPUT</span>
              </div>
              <div className="hidden sm:block flex-1 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500/60 to-emerald-500/20 mx-4" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">TRIPLE_GATE</span>
              </div>
              <div className="hidden sm:block flex-1 h-[2px] bg-gradient-to-r from-emerald-500/20 via-cyan-500/60 to-cyan-500/20 mx-4" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded bg-zinc-800 border border-white/10 flex items-center justify-center"><Database className="w-5 h-5 text-cyan-500" /></div>
                <span className="text-[9px] font-mono text-zinc-600">REDUNDANT_STORE</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-600 tracking-widest">
              [DUAL_PATH_VALIDATION_STABLE]
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-mono uppercase text-zinc-400">Recovery Pulse (24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={buildData}>
                <defs>
                  <linearGradient id="colorRetry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', fontSize: '10px' }} />
                <Area type="monotone" dataKey="retries" stroke="#ef4444" fill="url(#colorRetry)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5 p-6 flex flex-col justify-center gap-4">
           <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Environment Integrity</p>
              <div className="p-3 bg-black/40 rounded border border-white/5 space-y-2">
                 <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">LIBS_VALID</span>
                    <span className="text-emerald-500">VERIFIED</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">FS_SECURITY</span>
                    <span className="text-emerald-500">HARDENED</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">CPU_ARCH</span>
                    <span className="text-zinc-400">AARCH64</span>
                 </div>
              </div>
           </div>
           <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-[9px] w-full justify-center py-1">
             NO_ANOMALIES_DETECTED
           </Badge>
        </Card>
      </div>
    </div>
  );
}
import { ArrowRight } from 'lucide-react';