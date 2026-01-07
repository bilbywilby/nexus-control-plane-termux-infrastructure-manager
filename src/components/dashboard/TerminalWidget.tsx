import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, Send, Trash2, Cpu, ShieldCheck } from 'lucide-react';
import { Message } from '../../../worker/types';
import { cn } from '@/lib/utils';
export function TerminalWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    loadMessages();
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  const loadMessages = async () => {
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages);
    }
  };
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);
    // Optimistic UI
    const tempId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: tempId,
      role: 'user',
      content: userMsg,
      timestamp: Date.now()
    }]);
    const res = await chatService.sendMessage(userMsg);
    if (res.success) {
      await loadMessages();
    }
    setIsLoading(false);
  };
  const handleClear = async () => {
    await chatService.clearMessages();
    setMessages([]);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] bg-black border border-emerald-500/20 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)] font-mono animate-fade-in">
      {/* Terminal Header */}
      <div className="bg-zinc-900/80 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nexus_Shell_v2.0</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleClear} className="h-6 w-6 text-zinc-500 hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          </div>
        </div>
      </div>
      {/* Message Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="text-[10px] text-zinc-600 border-b border-zinc-800/50 pb-2 mb-4">
          CONNECTED TO REMOTE_AGENT_DO :: [AUTH_OK] :: [GATE_ACTIVE]
        </div>
        {messages.length === 0 && !isLoading && (
          <div className="text-zinc-700 text-xs italic">
            Waiting for input. Use 'help' to see available infrastructure commands...
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn(
            "flex flex-col gap-1",
            m.role === 'user' ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "max-w-[85%] px-3 py-2 rounded text-xs",
              m.role === 'user' 
                ? "bg-zinc-900 text-zinc-300 border border-zinc-800" 
                : "bg-emerald-500/5 text-emerald-400 border border-emerald-500/10"
            )}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold opacity-50 uppercase">
                  {m.role === 'user' ? 'Local_User' : 'Nexus_Core'}
                </span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              {m.toolCalls && m.toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-emerald-500/10 space-y-1">
                   {m.toolCalls.map((tc, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-[10px] text-cyan-500/80 italic">
                        <Cpu className="w-3 h-3" />
                        <span>Exec: {tc.name}({JSON.stringify(tc.arguments)})</span>
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-500/50 text-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Agent processing...</span>
          </div>
        )}
      </div>
      {/* Input Area */}
      <div className="p-4 bg-zinc-900/50 border-t border-white/5">
        <div className="relative flex items-center gap-2 bg-black rounded border border-emerald-500/20 px-3">
          <span className="text-emerald-500 text-sm font-bold">$</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter command or query..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-zinc-300 text-xs h-10 placeholder:text-zinc-800"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleSend}
            disabled={isLoading}
            className="text-emerald-500 hover:bg-emerald-500/10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}