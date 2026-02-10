import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState, Skill, Message, SkillStatus, AuditLog, LogLevel, ResearchQuery, ValidationReport, ValidationCheck, MCPServer, PluginItem } from './types';
import { ChatHandler } from './chat';
import { createMessage } from './utils';
export class ChatAgent extends Agent<Env, ChatState> {
  private chatHandler?: ChatHandler;
  initialState: ChatState = {
    messages: [],
    sessionId: crypto.randomUUID(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-1.5-flash',
    activeSkills: [],
    suggestedSkills: [],
    mcpServers: [
      { id: 'mcp-gh', name: '@anthropic/mcp-github', status: 'Connected', capabilities: ['resources', 'tools'], latency: 42 },
      { id: 'mcp-jira', name: 'jira-mcp-server', status: 'Connected', capabilities: ['tools'], latency: 120 }
    ],
    skills: [
      {
        id: 'python-dev',
        name: 'python-dev',
        icon: 'Cpu',
        triggerRegex: '.*\\.py',
        confidence: 85,
        successCount: 120,
        totalActivations: 140,
        status: 'Active' as SkillStatus,
        lastAdjustment: Date.now(),
        description: 'Lints, tests, and builds Python modules.',
        intentRules: ['test python', 'fix lint', 'run pytest'],
        hooks: { pre: 'validate_build --env py3', post: 'clean_pyc' },
        weight: 0.85
      },
      {
        id: 'security-audit',
        name: 'security-audit',
        icon: 'Shield',
        triggerRegex: 'auth|password|secret|key',
        confidence: 92,
        successCount: 45,
        totalActivations: 48,
        status: 'Standby' as SkillStatus,
        lastAdjustment: Date.now(),
        description: 'Automated vulnerability scanning for source code.',
        intentRules: ['scan secrets', 'audit security', 'check rsa'],
        hooks: { pre: 'nexus-gate --verify-sec' },
        weight: 0.92
      },
      {
        id: 'github-mcp',
        name: 'github-mcp',
        icon: 'Globe',
        triggerRegex: 'github|pr|repo|issue',
        confidence: 98,
        successCount: 200,
        totalActivations: 204,
        status: 'Active' as SkillStatus,
        lastAdjustment: Date.now(),
        description: 'Full GitHub lifecycle via MCP (PR review, CI monitoring).',
        intentRules: ['review pr', 'create repo', 'list issues'],
        weight: 0.99,
        isMcpPowered: true
      }
    ],
    resilience: {
      gatePassRate: 98.5,
      retryCount: 0,
      circuitBreakerStatus: 'Closed',
      avgLatency: 24,
      consecutiveFailures: 0
    },
    faultTolerance: {
      primaryPathActive: true,
      secondaryPathActive: false,
      recoverySuccessRate: 94.2,
      uptimeScore: 99.9,
      redundantSnapshotsCount: 3,
      daemonLastRun: new Date().toISOString()
    },
    researchHistory: [],
    auditLogs: [
      { id: 'EVT-000', level: 'Info', message: 'System warm-boot complete.', timestamp: new Date().toISOString(), metadata: { node: 'NEXUS_ALPHA' } }
    ],
    reporting: {
      totalOperations: 14282,
      avgLatency: 22,
      securityScore: 99.9,
      uptimeTrend: [99, 98, 99.9, 99.5, 100, 99.2, 99.9],
      failureCategories: { 'GATE_TIMEOUT': 12, 'SKILL_LOAD_FAIL': 3 },
      mcpToolCalls: 142,
      daemonSuccessRate: 98.4
    },
    environment: 'Termux',
    roadmap: [
      { id: 'R1', title: 'Core Infrastructure', status: 'completed', progress: 100 },
      { id: 'R2', title: 'Validation Gate', status: 'completed', progress: 100 },
      { id: 'R3', title: 'Skill Matrix', status: 'completed', progress: 100 },
      { id: 'R4', title: 'MCP & Daemon', status: 'current', progress: 92 }
    ],
    systemEnv: {
      ARCH: 'aarch64',
      NODE_VERSION: 'v20.12.0',
      CLAUDE_INFRA_ACTIVE: 'true'
    },
    workflow: {
      currentBranch: 'main',
      lastCommitHash: '8f2c3d4e',
      pipelineStatus: 'Idle',
      version: '1.0.42',
      changelog: ['Initial infrastructure commit'],
      scriptLogs: [],
      executionStep: 'Idle',
      artifacts: ['nexus-v1.0.42.zip', 'coverage-report.html'],
      webhookActive: true
    },
    plugins: [
      { id: 'rust-comp', name: 'rust-compiler', author: 'Nexus Community', rating: 4.8, status: 'Available', version: '1.2.0', category: 'DevTools', downloads: 1240 },
      { id: 'r2-sync', name: 'r2-sync-agent', author: 'Nexus Core', rating: 5.0, status: 'Installed', loadPath: '.plugins/r2-sync.js', version: '2.0.1', category: 'Storage', downloads: 850 }
    ],
    alerts: [],
    infraFiles: [
      { path: 'CLAUDE.md', type: 'Markdown', content: '# Project Memory\n\nStack: React, TypeScript, Cloudflare Agents\nNode: Nexus Alpha V2' },
      { path: '.mcp.json', type: 'JSON', content: '{\n  "servers": {\n    "github": { "command": "npx", "args": ["-y", "@anthropic-ai/mcp-server-github"] },\n    "jira": { "command": "npx", "args": ["-y", "jira-mcp-server"] }\n  }\n}' },
      { path: 'bin/daemon.sh', type: 'Shell', content: '#!/bin/bash\n# Nexus Daemon v1.0\n# Automated Snapshot & Maintenance for Termux Tasker\n\n[[ -z "${NEXUS_HOME}" ]] && exit 1\n\n# Daily prune of snapshots older than 7 days\nfind "${NEXUS_HOME}/snapshots" -mtime +7 -exec rm {} \\;\n\n# Trigger validation gate\n"${NEXUS_HOME}/bin/validate_build" --silent || exit 6\n\necho "[DAEMON] $(date) Maintenance complete." >> "${NEXUS_HOME}/logs/daemon.log"' },
      { path: '.vscode/settings.json', type: 'JSON', content: '{\n  "mcp.enableAllProjectMcpServers": true,\n  "mcp.autoDiscoverServers": true\n}' }
    ],
    agentProfiles: [
      { id: 'code-reviewer', name: 'ReviewerBot', role: 'Security & Quality Gatekeeper', specification: 'Focus on RSA/PEM scanning.' }
    ],
    availableCommands: ['/ticket', '/pr-review', '/help', '/mcp-status', '/trigger-daemon', '/validate']
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(this.env.CF_AI_BASE_URL, this.env.CF_AI_API_KEY, this.state.model);
    this.emitSystemLog('INFO', 'Nexus node initialized with MCP & Daemon v17.');
  }
  private emitSystemLog(level: LogLevel, content: string, intentMatch?: string) {
    const timestamp = Date.now();
    const log: Message = { id: crypto.randomUUID(), role: 'system', content, timestamp, isSystemLog: true, level, intentMatch };
    let auditLevel: AuditLog['level'] = 'Info';
    if (level === 'ERROR' || level === 'FATAL') auditLevel = 'Error';
    if (level === 'RECOVERY') auditLevel = 'Recovery';
    if (level === 'GATE_PASS') auditLevel = 'Gate_Pass';
    if (level === 'MCP_TOOL') auditLevel = 'MCP';
    if (level === 'DAEMON') auditLevel = 'Daemon';
    if (level === 'DEPLOY' || level === 'DEPLOYMENT_START') auditLevel = 'Deploy';
    let parsedMetadata = {};
    if (intentMatch) {
      try { parsedMetadata = JSON.parse(intentMatch); } catch (e) { parsedMetadata = { raw: intentMatch }; }
    }
    const auditEntry: AuditLog = {
      id: `EVT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      level: auditLevel,
      message: content,
      timestamp: new Date(timestamp).toISOString(),
      metadata: parsedMetadata
    };
    this.setState({
      ...this.state,
      messages: [...this.state.messages, log].slice(-200),
      auditLogs: [auditEntry, ...this.state.auditLogs].slice(0, 100)
    });
  }
  private evaluateIntentV3(query: string): { skillId: string; rank: number }[] {
    const scores = this.state.skills.map(skill => {
      let matchScore = 0;
      skill.intentRules?.forEach(rule => {
        if (query.toLowerCase().includes(rule.toLowerCase())) matchScore += 1;
      });
      const regex = new RegExp(skill.triggerRegex, 'i');
      if (regex.test(query)) matchScore += 2;
      const finalRank = matchScore * (skill.weight || 0.5);
      return { skillId: skill.id, rank: finalRank };
    });
    return scores.filter(s => s.rank > 0).sort((a, b) => b.rank - a.rank);
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/messages') return Response.json({ success: true, data: this.state });
    if (request.method === 'POST' && url.pathname === '/chat') {
      const body = await request.json() as { message: string };
      if (body.message.startsWith('/')) return this.handleCommand(body.message);
      return this.handleChatMessage(body);
    }
    return Response.json({ success: false, error: 'Not Found' }, { status: 404 });
  }
  private async handleChatMessage(body: { message: string }): Promise<Response> {
    const { message } = body;
    const rankedIntents = this.evaluateIntentV3(message);
    if (rankedIntents.length > 0) {
      const topMatch = rankedIntents[0];
      this.emitSystemLog('INTENT_MATCH', `Fuzzy match: ${topMatch.skillId} (Rank: ${topMatch.rank.toFixed(2)})`, JSON.stringify(topMatch));
      const suggested = [topMatch.skillId];
      await this.setState({ ...this.state, suggestedSkills: suggested });
    }
    const history = [...this.state.messages];
    this.setState({ ...this.state, messages: [...history, createMessage('user', message)], isProcessing: true });
    try {
      const response = await this.chatHandler!.processMessage(message, history, undefined, this.state.activeSkills, this.state.skills);
      this.setState({
        ...this.state,
        messages: [...this.state.messages, createMessage('assistant', response.content, response.toolCalls)],
        isProcessing: false,
        suggestedSkills: []
      });
      return Response.json({ success: true, data: this.state });
    } catch (e) {
      this.setState({ ...this.state, isProcessing: false });
      return Response.json({ success: false, error: 'Chat error' }, { status: 500 });
    }
  }
  private async handleCommand(command: string): Promise<Response> {
    const base = command.split(' ')[0];
    let content = '';
    let level: LogLevel = 'INFO';
    if (base === '/mcp-status') {
      content = `MCP Ecosystem: ${this.state.mcpServers.length} servers active. Latency nominal.`;
      level = 'MCP_TOOL';
    } else if (base === '/trigger-daemon') {
      content = `Manual daemon sweep initiated. Pruning logs and syncing snapshots...`;
      level = 'DAEMON';
      await this.setState({ ...this.state, faultTolerance: { ...this.state.faultTolerance, daemonLastRun: new Date().toISOString() } });
    } else {
      content = `Executed command: ${base}`;
    }
    const sysMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content, timestamp: Date.now(), level };
    this.setState({ ...this.state, messages: [...this.state.messages, sysMsg] });
    return Response.json({ success: true, data: this.state });
  }
}