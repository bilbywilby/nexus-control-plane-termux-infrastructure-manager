import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Terminal, Send, Trash2, Cpu, ShieldCheck, Zap, Info, WifiOff } from 'lucide-react';
import { Message } from '../../../worker/types';
import { cn } from '@/lib/utils';
import { useNetwork } from '@/hooks/use-network';
export function TerminalWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeContext, setActiveContext] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isOnline } = useNetwork();
  useEffect(() => {
    const cached = localStorage.getItem('nexus_terminal_cache');
    if (cached) {
      setMessages(JSON.parse(cached));
    }
    loadMessages();
  }, []);
  useEffect(() => {
    localStorage.setItem('nexus_terminal_cache', JSON.stringify(messages.slice(-50)));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.skillInsight) {
      setActiveContext(lastMsg.skillInsight.toUpperCase());
    }
  }, [messages, isLoading]);
  const loadMessages = async () => {
    if (!isOnline) return;
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages);
    }
  };
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    const tempMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMsg,
      timestamp: Date.now(),
      isQueued: !isOnline
    };
    setMessages(prev => [...prev, tempMessage]);
    if (!isOnline) return;
    setIsLoading(true);
    const res = await chatService.sendMessage(userMsg);
    if (res.success) {
      await loadMessages();
    }
    setIsLoading(false);
  };
  const handleClear = async () => {
    if (isOnline) await chatService.clearMessages();
    setMessages([]);
    localStorage.removeItem('nexus_terminal_cache');
    setActiveContext(null);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] bg-black border border-emerald-500/20 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)] font-mono animate-fade-in">
      <div className="bg-zinc-900/80 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nexus_Shell_v2.0</span>
          {!isOnline && (
            <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-500 bg-amber-500/5 gap-1">
              <WifiOff className="w-3 h-3" /> OFFLINE
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
           {activeContext && (
             <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-500 font-bold">
               <Zap className="w-3 h-3" />
               CONTEXT: {activeContext}
             </div>
           )}
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleClear} className="h-6 w-6 text-zinc-500 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex flex-col gap-1", m.role === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "max-w-[85%] px-3 py-2 rounded text-xs",
              m.role === 'user' ? "bg-zinc-900 text-zinc-300 border border-zinc-800" : "bg-emerald-500/5 text-emerald-400 border border-emerald-500/10"
            )}>
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[9px] font-bold opacity-50 uppercase">
                  {m.role === 'user' ? 'LOCAL_OP' : 'NEXUS_AGENT'}
                </span>
                {m.isQueued && (
                  <Badge variant="outline" className="text-[8px] h-3 px-1 border-amber-500/30 text-amber-500">QUEUED</Badge>
                )}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-500/50 text-xs animate-pulse font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>HEALING_RECOVERY_SYNC...</span>
          </div>
        )}
      </div>
      <div className="p-4 bg-zinc-900/50 border-t border-white/5">
        <div className="relative flex items-center gap-2 bg-black rounded border border-emerald-500/20 px-3">
          <span className="text-emerald-500 text-sm font-bold">$</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isOnline ? "System command..." : "Offline - Commands will queue..."}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-zinc-300 text-xs h-10"
          />
          <Button size="icon" variant="ghost" onClick={handleSend} disabled={isLoading} className="text-emerald-500">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}