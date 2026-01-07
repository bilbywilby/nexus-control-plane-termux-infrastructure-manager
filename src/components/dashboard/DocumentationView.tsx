import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Terminal, Cpu, Shield, Book, ChevronRight, Copy, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';
const docs = [
  {
    id: 'intro',
    category: 'System',
    title: 'Getting Started',
    icon: <Book className="w-4 h-4" />,
    content: 'Nexus is a high-performance orchestrator for Termux-based autonomous environments. It utilizes a triple-gate validation system to ensure build integrity before committing snapshots.'
  },
  {
    id: 'cli',
    category: 'Terminal',
    title: 'CLI References',
    icon: <Terminal className="w-4 h-4" />,
    commands: [
      { cmd: 'nexus-gate --verify', desc: 'Runs triple-path integrity scan' },
      { cmd: 'nexus-skill --load <id>', desc: 'Dynamically links a skill module' },
      { cmd: 'nexus-snapshot --commit', desc: 'Archives current node state' }
    ]
  },
  {
    id: 'plugin-api',
    category: 'Extensibility',
    title: 'Plugin API Guide',
    icon: <Cpu className="w-4 h-4" />,
    content: 'Plugins are stored in `.plugins/`. Every plugin must export a `verify()` and `execute()` method. The skill matrix detects these automatically via regex triggers.'
  },
  {
    id: 'security',
    category: 'Hardening',
    title: 'Security SOP',
    icon: <Shield className="w-4 h-4" />,
    content: 'Mandatory RSA/PEM scanning on all commits. Pre-commit hooks are enforced at the hardware level in Termux environments.'
  }
];
export function DocumentationView() {
  const [selectedId, setSelectedId] = useState('intro');
  const [search, setSearch] = useState('');
  const currentDoc = docs.find(d => d.id === selectedId);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Command copied to buffer");
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      <div className="lg:col-span-1 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            className="bg-zinc-900 border-white/10 pl-10 h-10 text-xs font-mono"
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Card className="bg-zinc-900/50 border-white/5">
          <ScrollArea className="h-[500px]">
            <div className="p-2 space-y-1">
              {docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase())).map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group ${selectedId === doc.id ? 'bg-emerald-600 text-white shadow-glow' : 'hover:bg-white/5 text-zinc-400'}`}
                >
                  <div className={selectedId === doc.id ? 'text-white' : 'text-zinc-500'}>{doc.icon}</div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-mono uppercase tracking-widest truncate">{doc.title}</p>
                    <p className="text-[9px] opacity-60 font-mono truncate">{doc.category}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <Card className="lg:col-span-3 bg-zinc-900/50 border-white/5 p-8 min-h-[600px]">
        {currentDoc && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                  {currentDoc.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{currentDoc.title}</h2>
                  <Badge variant="outline" className="text-[10px] font-mono mt-1 border-white/10 text-zinc-500">CATEGORY: {currentDoc.category}</Badge>
                </div>
              </div>
              <FileText className="w-12 h-12 text-zinc-800" />
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-sm text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap mb-8">
                {currentDoc.content}
              </p>
              {currentDoc.commands && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase text-emerald-500 font-bold tracking-widest">Interactive CLI Help</h3>
                  <div className="grid gap-3">
                    {currentDoc.commands.map((c, i) => (
                      <div key={i} className="group flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-all">
                        <div className="flex flex-col">
                          <code className="text-emerald-400 text-xs font-mono">$ {c.cmd}</code>
                          <span className="text-[10px] text-zinc-600 mt-1 font-mono">{c.desc}</span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(c.cmd)}
                          className="p-2 rounded-md hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentDoc.id === 'intro' && (
                <div className="mt-12 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg"><Check className="w-4 h-4 text-emerald-500" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-500 mb-1">Environment Readiness</h4>
                    <p className="text-xs text-zinc-500 font-mono leading-relaxed">Your current node (TERMUX_ALPHA) meets all hardware requirements for Phase 7 operations. Git synchronization is active.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}