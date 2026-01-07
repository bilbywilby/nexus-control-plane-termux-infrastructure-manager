import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Shield, Globe, Terminal, Zap, Layers, Brain, Box, Share2, ShieldCheck, FileText, Code2, ShoppingBag, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
const skills = [
  { id: 'python-dev', name: 'python-dev', icon: <Cpu className="w-4 h-4" />, confidence: 85, status: 'Active', desc: 'Lints and tests Python modules.', verified: true, loadPath: '.plugins/python-lint.js', sop: '## TESTING_STANDARD_V1\n- Use `pytest` for unit isolation.\n- CI Gate: Validate exit code 6 for specific build bypass.\n- Coverage Target: >85% for core logic.' },
  { id: 'security-audit', name: 'security-audit', icon: <Shield className="w-4 h-4" />, confidence: 92, status: 'Standby', desc: 'Vulnerability scanning.', verified: true, loadPath: '.plugins/sec-audit.js', sop: '## SECURITY_SOP_HARDENING\n- Scan for RSA/PEM/Regex secrets.\n- Enforce pre-commit hook validation.\n- Audit logs rotated every 24h.' },
  { id: 'termux-shell', name: 'termux-shell', icon: <Terminal className="w-4 h-4" />, confidence: 99, status: 'Active', desc: 'Local bash management.', verified: true, loadPath: 'internal://shell' },
];
const marketplace = [
  { id: 'rust-comp', name: 'rust-compiler', icon: <Cpu className="w-4 h-4" />, author: 'Nexus Community', rating: 4.8, type: 'Official' },
  { id: 'r2-sync', name: 'r2-sync-agent', icon: <Layers className="w-4 h-4" />, author: 'Nexus Core', rating: 5.0, type: 'Verified' },
  { id: 'log-tail', name: 'remote-log-tail', icon: <Terminal className="w-4 h-4" />, author: 'OpenSource', rating: 4.2, type: 'Community' },
];
export function SkillsView() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>('python-dev');
  const [activeTab, setActiveTab] = useState('matrix');
  const currentSkill = skills.find(s => s.id === selectedSkill);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-zinc-900 border-white/5">
            <TabsTrigger value="matrix" className="gap-2 font-mono text-[10px] uppercase">
              <Cpu className="w-3.5 h-3.5" /> Skill Matrix
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="gap-2 font-mono text-[10px] uppercase">
              <ShoppingBag className="w-3.5 h-3.5" /> Marketplace
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
             <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-2">DISTRIBUTED_ACTIVE</Badge>
             <Badge variant="outline" className="text-[10px] font-mono border-white/5 text-zinc-500">NODES: 2</Badge>
          </div>
        </div>
        <TabsContent value="matrix" className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px]">
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
                  </motion.div>
                );
             })}
          </div>
          <div className="space-y-4">
             <Card className="bg-zinc-900/50 border-white/5 h-full flex flex-col">
                {currentSkill && (
                  <div className="p-6 flex flex-col h-full animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-mono text-sm uppercase text-white font-bold">{currentSkill.name}</h3>
                       <Badge className="bg-emerald-500/10 text-emerald-500 text-[9px]">ACTIVE</Badge>
                    </div>
                    <div className="space-y-6 flex-1">
                       <div className="space-y-2">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Load Path</p>
                          <code className="text-[11px] text-emerald-400 font-mono bg-black/50 p-2 rounded block">{currentSkill.loadPath}</code>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Verification Meta</p>
                          <div className="flex gap-2">
                             <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-500">TRIPLE_GATE_PASSED</Badge>
                             <Badge variant="outline" className="text-[9px] border-white/5 text-zinc-500">v2.0.4</Badge>
                          </div>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                       <Button size="sm" className="flex-1 bg-white text-black hover:bg-zinc-200 text-xs font-mono h-9">CONFIGURE</Button>
                       <Button size="sm" variant="outline" className="h-9 w-9 border-white/10 text-zinc-400"><Share2 className="w-4 h-4"/></Button>
                    </div>
                  </div>
                )}
             </Card>
          </div>
        </TabsContent>
        <TabsContent value="marketplace" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {marketplace.map(item => (
               <Card key={item.id} className="bg-zinc-900/50 border-white/5 hover:border-cyan-500/30 transition-all group">
                  <CardContent className="p-6">
                     <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-zinc-800 border border-white/5 ${item.type === 'Verified' ? 'text-cyan-500' : 'text-zinc-400'}`}>
                           {item.icon}
                        </div>
                        <Badge variant="outline" className={`text-[9px] font-mono ${item.type === 'Verified' ? 'border-cyan-500/30 text-cyan-500' : 'border-white/5 text-zinc-500'}`}>
                           {item.type.toUpperCase()}
                        </Badge>
                     </div>
                     <h4 className="font-mono text-sm font-bold text-zinc-100 mb-1">{item.name}</h4>
                     <p className="text-[10px] text-zinc-500 font-mono mb-4">by {item.author}</p>
                     <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] font-mono text-yellow-500">★ {item.rating}</span>
                        <Button size="sm" className="bg-zinc-100 text-black hover:bg-white text-[10px] font-mono h-8">INSTALL</Button>
                     </div>
                  </CardContent>
               </Card>
             ))}
             <Card className="bg-black/30 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center gap-4">
                <Box className="w-8 h-8 text-zinc-700" />
                <div className="space-y-1">
                   <p className="text-xs font-mono text-zinc-500">Want to contribute?</p>
                   <p className="text-[10px] text-zinc-600 font-mono">Build with the Nexus Plugin API</p>
                </div>
                <Button variant="link" className="text-cyan-500 text-[10px] font-mono h-auto p-0 flex items-center gap-1 uppercase tracking-widest">
                   Developer Guide <ExternalLink className="w-3 h-3" />
                </Button>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}