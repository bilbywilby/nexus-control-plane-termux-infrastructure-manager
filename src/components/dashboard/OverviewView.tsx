import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, HardDrive, Clock, ArrowRight, GitBranch, ShieldCheck, Database, Zap, Brain, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const buildData = [
  { name: '00:00', retries: 0 }, { name: '04:00', retries: 2 },
  { name: '08:00', retries: 1 }, { name: '12:00', retries: 5 },
  { name: '16:00', retries: 2 }, { name: '20:00', retries: 0 },
  { name: '23:59', retries: 1 },
];
const gaugeData = [
  { value: 98.5, color: '#10b981' },
  { value: 1.5, color: '#27272a' }
];
export function OverviewView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> Resilience Dashboard
        </h2>
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-white/5">ENGINE_ACTIVE: V2.4</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
             <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gaugeData} innerRadius={30} outerRadius={40} startAngle={180} endAngle={0} dataKey="value">
                      {gaugeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest -mt-4">Gate Health</p>
             <h3 className="text-2xl font-bold text-emerald-500">98.5%</h3>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Learning Score</p>
              <Brain className="w-4 h-4 text-cyan-500" />
            </div>
            <h3 className="text-2xl font-bold text-cyan-400">84%</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-emerald-500">+4.2%</span>
              <span className="text-[10px] text-zinc-600 font-mono">from last snapshot</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Circuit Breaker</p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-xs">CLOSED</div>
              <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
            </div>
            <p className="text-[10px] text-zinc-600 mt-2">Integrity Gate: Secured</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardContent className="pt-6">
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Avg Latency</p>
            <div className="flex items-end gap-1">
              <h3 className="text-2xl font-bold text-zinc-100">24</h3>
              <span className="text-xs text-zinc-500 mb-1 font-mono">ms</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full mt-3">
               <div className="h-full bg-cyan-500 w-[24%]" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-zinc-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-mono uppercase text-zinc-400 flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> Infrastructure Flow Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[200px] flex items-center justify-center gap-8 overflow-hidden bg-black/40 rounded-lg border border-white/5">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 flex items-center w-full max-w-2xl px-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center"><Database className="w-5 h-5 text-zinc-500" /></div>
                <span className="text-[10px] font-mono text-zinc-600">SOURCE</span>
              </div>
              <div className="flex-1 h-[2px] bg-emerald-500/40 relative shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]"><ShieldCheck className="w-6 h-6 text-emerald-500" /></div>
                <span className="text-[10px] font-mono text-emerald-500">GATE</span>
              </div>
              <div className="flex-1 h-[2px] bg-emerald-500/40 relative" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center"><Zap className="w-5 h-5 text-cyan-500" /></div>
                <span className="text-[10px] font-mono text-zinc-600">SNAPSHOT</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-zinc-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-mono uppercase text-zinc-400">Gate Failure & Retries (24h)</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={buildData}>
              <defs>
                <linearGradient id="colorRetry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', fontSize: '10px' }} />
              <Area type="monotone" dataKey="retries" stroke="#ef4444" fill="url(#colorRetry)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}