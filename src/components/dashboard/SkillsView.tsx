import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Shield, Globe, Terminal, Zap, Layers, Brain, Box, Share2, ShieldCheck, FileText, Code2, ShoppingBag, ExternalLink, Download, Target, Play, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { Skill } from '../../../worker/types';
export function SkillsView() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('matrix');
  useEffect(() => {
    const fetchSkills = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setSkills(res.data.skills);
        setSuggestedSkills(res.data.suggestedSkills || []);
        if (!selectedSkillId && res.data.skills.length > 0) setSelectedSkillId(res.data.skills[0].id);
      }
    };
    fetchSkills();
  }, []);
  const currentSkill = skills.find(s => s.id === selectedSkillId);
  const handleRunHook = (hook: string) => {
    toast.info(`Executing skill hook: ${hook}...`);
    setTimeout(() => toast.success("Hook validation passed."), 1500);
  };
  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" /> Autonomic Skill Matrix
        </h2>
        <div className="flex gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-mono text-[10px]">INTENT_HOOK_V2</Badge>
          <Badge className="bg-cyan-500/10 text-cyan-500 border-none font-mono text-[10px]">ROADMAP_88%</Badge>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900 border-white/5">
          <TabsTrigger value="matrix" className="text-[10px] uppercase font-mono">Skill Matrix</TabsTrigger>
          <TabsTrigger value="discovery" className="text-[10px] uppercase font-mono flex gap-2">
            <Sparkles className="w-3 h-3" /> Intent Matching Logic
          </TabsTrigger>
        </TabsList>
        <TabsContent value="matrix" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-zinc-900/40 border-white/5 p-8 relative overflow-hidden min-h-[450px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 grid grid-cols-3 gap-8">
              {skills.map((skill) => {
                const isSuggested = suggestedSkills.includes(skill.id);
                return (
                  <motion.div
                    key={skill.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`relative cursor-pointer p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                      selectedSkillId === skill.id 
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                        : isSuggested
                          ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                          : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:border-emerald-500/30'
                    }`}
                  >
                    {isSuggested && (
                      <div className="absolute -top-2 -right-2 bg-cyan-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg animate-pulse">
                        RECOMMENDED
                      </div>
                    )}
                    <Cpu className="w-8 h-8" />
                    <span className="text-[10px] font-mono font-bold uppercase">{skill.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 p-6 overflow-y-auto max-h-[600px]">
            {currentSkill ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{currentSkill.name}</h3>
                    <p className="text-xs text-zinc-500">{currentSkill.description}</p>
                  </div>
                  {suggestedSkills.includes(currentSkill.id) && (
                    <Sparkles className="w-5 h-5 text-cyan-500 animate-pulse" />
                  )}
                </div>
                {suggestedSkills.includes(currentSkill.id) && (
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded flex items-center gap-3">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <p className="text-[10px] text-cyan-400 font-mono">Matched by autonomic intent evaluation hook.</p>
                  </div>
                )}
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
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRunHook(currentSkill.hooks!.pre)}><Play className="w-3 h-3" /></Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 font-mono text-xs">
                <HelpCircle className="w-10 h-10 mb-4 opacity-10" />
                Select skill to inspect autonomic logic.
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="discovery">
          <Card className="bg-zinc-900/50 border-white/5 p-8 space-y-8">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 rounded bg-cyan-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">.claude/hooks/evaluate_intent.sh</h3>
                <p className="text-sm text-zinc-500 font-mono">Infrastructure-level regex pattern matcher for skill routing.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Active Regex Map</h4>
                <div className="space-y-3">
                  {[
                    { pattern: '(ticket|issue|bug)', result: 'jira-agent', icon: Box },
                    { pattern: '(deploy|push|release)', result: 'deploy-github', icon: Globe },
                    { pattern: '(test|validate|check)', result: 'python-dev', icon: ShieldCheck },
                  ].map((map, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-black/40 rounded border border-white/5">
                      <map.icon className="w-4 h-4 text-emerald-500" />
                      <div className="flex-1">
                        <code className="text-[11px] text-zinc-300 font-mono">{map.pattern}</code>
                      </div>
                      <ArrowRight className="w-3 h-3 text-zinc-700" />
                      <Badge className="bg-zinc-800 border-white/10 text-[10px] font-mono">{map.result}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 bg-black/60 p-6 rounded-lg border border-white/5">
                <h4 className="text-xs font-mono uppercase text-emerald-500 tracking-widest">Hook Telemetry</h4>
                <div className="space-y-2 text-[10px] font-mono text-zinc-500">
                  <p>[INFO] Loaded evaluate_intent.sh from .claude/hooks/</p>
                  <p>[INFO] Registered 14 regex pattern triggers.</p>
                  <p>[INFO] Autonomic routing latency: 1.2ms</p>
                  <p className="text-emerald-500/80 mt-4"># Usage Example:</p>
                  <p className="text-zinc-400">./evaluate_intent.sh "push to production"</p>
                  <p className="text-cyan-400">&gt;&gt; Match: deploy-github (Context Injected)</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}