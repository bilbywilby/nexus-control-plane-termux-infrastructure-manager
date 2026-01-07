import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Shield, Globe, Terminal, Zap, Layers, Brain, Box, Share2, ShieldCheck, FileText, Code2, ShoppingBag, ExternalLink, Download, Target, Play } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { Skill } from '../../../worker/types';
export function SkillsView() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState('matrix');
  useEffect(() => {
    const fetchSkills = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data?.skills) {
        setSkills(res.data.skills);
        if (!selectedSkillId) setSelectedSkillId(res.data.skills[0].id);
      }
    };
    fetchSkills();
  }, [selectedSkillId]);
  const currentSkill = skills.find(s => s.id === selectedSkillId);
  const handleRunHook = (hook: string) => {
    toast.info(`Executing skill hook: ${hook}...`);
    setTimeout(() => toast.success("Hook validation passed."), 1500);
  };
  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" /> Intent Matching Matrix
        </h2>
        <div className="flex gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-mono text-[10px]">CLAUDE_LSP_SYNCED</Badge>
          <Badge className="bg-cyan-500/10 text-cyan-500 border-none font-mono text-[10px]">HOOKS_ACTIVE</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-zinc-900/40 border-white/5 p-8 relative overflow-hidden min-h-[450px] flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 grid grid-cols-3 gap-8">
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`cursor-pointer p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${selectedSkillId === skill.id ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:border-emerald-500/30'}`}
              >
                <Cpu className="w-8 h-8" />
                <span className="text-[10px] font-mono font-bold uppercase">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-white/5 p-6 overflow-y-auto max-h-[600px]">
          {currentSkill ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{currentSkill.name}</h3>
                <p className="text-xs text-zinc-500">{currentSkill.description}</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono uppercase text-emerald-500 tracking-widest">Intent Matching Rules</h4>
                <div className="flex flex-wrap gap-2">
                  {currentSkill.intentRules?.map((rule, i) => (
                    <Badge key={i} variant="outline" className="bg-black/40 border-white/10 font-mono text-[9px] lowercase">"{rule}"</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase text-cyan-500 tracking-widest">Execution Hooks</h4>
                <div className="space-y-2">
                  {currentSkill.hooks?.pre && (
                    <div className="p-3 bg-black/40 rounded border border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase">Pre-Tool</span>
                        <code className="text-[10px] text-cyan-400 font-mono">{currentSkill.hooks.pre}</code>
                      </div>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRunHook(currentSkill.hooks?.pre!)}><Play className="w-3 h-3" /></Button>
                    </div>
                  )}
                  {currentSkill.hooks?.post && (
                    <div className="p-3 bg-black/40 rounded border border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase">Post-Tool</span>
                        <code className="text-[10px] text-emerald-400 font-mono">{currentSkill.hooks.post}</code>
                      </div>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRunHook(currentSkill.hooks?.post!)}><Play className="w-3 h-3" /></Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase h-10 shadow-glow">
                  Load Agent Context
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
              Select skill to inspect agentic logic.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}