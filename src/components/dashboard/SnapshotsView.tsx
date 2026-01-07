import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Trash2, Filter, Copy, CheckCircle2, ShieldAlert, RotateCcw, CloudUpload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
const snapshots = [
  { id: 'SNP-0942', timestamp: '2024-05-20 14:20:12', size: '142 MB', status: 'Valid', hash: 'e3b0c442...a1b2c3d4', isDeployed: true },
  { id: 'SNP-0941', timestamp: '2024-05-20 12:05:01', size: '138 MB', status: 'Valid', hash: '8f2c3d4e...f5e6a7b8', isDeployed: false },
  { id: 'SNP-0940', timestamp: '2024-05-19 23:58:44', size: '145 MB', status: 'Deferred', hash: '7a8b9c0d...1f2e3d4c', isDeployed: false },
  { id: 'SNP-0939', timestamp: '2024-05-19 18:42:12', size: '141 MB', status: 'Valid', hash: '3d4c5b6a...7e8f9a0b', isDeployed: false },
];
export function SnapshotsView() {
  const [verifying, setVerifying] = useState<string | null>(null);
  const handleRollback = (id: string) => {
    toast.info(`Initiating system rollback to ${id}...`);
    setTimeout(() => {
      toast.success(`Node successfully restored to snapshot ${id}.`);
    }, 2000);
  };
  const handleExportDeploy = () => {
    toast.success("Deployment script generated for Cloudflare Workers.");
  };
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input className="bg-zinc-900 border-white/10 pl-10 text-xs font-mono h-10" placeholder="Search by ID or Hash..." />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportDeploy} variant="outline" className="bg-zinc-900 border-white/10 text-xs font-mono h-10">
            <CloudUpload className="w-3.5 h-3.5 mr-2" /> EXPORT_DEPLOY
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-500 border-none text-white text-xs font-mono h-10 px-6">
            CREATE_SNAPSHOT
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-white/5 bg-zinc-900/50 overflow-hidden">
        <ScrollArea className="w-full">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="bg-zinc-900/80">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[100px] font-mono text-zinc-500 uppercase text-[10px]">ID</TableHead>
                  <TableHead className="font-mono text-zinc-500 uppercase text-[10px]">Timestamp</TableHead>
                  <TableHead className="font-mono text-zinc-500 uppercase text-[10px]">Status</TableHead>
                  <TableHead className="font-mono text-zinc-500 uppercase text-[10px]">Redundancy</TableHead>
                  <TableHead className="text-right font-mono text-zinc-500 uppercase text-[10px]">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshots.map((s) => (
                  <TableRow key={s.id} className="border-white/5 hover:bg-zinc-800/40 transition-colors">
                    <TableCell className="font-mono text-xs">
                       <div className="flex items-center gap-2">
                          <span className="text-zinc-100">{s.id}</span>
                          {s.isDeployed && <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[8px] h-4">DEPLOYED</Badge>}
                       </div>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-zinc-400">{s.timestamp}</TableCell>
                    <TableCell>
                      <Badge className={s.status === 'Valid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]'}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex gap-1">
                          {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />)}
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-[9px] font-mono text-zinc-500 hover:text-yellow-500">
                              <RotateCcw className="w-3 h-3 mr-1" /> ROLLBACK
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950 border border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-zinc-100 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                Rollback Verification Required
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400 text-sm font-mono">
                                Restoring to snapshot {s.id} will revert the current node state to {s.timestamp}.
                                Any uncommitted changes in the local buffer will be PERMANENTLY LOST.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-zinc-900 border-white/5 text-zinc-400 text-xs uppercase font-mono">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRollback(s.id)}
                                className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs uppercase font-mono"
                              >
                                EXECUTE_RESTORE
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-cyan-500"><Download className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg flex items-center gap-4">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <div className="flex-1">
          <h4 className="text-xs font-bold text-yellow-500">Rollback Safety Active</h4>
          <p className="text-[10px] text-zinc-500 font-mono">Restoration points are limited to snapshots that have cleared the triple-gate integrity scan. System state is cached before rollback.</p>
        </div>
      </div>
    </div>
  );
}