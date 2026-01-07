import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Shield, Globe, Terminal, Zap, Layers, Brain, Download, Box, Share2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
const skills = [
  { id: 'python-dev', name: 'python-dev', icon: <Cpu className="w-4 h-4" />, confidence: 85, status: 'Active', desc: 'Lints and tests Python modules.', verified: true },
  { id: 'security-audit', name: 'security-audit', icon: <Shield className="w-4 h-4" />, confidence: 92, status: 'Standby', desc: 'Vulnerability scanning.', verified: true },
  { id: 'web-deploy', name: 'web-deploy', icon: <Globe className="w-4 h-4" />, confidence: 78, status: 'Active', desc: 'Cloudflare Pages sync.', verified: false },
  { id: 'termux-shell', name: 'termux-shell', icon: <Terminal className="w-4 h-4" />, confidence: 99, status: 'Active', desc: 'Local bash management.', verified: true },
  { id: 'archive-sync', name: 'archive-sync', icon: <Layers className="w-4 h-4" />, confidence: 81, status: 'Active', desc: 'R2 bucket synchronization.', verified: false },
];
export function SkillsView() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      toast.success(`${selectedSkill} compiled into distributable bundle.`);
    }, 2000);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-500" /> Adaptive Skill Matrix
        </h2>
        <div className="flex gap-2">
           <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/5">DISTRIBUTED_ACTIVE</Badge>
           <Badge variant="outline" className="text-[10px] font-mono border-white/5 text-zinc-500">NODES: 2</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px]">
        <div className="lg:col-span-2 relative bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center min-h-[400px]">
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                 <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                 </radialGradient>
              </defs>
              {skills.map((_, i) => {
                 const angle = (i / skills.length) * 2 * Math.PI;
                 const x2 = 50 + 35 * Math.cos(angle);
                 const y2 = 50 + 35 * Math.sin(angle);
                 return <line key={i} x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 4" />;
              })}
           </svg>
           <motion.div
             className="relative z-10 w-20 h-20 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]"
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 4, repeat: Infinity }}
           >
              <Zap className="w-8 h-8 text-emerald-400" />
              <span className="text-[8px] font-mono text-emerald-500 font-bold mt-1">CORE</span>
           </motion.div>
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
                  <div className={`p-3 rounded-xl border transition-all ${selectedSkill === skill.id ? 'bg-emerald-500 border-emerald-400 text-black shadow-glow' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-emerald-500/50'}`}>
                    {skill.icon}
                  </div>
                  {skill.verified && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-black shadow-lg">
                      <ShieldCheck className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </motion.div>
              );
           })}
        </div>
        <div className="space-y-4">
           <Card className="bg-zinc-900/50 border-white/5 h-[280px] overflow-y-auto">
              <CardContent className="pt-6">
                 {selectedSkill ? (
                    <div className="space-y-4 animate-fade-in">
                       <div className="flex items-center justify-between">
                          <h3 className="font-mono text-xs uppercase text-zinc-100">{selectedSkill}</h3>
                          <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500">STABLE</Badge>
                       </div>
                       <p className="text-xs text-zinc-400 leading-relaxed font-mono">{skills.find(s => s.id === selectedSkill)?.desc}</p>
                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-mono">
                             <span className="text-zinc-500 uppercase">Deployment Targets</span>
                             <span className="text-cyan-500">2 NODES</span>
                          </div>
                          <div className="flex gap-2">
                             <Badge variant="outline" className="text-[8px] border-white/5 text-zinc-500">ALPHA_NODE</Badge>
                             <Badge variant="outline" className="text-[8px] border-white/5 text-zinc-500">BETA_NODE</Badge>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button onClick={handleCompile} disabled={isCompiling} size="sm" className="flex-1 bg-zinc-100 text-black hover:bg-white text-[10px] font-mono h-8">
                               {isCompiling ? "COMPILING..." : "COMPILE_BUNDLE"}
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-300 text-[10px] h-8">
                               <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-xs text-center py-10 font-mono">
                       <Box className="w-8 h-8 mb-2 opacity-20" />
                       <p>Select skill for distribution <br/> & compilation ops.</p>
                    </div>
                 )}
              </CardContent>
           </Card>
           <Card className="bg-black border-white/5 flex-1 flex flex-col min-h-[200px]">
              <div className="px-4 py-2 border-b border-white/5 bg-zinc-900/30">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase">Audit Trail</span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                 {[
                   { msg: 'Integrity verified for security-audit', time: '1h ago' },
                   { msg: 'python-dev bundle exported to SNP-0942', time: '3h ago' },
                   { msg: 'Multi-node sync complete: ALPHA <-> BETA', time: '6h ago' },
                 ].map((log, i) => (
                    <div key={i} className="flex gap-3 text-[10px] font-mono">
                       <span className="text-zinc-700 shrink-0">{log.time}</span>
                       <span className="text-zinc-400">{log.msg}</span>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}