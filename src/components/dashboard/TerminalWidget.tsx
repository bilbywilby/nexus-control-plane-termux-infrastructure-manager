import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatService } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Terminal, Send, Trash2, Zap, WifiOff, Clock } from 'lucide-react';
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
  const loadMessages = useCallback(async () => {
    if (!isOnline) return;
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages);
    }
  }, [isOnline]);
  useEffect(() => {
    const cached = localStorage.getItem('nexus_terminal_cache');
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse cache", e);
      }
    }
    loadMessages();
  }, [loadMessages]);
  useEffect(() => {
    localStorage.setItem('nexus_terminal_cache', JSON.stringify(messages.slice(-50)));
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.skillInsight) {
      setActiveContext(lastMsg.skillInsight.toUpperCase());
    }
  }, [messages, isLoading]);
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
  const getLogLevelStyle = (level?: string) => {
    switch (level) {
      case 'ERROR': case 'FATAL': return 'text-red-500';
      case 'WARN': return 'text-amber-500';
      case 'INFO': case 'GATE_PASS': return 'text-emerald-500';
      case 'RECOVERY': return 'text-cyan-500';
      case 'DEBUG': return 'text-zinc-600';
      default: return 'text-zinc-400';
    }
  };
  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] bg-black border border-emerald-500/20 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)] font-mono animate-fade-in">
      <div className="bg-zinc-900/80 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nexus_Shell_v2.0</span>
          <div className="flex items-center gap-1.5 ml-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-tighter">Live_Tail_Active</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {activeContext && (
             <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-500 font-bold">
               <Zap className="w-3 h-3" /> CONTEXT: {activeContext}
             </div>
           )}
          <Button variant="ghost" size="icon" onClick={handleClear} className="h-6 w-6 text-zinc-500 hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth bg-[#020202]">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-3 text-[11px] leading-relaxed group">
            <span className="text-zinc-700 shrink-0 select-none">[{new Date(m.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
            <div className="flex-1 min-w-0">
              {m.isSystemLog ? (
                <div className="flex gap-2">
                  <span className={cn("font-bold shrink-0", getLogLevelStyle(m.level))}>[{m.level || 'INFO'}]</span>
                  <span className="text-zinc-400 break-words">{m.content}</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <span className={cn("font-bold uppercase shrink-0", m.role === 'user' ? "text-cyan-500" : "text-emerald-500")}>
                    {m.role === 'user' ? 'LOCAL_OP>' : 'NEXUS_AGENT>'}
                  </span>
                  <span className={cn(m.role === 'user' ? "text-zinc-300" : "text-emerald-400")}>{m.content}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-500/50 text-[11px] animate-pulse py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>NEXUS_AGENT IS THINKING...</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-zinc-900/50 border-t border-white/5">
        <div className="relative flex items-center gap-2 bg-black rounded border border-emerald-500/20 px-3">
          <span className="text-emerald-500 text-sm font-bold">$</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isOnline ? "Enter system command..." : "Offline - Commands will queue..."}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-zinc-300 text-[11px] h-9"
          />
          <Button size="icon" variant="ghost" onClick={handleSend} disabled={isLoading} className="text-emerald-500 h-8 w-8">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}