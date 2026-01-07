import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Terminal, Shield, Globe, Layers, Zap } from 'lucide-react';
const skills = [
  { 
    name: 'python-dev', 
    icon: <Cpu className="w-4 h-4" />, 
    status: 'Active', 
    trigger: 'regex: /.*\.py$/', 
    lastUsed: '2m ago',
    desc: 'Lints, tests, and builds Python modules.' 
  },
  { 
    name: 'security-audit', 
    icon: <Shield className="w-4 h-4" />, 
    status: 'Standby', 
    trigger: 'trigger: on_push', 
    lastUsed: '4h ago',
    desc: 'Automated vulnerability scanning for source code.' 
  },
  { 
    name: 'web-deploy', 
    icon: <Globe className="w-4 h-4" />, 
    status: 'Active', 
    trigger: 'regex: /dist\/.*/', 
    lastUsed: '14h ago',
    desc: 'Cloudflare Workers and Pages synchronization.' 
  },
  { 
    name: 'termux-shell', 
    icon: <Terminal className="w-4 h-4" />, 
    status: 'Active', 
    trigger: 'direct_input', 
    lastUsed: 'Now',
    desc: 'Raw bash execution and local file management.' 
  },
  { 
    name: 'archive-sync', 
    icon: <Layers className="w-4 h-4" />, 
    status: 'Active', 
    trigger: 'schedule: hourly', 
    lastUsed: '42m ago',
    desc: 'R2 bucket synchronization for snapshots.' 
  },
  { 
    name: 'build-optimizer', 
    icon: <Zap className="w-4 h-4" />, 
    status: 'Standby', 
    trigger: 'size > 10MB', 
    lastUsed: '2d ago',
    desc: 'Modular skill for asset compression.' 
  }
];
export function SkillsView() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Active Skill Matrix
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <Card key={skill.name} className="bg-zinc-900/50 border-white/5 hover:border-emerald-500/30 transition-all group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 border border-white/5 text-zinc-400 group-hover:text-emerald-500 transition-colors">
                  {skill.icon}
                </div>
                <CardTitle className="text-xs font-mono uppercase text-zinc-100">{skill.name}</CardTitle>
              </div>
              <Badge 
                variant="outline" 
                className={
                  skill.status === 'Active' 
                    ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10 text-[10px]' 
                    : 'border-zinc-700 text-zinc-500 bg-zinc-800/50 text-[10px]'
                }
              >
                {skill.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-2 h-8">{skill.desc}</p>
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-600">TRIGGER</span>
                  <span className="text-[10px] font-mono text-zinc-400">{skill.trigger}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-600">LAST_OP</span>
                  <span className="text-[10px] font-mono text-zinc-400">{skill.lastUsed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}