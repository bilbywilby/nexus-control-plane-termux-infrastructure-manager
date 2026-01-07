import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, HardDrive, Clock, ArrowRight, GitBranch, ShieldCheck, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const data = [
  { name: '00:00', build: 100 },
  { name: '04:00', build: 98 },
  { name: '08:00', build: 100 },
  { name: '12:00', build: 95 },
  { name: '16:00', build: 100 },
  { name: '20:00', build: 100 },
  { name: '23:59', build: 99 },
];
export function OverviewView() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top row Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Build Integrity</p>
                <h3 className="text-2xl font-bold text-emerald-500 mt-1">99.8%</h3>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Storage Used</p>
                <h3 className="text-2xl font-bold text-cyan-500 mt-1">4.2 GB</h3>
              </div>
              <HardDrive className="w-8 h-8 text-cyan-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Uptime</p>
                <h3 className="text-2xl font-bold text-zinc-100 mt-1">14d 2h 12m</h3>
              </div>
              <Clock className="w-8 h-8 text-zinc-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Infrastructure Map */}
      <Card className="bg-zinc-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-mono uppercase text-zinc-400 flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> Infrastructure Flow Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[240px] flex items-center justify-center gap-8 overflow-hidden bg-black/40 rounded-lg border border-white/5">
            {/* Visual background grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
              backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
              backgroundSize: '20px 20px' 
            }} />
            <div className="relative z-10 flex items-center w-full max-w-2xl px-12">
              {/* Input Node */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center shadow-lg group hover:border-emerald-500/50 transition-colors">
                  <div className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-500">INPUT</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">Dev Source</span>
              </div>
              {/* Connector */}
              <div className="flex-1 h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              {/* Validation Gate */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-emerald-500">Validation Gate</span>
              </div>
              {/* Connector */}
              <div className="flex-1 h-[2px] bg-gradient-to-r from-cyan-500 to-emerald-500 relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              {/* Snapshot Node */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center shadow-lg group hover:border-cyan-500/50 transition-colors">
                   <Database className="w-6 h-6 text-cyan-500" />
                </div>
                <span className="text-[10px] font-mono text-zinc-600">Archive</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Activity and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-mono uppercase text-zinc-400">Build Stability (24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorBuild" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', fontSize: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="build" stroke="#10b981" fillOpacity={1} fill="url(#colorBuild)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-mono uppercase text-zinc-400">Recent Ops Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '14:20:12', msg: 'Snapshot ARCH_V142 created', status: 'success' },
                { time: '14:05:44', msg: 'Skill "python-linter" active', status: 'info' },
                { time: '13:58:01', msg: 'Validation gate: Pass (94.2 KB)', status: 'success' },
                { time: '13:42:12', msg: 'Checksum verification complete', status: 'success' }
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 border-l-2 border-white/10 pl-4 py-1">
                  <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">{log.time}</span>
                  <p className="text-xs font-mono text-zinc-300">{log.msg}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}