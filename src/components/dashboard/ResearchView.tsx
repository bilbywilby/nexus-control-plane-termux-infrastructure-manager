import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Search, Brain, ExternalLink, Download, Clock, Loader2, Database } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { ResearchQuery } from '../../../worker/types';
export function ResearchView() {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [history, setHistory] = useState<ResearchQuery[]>([]);
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data?.researchHistory) {
        setHistory(res.data.researchHistory);
      }
    };
    fetchHistory();
  }, []);
  const handleResearch = async () => {
    if (!query.trim()) return;
    setIsScanning(true);
    try {
      const res = await chatService.conductResearch(query);
      if (res.success && res.data) {
        setHistory(prev => [res.data!, ...prev]);
        setQuery('');
        toast.success("Research synthesis complete.");
      } else {
        toast.error(res.error || "Research failed");
      }
    } catch (e) {
      toast.error("Research engine offline.");
    } finally {
      setIsScanning(false);
    }
  };
  const handleSyncToSnapshot = (id: string) => {
    toast.info(`Syncing research findings from ${id} to current snapshot...`);
    setTimeout(() => {
      toast.success("Synthesis committed to infrastructure registry.");
    }, 1500);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-500" /> Emerging Research Engine
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Synthesize new infrastructure patterns or troubleshoot architecture..."
              className="bg-zinc-900 border-white/10 pl-10 h-12 text-sm font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            />
          </div>
          <div className="flex items-center gap-4 px-4 bg-zinc-900/50 rounded-lg border border-white/5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Skill Scan</span>
            <Switch defaultChecked />
            <Button onClick={handleResearch} disabled={isScanning} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs h-9">
              {isScanning ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Search className="w-3 h-3 mr-2" />}
              INIT_RESEARCH
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        <AnimatePresence>
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
                <CardHeader className="pb-3 border-b border-white/5 bg-zinc-900/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center">
                        <Database className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-mono text-zinc-100">{item.id}</CardTitle>
                        <p className="text-[10px] text-zinc-500 font-mono">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{item.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-cyan-500 uppercase mb-1">Query</h4>
                    <p className="text-sm text-zinc-300 font-medium italic">"{item.question}"</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-emerald-500 uppercase mb-1">Synthesis Results</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-mono bg-black/30 p-3 rounded border border-white/5">
                      {item.results || "Synthesis in progress..."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">Confidence</span>
                        <span className="text-xs font-mono text-cyan-400">{item.confidence}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">Sources</span>
                        <div className="flex gap-2">
                          {item.sources.map((s, i) => (
                            <span key={i} className="text-[9px] font-mono text-zinc-400 underline cursor-pointer hover:text-cyan-500 flex items-center gap-1">
                              <ExternalLink className="w-2 h-2" /> {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSyncToSnapshot(item.id)}
                      className="h-8 text-[10px] font-mono bg-zinc-900 border-white/10 hover:bg-zinc-800"
                    >
                      <Download className="w-3 h-3 mr-2" /> EXPORT_TO_SNAPSHOT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {history.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-xl">
            <Clock className="w-10 h-10 mb-4 opacity-20" />
            <p className="text-sm font-mono">No research queries in current session buffer.</p>
          </div>
        )}
      </div>
    </div>
  );
}