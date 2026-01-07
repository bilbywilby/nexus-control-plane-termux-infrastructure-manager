import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Shield, Globe, Terminal, Zap, Layers, Brain, Box, Share2, ShieldCheck, FileText, Code2 } from 'lucide-react';
import { toast } from 'sonner';
const skills = [
  { id: 'python-dev', name: 'python-dev', icon: <Cpu className="w-4 h-4" />, confidence: 85, status: 'Active', desc: 'Lints and tests Python modules.', verified: true, sop: '## TESTING_STANDARD_V1\n- Use `pytest` for unit isolation.\n- CI Gate: Validate exit code 6 for specific build bypass.\n- Coverage Target: >85% for core logic.' },
  { id: 'security-audit', name: 'security-audit', icon: <Shield className="w-4 h-4" />, confidence: 92, status: 'Standby', desc: 'Vulnerability scanning.', verified: true, sop: '## SECURITY_SOP_HARDENING\n- Scan for RSA/PEM/Regex secrets.\n- Enforce pre-commit hook validation.\n- Audit logs rotated every 24h.' },
  { id: 'web-deploy', name: 'web-deploy', icon: <Globe className="w-4 h-4" />, confidence: 78, status: 'Active', desc: 'Cloudflare Pages sync.', verified: false },
  { id: 'termux-shell', name: 'termux-shell', icon: <Terminal className="w-4 h-4" />, confidence: 99, status: 'Active', desc: 'Local bash management.', verified: true },
  { id: 'archive-sync', name: 'archive-sync', icon: <Layers className="w-4 h-4" />, confidence: 81, status: 'Active', desc: 'R2 bucket synchronization.', verified: false },
];
export function SkillsView() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>('python-dev');
  const [isCompiling, setIsCompiling] = useState(false);
  const currentSkill = skills.find(s => s.id === selectedSkill);
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
           <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-2">DISTRIBUTED_ACTIVE</Badge>
           <Badge variant="outline" className="text-[10px] font-mono border-white/5 text-zinc-500">NODES: 2</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px]">
        <div className="lg:col-span-2 relative bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center min-h-[400px]">
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
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
           <Card className="bg-zinc-900/50 border-white/5 min-h-[350px] overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                 {currentSkill ? (
                    <div className="animate-fade-in flex flex-col h-full">
                       <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between">
                          <h3 className="font-mono text-xs uppercase text-zinc-100">{currentSkill.name}</h3>
                          <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500">STABLE</Badge>
                       </div>
                       <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                         <TabsList className="bg-transparent border-b border-white/5 rounded-none h-9 px-2">
                           <TabsTrigger value="overview" className="text-[10px] uppercase font-mono px-3">Overview</TabsTrigger>
                           <TabsTrigger value="sop" className="text-[10px] uppercase font-mono px-3">SOP/Docs</TabsTrigger>
                         </TabsList>
                         <TabsContent value="overview" className="p-4 flex-1 space-y-4">
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">{currentSkill.desc}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-mono">
                                 <span className="text-zinc-500 uppercase">Deployment Targets</span>
                                 <span className="text-cyan-500 font-bold">2 NODES</span>
                              </div>
                              <div className="flex gap-2">
                                 <Badge variant="outline" className="text-[8px] border-white/5 text-zinc-500">ALPHA_NODE</Badge>
                                 <Badge variant="outline" className="text-[8px] border-white/5 text-zinc-500">BETA_NODE</Badge>
                              </div>
                            </div>
                         </TabsContent>
                         <TabsContent value="sop" className="p-4 flex-1">
                            {currentSkill.sop ? (
                              <div className="bg-black/40 rounded p-3 border border-white/5 font-mono text-[10px] text-zinc-400 overflow-y-auto max-h-[180px] whitespace-pre-wrap">
                                 <Code2 className="w-3 h-3 text-cyan-500 mb-2" />
                                 {currentSkill.sop}
                              </div>
                            ) : (
                              <div className="text-center py-10 text-zinc-600 text-[10px] font-mono">No specialized SOP linked to this skill module.</div>
                            )}
                         </TabsContent>
                       </Tabs>
                       <div className="p-4 bg-zinc-900/20 border-t border-white/5 flex gap-2">
                          <Button onClick={handleCompile} disabled={isCompiling} size="sm" className="flex-1 bg-zinc-100 text-black hover:bg-white text-[10px] font-mono h-8">
                             {isCompiling ? "COMPILING..." : "COMPILE_BUNDLE"}
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-300 text-[10px] h-8">
                             <Share2 className="w-3 h-3" />
                          </Button>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-xs text-center p-10 font-mono">
                       <Box className="w-8 h-8 mb-2 opacity-20" />
                       <p>Select skill for distribution <br/> & compilation ops.</p>
                    </div>
                 )}
              </CardContent>
           </Card>
           <Card className="bg-black border-white/5 p-4 space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Audit Stream</span>
              <div className="space-y-2">
                 {[
                   { msg: 'Integrity verified: security-audit', time: '1h ago' },
                   { msg: 'python-dev bundle exported', time: '3h ago' },
                 ].map((log, i) => (
                    <div key={i} className="flex gap-2 text-[10px] font-mono items-center">
                       <div className="w-1 h-1 rounded-full bg-emerald-500" />
                       <span className="text-zinc-600 whitespace-nowrap">{log.time}</span>
                       <span className="text-zinc-400 truncate">{log.msg}</span>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}