import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState, Skill, Message, SkillStatus, ResearchQuery, AuditLog } from './types';
import { ChatHandler } from './chat';
import { createMessage } from './utils';
export class ChatAgent extends Agent<Env, ChatState> {
  private chatHandler?: ChatHandler;
  initialState: ChatState = {
    messages: [],
    sessionId: crypto.randomUUID(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.5-flash',
    activeSkills: [],
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
        description: 'Lints, tests, and builds Python modules.'
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
        description: 'Automated vulnerability scanning for source code.'
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
      redundantSnapshotsCount: 3
    },
    researchHistory: [],
    auditLogs: [],
    reporting: {
      totalOperations: 14282,
      avgLatency: 22,
      securityScore: 99.9,
      uptimeTrend: [99, 98, 99.9, 99.5, 100],
      failureCategories: { 'GATE_TIMEOUT': 12, 'SKILL_LOAD_FAIL': 3 }
    },
    environment: 'Termux'
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL,
      this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  private pushAuditLog(level: AuditLog['level'], message: string, metadata: Record<string, any> = {}) {
    const log: AuditLog = {
      id: `EVT-${Math.floor(Math.random() * 10000)}`,
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };
    this.setState({
      ...this.state,
      auditLogs: [log, ...this.state.auditLogs].slice(0, 100)
    });
  }
  private async simulateSelfHealing() {
    const ft = { ...this.state.faultTolerance };
    const stats = { ...this.state.resilience };
    if (stats.consecutiveFailures > 0) {
      ft.primaryPathActive = false;
      ft.secondaryPathActive = true;
      this.pushAuditLog('Recovery', 'Failover to secondary path triggered by consecutive failures', { failures: stats.consecutiveFailures });
      const log: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `[HEAL] Primary validation failed. Failing over...`,
        timestamp: Date.now(),
        isSystemLog: true
      };
      this.setState({ ...this.state, faultTolerance: ft, messages: [...this.state.messages, log] });
    }
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    if (method === 'GET' && url.pathname === '/messages') {
      return Response.json({ success: true, data: this.state });
    }
    if (method === 'GET' && url.pathname === '/audit') {
      return Response.json({ success: true, data: this.state.auditLogs });
    }
    if (method === 'POST' && url.pathname === '/chat') {
      const body = await request.json() as { message: string, model?: string };
      return this.handleChatMessage(body);
    }
    return Response.json({ success: false, error: 'Not Found' }, { status: 404 });
  }
  private async handleChatMessage(body: { message: string, model?: string }): Promise<Response> {
    const { message } = body;
    await this.simulateSelfHealing();
    const triggeredSkills = this.state.skills
      .filter(s => new RegExp(s.triggerRegex, 'i').test(message))
      .map(s => s.id);
    if (triggeredSkills.length > 0) {
      this.pushAuditLog('Skill_Activate', `Skills triggered: ${triggeredSkills.join(', ')}`, { trigger: message });
    }
    const userMessage = createMessage('user', message);
    this.setState({
      ...this.state,
      messages: [...this.state.messages, userMessage],
      activeSkills: triggeredSkills,
      isProcessing: true
    });
    try {
      const response = await this.chatHandler!.processMessage(
        message,
        this.state.messages,
        undefined,
        triggeredSkills,
        this.state.skills
      );
      const assistantMessage: Message = {
        ...createMessage('assistant', response.content, response.toolCalls),
        skillInsight: triggeredSkills.join(', ')
      };
      this.setState({
        ...this.state,
        messages: [...this.state.messages, assistantMessage],
        isProcessing: false
      });
      return Response.json({ success: true, data: this.state });
    } catch (error) {
      this.setState({ ...this.state, isProcessing: false });
      return Response.json({ success: false, error: 'Processing error' }, { status: 500 });
    }
  }
}