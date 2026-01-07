import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Terminal, Cpu, Shield, Book, ChevronRight, Copy, Check, FileText, GitBranch, Github, Code, FolderTree } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { InfrastructureFile } from '../../../worker/types';
export function DocumentationView() {
  const [selectedPath, setSelectedPath] = useState('CLAUDE.md');
  const [search, setSearch] = useState('');
  const [infraFiles, setInfraFiles] = useState<InfrastructureFile[]>([]);
  const [activeTab, setActiveTab] = useState('blueprint');
  useEffect(() => {
    const fetchFiles = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data?.infraFiles) {
        setInfraFiles(res.data.infraFiles);
      }
    };
    fetchFiles();
  }, []);
  const currentFile = infraFiles.find(f => f.path === selectedPath);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Content copied to clipboard");
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900 border-white/5">
          <TabsTrigger value="blueprint" className="gap-2 font-mono text-[10px] uppercase">
            <FolderTree className="w-3.5 h-3.5" /> Project Blueprint
          </TabsTrigger>
          <TabsTrigger value="guides" className="gap-2 font-mono text-[10px] uppercase">
            <Book className="w-3.5 h-3.5" /> Operations Guide
          </TabsTrigger>
        </TabsList>
        <TabsContent value="blueprint" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                className="bg-zinc-900 border-white/10 pl-10 h-10 text-xs font-mono"
                placeholder="Filter files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Card className="bg-zinc-900/50 border-white/5">
              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-1">
                  {infraFiles.filter(f => f.path.toLowerCase().includes(search.toLowerCase())).map(file => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedPath(file.path)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded text-left transition-all ${selectedPath === file.path ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'hover:bg-white/5 text-zinc-500'}`}
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] font-mono truncate">{file.path}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
          <Card className="lg:col-span-3 bg-black/40 border-white/5 p-6 min-h-[600px] flex flex-col">
            {currentFile ? (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded">
                      <Code className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-100">{currentFile.path}</h3>
                      <Badge variant="outline" className="text-[9px] font-mono opacity-60">TYPE: {currentFile.type}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currentFile.content)}>
                    <Copy className="w-3 h-3 mr-2" /> COPY
                  </Button>
                </div>
                <div className="flex-1 bg-black/60 p-6 rounded-lg border border-white/5 font-mono">
                  <pre className="text-xs text-emerald-500/90 whitespace-pre-wrap leading-relaxed">
                    {currentFile.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                <FolderTree className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-xs font-mono uppercase tracking-widest">Select an infrastructure file to inspect.</p>
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="guides">
          <div className="flex items-center justify-center py-20 text-zinc-600 font-mono text-xs">
            Standard documentation migrated to Project Blueprint for live synthesis.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}