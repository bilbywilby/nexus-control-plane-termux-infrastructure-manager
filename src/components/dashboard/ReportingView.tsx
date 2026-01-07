import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Download, FileBarChart, Loader2, Zap, Shield, Database, Activity } from 'lucide-react';
import { toast } from 'sonner';
const performanceData = [
  { day: 'Mon', passRate: 98.2, recoveryTime: 12 },
  { day: 'Tue', passRate: 99.1, recoveryTime: 8 },
  { day: 'Wed', passRate: 97.5, recoveryTime: 15 },
  { day: 'Thu', passRate: 99.8, recoveryTime: 5 },
  { day: 'Fri', passRate: 99.3, recoveryTime: 7 },
  { day: 'Sat', passRate: 98.9, recoveryTime: 9 },
  { day: 'Sun', passRate: 99.9, recoveryTime: 4 },
];
export function ReportingView() {
  const [isGenerating, setIsGenerating] = useState(false);
  const handleExport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Executive Summary Generated: NEXUS_REPORT_Q2_24.pdf");
    }, 2500);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-emerald-500" /> Infrastructure Analytics
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">Period: Last 7 Operating Days</p>
        </div>
        <Button onClick={handleExport} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs">
          {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Download className="w-3 h-3 mr-2" />}
          GENERATE_SUMMARY
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Operations', val: '14,282', icon: Activity, color: 'text-cyan-500' },
          { label: 'Avg Latency', val: '22ms', icon: Zap, color: 'text-yellow-500' },
          { label: 'Security Score', val: '99.9', icon: Shield, color: 'text-emerald-500' },
          { label: 'Stored Snapshots', val: '142', icon: Database, color: 'text-zinc-400' },
        ].map((m, i) => (
          <Card key={i} className="bg-zinc-900/50 border-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono text-zinc-500 uppercase">{m.label}</p>
                <m.icon className={cn("w-4 h-4", m.color)} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100">{m.val}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-white/5 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xs font-mono uppercase text-zinc-400">Weekly Pass Rate (%)</CardTitle>
          </CardHeader>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} domain={[95, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="passRate" stroke="#10b981" fill="url(#colorPass)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xs font-mono uppercase text-zinc-400">Recovery Latency (sec)</CardTitle>
          </CardHeader>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="recoveryTime" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}