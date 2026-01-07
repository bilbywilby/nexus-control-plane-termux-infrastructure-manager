import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Trash2, Filter, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
const snapshots = [
  { id: 'SNP-0942', timestamp: '2024-05-20 14:20:12', size: '142 MB', status: 'Valid', hash: 'e3b0c442...a1b2c3d4' },
  { id: 'SNP-0941', timestamp: '2024-05-20 12:05:01', size: '138 MB', status: 'Valid', hash: '8f2c3d4e...f5e6a7b8' },
  { id: 'SNP-0940', timestamp: '2024-05-19 23:58:44', size: '145 MB', status: 'Deferred', hash: '7a8b9c0d...1f2e3d4c' },
  { id: 'SNP-0939', timestamp: '2024-05-19 18:42:12', size: '141 MB', status: 'Valid', hash: '3d4c5b6a...7e8f9a0b' },
  { id: 'SNP-0938', timestamp: '2024-05-19 10:12:33', size: '139 MB', status: 'Valid', hash: '1b2a3c4d...5e6f7a8b' },
  { id: 'SNP-0937', timestamp: '2024-05-18 20:30:15', size: '140 MB', status: 'Valid', hash: 'f9e8d7c6...b5a43210' },
];
export function SnapshotsView() {
  const [verifying, setVerifying] = useState<string | null>(null);
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Integrity hash copied to clipboard");
  };
  const handleVerify = (id: string) => {
    setVerifying(id);
    setTimeout(() => {
      setVerifying(null);
      toast.success(`${id} integrity verified via triple-gate scan.`);
    }, 1500);
  };
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            className="bg-zinc-900 border-white/10 pl-10 text-xs font-mono h-10"
            placeholder="Search by ID or Hash..."
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="bg-zinc-900 border-white/10 text-xs font-mono h-10">
            <Filter className="w-3.5 h-3.5 mr-2" /> Filter
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-500 border-none text-white text-xs font-mono h-10">
            Create Snapshot
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-white/5 bg-zinc-900/50 overflow-hidden">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="bg-zinc-900/80">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[100px] font-mono text-zinc-500 uppercase text-[10px]">ID</TableHead>
                  <TableHead className="font-mono text-zinc-500 uppercase text-[10px]">Timestamp</TableHead>
                  <TableHead className="font-mono text-zinc-500 uppercase text-[10px]">Size</TableHead>
                  <TableHead className="font-mono text-zinc-500 uppercase text-[10px]">Status</TableHead>
                  <TableHead className="font-mono text-zinc-500 uppercase text-[10px]">Integrity (SHA-256)</TableHead>
                  <TableHead className="text-right font-mono text-zinc-500 uppercase text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshots.map((s) => (
                  <TableRow key={s.id} className="border-white/5 hover:bg-zinc-800/40 transition-colors">
                    <TableCell className="font-mono text-xs text-zinc-300">{s.id}</TableCell>
                    <TableCell className="font-mono text-xs text-zinc-400">{s.timestamp}</TableCell>
                    <TableCell className="font-mono text-xs text-zinc-300">{s.size}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          s.status === 'Valid'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]'
                        }
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 group">
                        <span className="font-mono text-[10px] text-zinc-500">{s.hash}</span>
                        <Copy 
                          className="w-3 h-3 text-zinc-700 cursor-pointer hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                          onClick={() => copyHash(s.hash)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[9px] font-mono text-zinc-500 hover:text-emerald-500"
                          onClick={() => handleVerify(s.id)}
                          disabled={verifying === s.id}
                        >
                          {verifying === s.id ? (
                            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          )}
                          VERIFY
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-cyan-500">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-mono text-zinc-600">Showing 6 of 142 snapshots in node storage</p>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-mono bg-zinc-900 border-white/5">Prev</Button>
           <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-mono bg-zinc-900 border-white/5">Next</Button>
        </div>
      </div>
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-4">
        <ShieldAlert className="w-5 h-5 text-emerald-500" />
        <div className="flex-1">
          <h4 className="text-xs font-bold text-emerald-500">Triple-Gate Snapshot Protection</h4>
          <p className="text-[10px] text-zinc-500 font-mono">Each snapshot is verified across three independent validation paths before being committed to the permanent registry.</p>
        </div>
      </div>
    </div>
  );
}