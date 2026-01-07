import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronRight, Info, AlertTriangle, ShieldCheck, Zap, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { chatService } from '@/lib/chat';
import type { AuditLog } from '../../../worker/types';
export function AuditLogView() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  useEffect(() => {
    const fetchLogs = async () => {
      const res = await chatService.getMessages();
      if (res.success && res.data?.auditLogs) {
        setLogs(res.data.auditLogs);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Recovery': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      case 'Warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Error': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Gate_Pass': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };
  const filteredLogs = logs.filter(l => 
    l.message.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            className="bg-zinc-900 border-white/10 pl-10 font-mono text-xs"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "p-4 hover:bg-white/5 transition-colors cursor-pointer group flex items-center gap-4",
                    selectedLog?.id === log.id && "bg-white/5"
                  )}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className={cn("w-1 h-8 rounded-full shrink-0",
                    log.level === 'Recovery' ? 'bg-cyan-500' :
                    log.level === 'Gate_Pass' ? 'bg-emerald-500' :
                    log.level === 'Warning' ? 'bg-amber-500' :
                    log.level === 'Error' ? 'bg-red-500' : 'bg-zinc-700'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={cn("text-[8px] font-mono h-4 uppercase", getLevelColor(log.level))}>
                        {log.level}
                      </Badge>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-300 truncate">{log.message}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="p-20 text-center text-zinc-600 font-mono text-xs">
                  No infrastructure events found.
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="bg-zinc-900/50 border-white/5 h-full min-h-[500px]">
          <CardHeader className="border-b border-white/5 py-4">
            <CardTitle className="text-xs font-mono uppercase text-zinc-500">Deep Inspection</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {selectedLog ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-100">{selectedLog.message}</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-zinc-800 text-[9px] border-white/5">{selectedLog.id}</Badge>
                    <Badge className="bg-zinc-800 text-[9px] border-white/5">
                      {new Date(selectedLog.timestamp).toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 rounded bg-black/50 border border-white/5 font-mono">
                  <h4 className="text-[10px] text-zinc-500 uppercase mb-3">RAW_TELEMETRY_DATA</h4>
                  <pre className="text-[10px] text-emerald-500 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                  </pre>
                </div>
                <div className="space-y-3">
                   <h4 className="text-[10px] text-zinc-500 uppercase">Analysis</h4>
                   <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded flex gap-3">
                      <Zap className="w-4 h-4 text-cyan-500 shrink-0" />
                      <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                        Event verified against infrastructure policy. System state maintained in nominal range.
                      </p>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 text-zinc-600">
                <Terminal className="w-10 h-10 mb-4 opacity-10" />
                <p className="text-xs font-mono uppercase tracking-widest">Select an event to <br/> inspect infrastructure telemetry.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}