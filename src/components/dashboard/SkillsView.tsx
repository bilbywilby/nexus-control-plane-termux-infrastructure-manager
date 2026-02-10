import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Cpu, Shield, Globe, Terminal, Zap, Layers, Brain, Box, Sparkles, Search, Download, Star, ExternalLink, Cloud, Package, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { Skill, PluginItem } from '../../../worker/types';
export function SkillsView() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [activeTab, setActiveTab] = useState('matrix');
  const [installing, setInstalling] = useState<string | null>(null);
  useEffect(() => {
    const fetchSkills = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setSkills(res.data.skills);
        setPlugins(res.data.plugins);
        if (!selectedSkillId && res.data.skills.length > 0) {
          setSelectedSkillId(res.data.skills[0].id);
        }
      }
    };
    fetchSkills();
  }, [selectedSkillId]);
  const handleInstallPlugin = (id: string) => {
    setInstalling(id);
    setTimeout(() => {
      setInstalling(null);
      toast.success(`Plugin ${id} installed successfully.`);
    }, 2000);
  };
  const currentSkill = skills.find(s => s.id === selectedSkillId);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-500" /> Modular Skill Infrastructure
        </h2>
        <div className="flex gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-mono text-[10px]">MCP_ACTIVE</Badge>
          <Badge className="bg-cyan-500/10 text-cyan-500 border-none font-mono text-[10px]">DAEMON_SAFE</Badge>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900 border-white/5">
          <TabsTrigger value="matrix" className="text-[10px] uppercase font-mono">Skill Matrix</TabsTrigger>
          <TabsTrigger value="marketplace" className="text-[10px] uppercase font-mono flex gap-2">
            <Package className="w-3 h-3" /> Skill Marketplace
          </TabsTrigger>
        </TabsList>
        <TabsContent value="matrix" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-zinc-900/40 border-white/5 p-8 relative overflow-hidden min-h-[450px]">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`relative cursor-pointer p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                    selectedSkillId === skill.id
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                      : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:border-emerald-500/30'
                  }`}
                >
                  <Cpu className="w-8 h-8" />
                  <span className="text-[10px] font-mono font-bold uppercase text-center">{skill.name}</span>
                  {skill.isMcpPowered && (
                    <div className="flex items-center gap-1">
                      <Cloud className="w-2.5 h-2.5 text-cyan-400" />
                      <span className="text-[8px] font-mono text-cyan-400 uppercase">MCP</span>
                    </div>
                  )}
                </motion.div>
              ))}
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
                  {currentSkill.isMcpPowered && <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-[9px]">MCP_ENABLED</Badge>}
                </div>
                <div className="p-3 bg-zinc-950/50 border border-white/5 rounded space-y-2">
                   <h4 className="text-[9px] font-mono uppercase text-zinc-500">Registry Config</h4>
                   <code className="text-[10px] text-cyan-500 font-mono block">"weight": {currentSkill.weight}</code>
                   <code className="text-[10px] text-emerald-500 font-mono block">"trigger": "{currentSkill.triggerRegex}"</code>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase text-emerald-500 tracking-widest">Intent Triggers</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSkill.intentRules?.map((rule, i) => (
                      <Badge key={i} variant="outline" className="bg-black/40 border-white/10 font-mono text-[9px] lowercase">"{rule}"</Badge>
                    ))}
                  </div>
                </div>
                {currentSkill.hooks?.pre && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Daemon Hooks</h4>
                    <div className="p-2 bg-black/40 rounded border border-white/5">
                      <code className="text-[9px] text-violet-400 font-mono">PRE_EXEC: {currentSkill.hooks.pre}</code>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 font-mono text-xs">
                Select a skill to inspect metadata.
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="marketplace" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input className="bg-zinc-900 border-white/10 pl-10 text-xs font-mono h-10" placeholder="Search marketplace (e.g., 'security', 'python')..." />
            </div>
            <div className="flex gap-2 shrink-0">
              <Badge variant="outline" className="font-mono text-[9px]">CATEGORIES: ALL</Badge>
              <Badge variant="outline" className="font-mono text-[9px]">SORT: POPULAR</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.map((plugin) => (
              <Card key={plugin.id} className="bg-zinc-900/50 border-white/5 hover:border-emerald-500/20 transition-all overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-mono">{plugin.rating}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">{plugin.category}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{plugin.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mb-4 uppercase">v{plugin.version} by {plugin.author}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">{plugin.downloads} DOWNLOADS</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleInstallPlugin(plugin.id)}
                      disabled={installing === plugin.id || plugin.status === 'Installed'}
                      className={cn(
                        "text-[9px] font-mono h-8",
                        plugin.status === 'Installed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 hover:bg-zinc-700"
                      )}
                    >
                      {installing === plugin.id ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      ) : plugin.status === 'Installed' ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <Download className="w-3 h-3 mr-1" />
                      )}
                      {plugin.status === 'Installed' ? 'INSTALLED' : 'INSTALL_SKILL'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}