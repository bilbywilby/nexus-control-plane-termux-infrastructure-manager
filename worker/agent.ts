import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState, Skill, Message, SkillStatus, ResearchQuery } from './types';
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
      },
      {
        id: 'web-deploy',
        name: 'web-deploy',
        icon: 'Globe',
        triggerRegex: 'deploy|publish|worker',
        confidence: 78,
        successCount: 89,
        totalActivations: 112,
        status: 'Active' as SkillStatus,
        lastAdjustment: Date.now(),
        description: 'Cloudflare Workers and Pages synchronization.'
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
    environment: 'Termux'
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL,
      this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  private async simulateSelfHealing() {
    const stats = { ...this.state.resilience };
    const ft = { ...this.state.faultTolerance };
    if (stats.consecutiveFailures > 0) {
      ft.primaryPathActive = false;
      ft.secondaryPathActive = true;
      ft.recoverySuccessRate = Math.min(100, ft.recoverySuccessRate + 0.1);
      const log: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `[HEAL] Primary path failed. Failing over to secondary validation path...`,
        timestamp: Date.now(),
        isSystemLog: true
      };
      this.setState({ ...this.state, resilience: stats, faultTolerance: ft, messages: [...this.state.messages, log] });
    } else {
      ft.primaryPathActive = true;
      ft.secondaryPathActive = false;
      this.setState({ ...this.state, faultTolerance: ft });
    }
  }
  private async handleResearchQuery(question: string): Promise<ResearchQuery> {
    const id = `RES-${Math.floor(Math.random() * 9000) + 1000}`;
    const query: ResearchQuery = {
      id,
      question,
      status: 'Analyzing',
      confidence: 0,
      sources: [],
      timestamp: Date.now()
    };
    this.setState({ ...this.state, researchHistory: [query, ...this.state.researchHistory] });
    // Simulate multi-step reasoning
    const results = `Synthesis complete for: ${question}. Detected patterns in Termux/Android architecture suggest optimized resource allocation is possible via secondary validation gates.`;
    const resolved: ResearchQuery = {
      ...query,
      status: 'Resolved',
      confidence: 94,
      results,
      sources: ['https://termux.dev/wiki', 'nexus-core-logs-v2']
    };
    const updatedHistory = this.state.researchHistory.map(q => q.id === id ? resolved : q);
    this.setState({ ...this.state, researchHistory: updatedHistory });
    return resolved;
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    if (method === 'GET' && url.pathname === '/messages') {
      return Response.json({ success: true, data: this.state });
    }
    if (method === 'POST' && url.pathname === '/chat') {
      const body = await request.json() as { message: string, stream?: boolean, model?: string };
      return this.handleChatMessage(body);
    }
    if (method === 'POST' && url.pathname === '/research') {
      const { question } = await request.json() as { question: string };
      const result = await this.handleResearchQuery(question);
      return Response.json({ success: true, data: result });
    }
    if (method === 'POST' && url.pathname === '/system/environment') {
      const { environment } = await request.json() as { environment: 'Termux' | 'Desktop' };
      this.setState({ ...this.state, environment });
      return Response.json({ success: true, data: this.state });
    }
    return Response.json({ success: false, error: 'Not Found' }, { status: 404 });
  }
  private async handleChatMessage(body: { message: string, stream?: boolean, model?: string }): Promise<Response> {
    const { message } = body;
    if (!message?.trim()) return Response.json({ success: false, error: 'Missing message' }, { status: 400 });
    await this.simulateSelfHealing();
    const userMessage = createMessage('user', message.trim());
    const triggeredSkills = this.state.skills
      .filter(s => new RegExp(s.triggerRegex, 'i').test(message))
      .map(s => s.id);
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