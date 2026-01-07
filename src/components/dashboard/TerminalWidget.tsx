import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatService } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Terminal, Send, Trash2, Zap, ShieldCheck, Sparkles, Command, Info } from 'lucide-react';
import type { Message, LogLevel } from '../../../worker/types';
import { cn } from '@/lib/utils';
import { useNetwork } from '@/hooks/use-network';
import { motion, AnimatePresence } from 'framer-motion';
export function TerminalWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableCommands, setAvailableCommands] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isOnline } = useNetwork();
  const loadData = useCallback(async () => {
    if (!isOnline) return;
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages);
      setAvailableCommands(res.data.availableCommands);
      setSuggestedSkills(res.data.suggestedSkills || []);
    }
  }, [isOnline]);
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const cmd = input.trim();
    setInput('');
    setIsLoading(true);
    if (cmd.startsWith('/')) {
      await chatService.executeCommand(cmd);
    } else {
      await chatService.sendMessage(cmd);
    }
    await loadData();
    setIsLoading(false);
  };
  const getLogStyle = (m: Message) => {
    if (m.level === 'INTENT_MATCH' || m.level === 'INTENT_SUGGESTION') return 'text-cyan-400 font-bold';
    if (m.level === 'HOOK_EXEC') return 'text-amber-400 font-bold';
    if (m.level === 'GATE_PASS') return 'text-emerald-500 font-bold';
    return m.role === 'user' ? 'text-zinc-300' : 'text-emerald-400';
  };
  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] bg-[#020202] border border-emerald-500/20 rounded-lg overflow-hidden font-mono shadow-[0_0_40px_rgba(16,185,129,0.05)]">
      <div className="bg-zinc-900/80 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nexus_Infra_Console_v2.1</span>
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] h-4">INTENT_EVAL_ACTIVE</Badge>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500" onClick={() => chatService.clearMessages()}><Trash2 className="w-3 h-3" /></Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((m, idx) => (
          <div key={m.id || `msg-${idx}`} className="flex gap-3 text-[11px] leading-relaxed group animate-in fade-in duration-300">
            <span className="text-zinc-800 shrink-0">[{new Date(m.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit' })}]</span>
            <div className="flex-1 min-w-0">
              <span className={cn("uppercase font-bold shrink-0 mr-2", m.role === 'user' ? 'text-cyan-500' : 'text-emerald-500')}>
                {m.role === 'user' ? 'LOCAL_OP>' : 'NEXUS_AGENT>'}
              </span>
              {m.level === 'INTENT_SUGGESTION' && <Sparkles className="inline-block w-3 h-3 text-cyan-400 mr-2 animate-pulse" />}
              <span className={getLogStyle(m)}>{m.content}</span>
              {m.intentMatch && <span className="ml-2 text-[8px] text-zinc-700 bg-zinc-900 px-1 rounded">Pattern: {m.intentMatch}</span>}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-emerald-500/50 text-[11px] animate-pulse flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> EVALUATING_INTENT_CONTEXT...
        </div>}
      </div>
      <AnimatePresence>
        {suggestedSkills.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-500/10 border-t border-emerald-500/20 px-4 py-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-tighter">
                Dynamic Context Optimization: Loading {suggestedSkills.join(', ')}
              </span>
            </div>
            <Info className="w-3.5 h-3.5 text-emerald-600 cursor-help" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-3 bg-zinc-900/30 border-t border-white/5 space-y-2">
        {input.startsWith('/') && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {availableCommands.filter(c => c.startsWith(input)).map(c => (
              <Badge key={c} variant="outline" className="cursor-pointer hover:bg-emerald-500/10 border-emerald-500/20 text-emerald-500 font-mono text-[9px]" onClick={() => setInput(c)}>
                {c}
              </Badge>
            ))}
          </div>
        )}
        <div className="relative flex items-center gap-2 bg-black rounded border border-emerald-500/20 px-3">
          <Command className="w-3.5 h-3.5 text-emerald-500/50" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type command or natural intent (e.g., 'deploy to prod')..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-zinc-300 text-[11px] h-9"
          />
          <Button size="icon" variant="ghost" onClick={handleSend} disabled={isLoading} className="text-emerald-500 h-8 w-8 hover:bg-emerald-500/10">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}