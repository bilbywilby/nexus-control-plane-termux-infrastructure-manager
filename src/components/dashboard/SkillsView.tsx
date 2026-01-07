import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Shield, Globe, Terminal, Zap, Layers, Brain } from 'lucide-react';
const skills = [
  { id: 'python-dev', name: 'python-dev', icon: <Cpu className="w-4 h-4" />, confidence: 85, status: 'Active', desc: 'Lints and tests Python modules.' },
  { id: 'security-audit', name: 'security-audit', icon: <Shield className="w-4 h-4" />, confidence: 92, status: 'Standby', desc: 'Vulnerability scanning.' },
  { id: 'web-deploy', name: 'web-deploy', icon: <Globe className="w-4 h-4" />, confidence: 78, status: 'Active', desc: 'Cloudflare Pages sync.' },
  { id: 'termux-shell', name: 'termux-shell', icon: <Terminal className="w-4 h-4" />, confidence: 99, status: 'Active', desc: 'Local bash management.' },
  { id: 'archive-sync', name: 'archive-sync', icon: <Layers className="w-4 h-4" />, confidence: 81, status: 'Active', desc: 'R2 bucket synchronization.' },
];
export function SkillsView() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <Brain className="w-4 h-4" /> Adaptive Skill Matrix
        </h2>
        <div className="flex gap-2">
           <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-500">LEARNING_ENABLED</Badge>
           <Badge variant="outline" className="text-[10px] font-mono border-white/5 text-zinc-500">NODES: 5</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Graph View */}
        <div className="lg:col-span-2 relative bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                 <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                 </radialGradient>
              </defs>
              {/* Connections to center */}
              {skills.map((_, i) => {
                 const angle = (i / skills.length) * 2 * Math.PI;
                 const x2 = 50 + 35 * Math.cos(angle);
                 const y2 = 50 + 35 * Math.sin(angle);
                 return <line key={i} x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 4" />;
              })}
           </svg>
           {/* Central Core */}
           <motion.div 
             className="relative z-10 w-24 h-24 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]"
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 4, repeat: Infinity }}
           >
              <Zap className="w-8 h-8 text-emerald-400" />
              <span className="text-[8px] font-mono text-emerald-500 font-bold mt-1">CORE</span>
           </motion.div>
           {/* Peripheral Skill Nodes */}
           {skills.map((skill, i) => {
              const angle = (i / skills.length) * 2 * Math.PI;
              const x = 50 + 35 * Math.cos(angle);
              const y = 50 + 35 * Math.sin(angle);
              return (
                <motion.div
                  key={skill.id}
                  className="absolute cursor-pointer group"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedSkill(skill.id)}
                >
                  <div className={`p-3 rounded-xl border transition-all ${selectedSkill === skill.id ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-emerald-500/50'}`}>
                    {skill.icon}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded">
                    {skill.name} ({skill.confidence}%)
                  </div>
                </motion.div>
              );
           })}
        </div>
        {/* Skill Details & Logs */}
        <div className="space-y-4">
           <Card className="bg-zinc-900/50 border-white/5 h-1/2 overflow-y-auto">
              <CardContent className="pt-6">
                 {selectedSkill ? (
                    <div className="space-y-4 animate-fade-in">
                       <div className="flex items-center justify-between">
                          <h3 className="font-mono text-xs uppercase text-zinc-100">{selectedSkill}</h3>
                          <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500">STABLE</Badge>
                       </div>
                       <p className="text-xs text-zinc-400">{skills.find(s => s.id === selectedSkill)?.desc}</p>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono">
                             <span className="text-zinc-500">CONFIDENCE</span>
                             <span className="text-emerald-500">{skills.find(s => s.id === selectedSkill)?.confidence}%</span>
                          </div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: `${skills.find(s => s.id === selectedSkill)?.confidence}%` }} />
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-xs text-center py-10">
                       <Brain className="w-8 h-8 mb-2 opacity-20" />
                       <p>Select a skill node to view activation metrics and trigger logic.</p>
                    </div>
                 )}
              </CardContent>
           </Card>
           <Card className="bg-black border-white/5 h-1/2 flex flex-col">
              <div className="px-4 py-2 border-b border-white/5 bg-zinc-900/30">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase">Learning Logs</span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                 {[
                   { msg: 'python-dev confidence +0.5% (regex match)', time: '2m ago' },
                   { msg: 'security-audit state -> STANDBY (inactive 4h)', time: '4h ago' },
                   { msg: 'New pattern detected for "web-deploy"', time: '14h ago' },
                   { msg: 'System core weights optimized', time: '1d ago' }
                 ].map((log, i) => (
                    <div key={i} className="flex gap-3 text-[10px] font-mono">
                       <span className="text-zinc-600 shrink-0">{log.time}</span>
                       <span className="text-emerald-500/80">{log.msg}</span>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}