import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState, Skill, Message } from './types';
import { ChatHandler } from './chat';
import { API_RESPONSES } from './config';
import { createMessage, createStreamResponse, createEncoder } from './utils';
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
        triggerRegex: '.*\\.py$',
        confidence: 85,
        successCount: 120,
        totalActivations: 140,
        status: 'Active',
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
        status: 'Standby',
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
        status: 'Active',
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
    }
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL,
      this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  private async checkResilience() {
    const stats = { ...this.state.resilience };
    // Simulated gate failure check (2% failure rate simulation)
    const failure = Math.random() < 0.02;
    if (failure) {
      stats.consecutiveFailures += 1;
      stats.retryCount += 1;
      stats.lastFailureTime = Date.now();
      if (stats.consecutiveFailures >= 3) {
        stats.circuitBreakerStatus = 'Open';
      }
    } else {
      stats.consecutiveFailures = 0;
      if (stats.circuitBreakerStatus === 'Open') {
        stats.circuitBreakerStatus = 'Half-Open';
      } else if (stats.circuitBreakerStatus === 'Half-Open') {
        stats.circuitBreakerStatus = 'Closed';
      }
    }
    this.setState({ ...this.state, resilience: stats });
    return failure;
  }
  private identifyActiveSkills(message: string): string[] {
    return this.state.skills
      .filter(skill => {
        try {
          const regex = new RegExp(skill.triggerRegex, 'i');
          return regex.test(message);
        } catch {
          return false;
        }
      })
      .map(s => s.id);
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    if (method === 'GET' && url.pathname === '/messages') {
      return Response.json({ success: true, data: this.state });
    }
    if (method === 'POST' && url.pathname === '/chat') {
      return this.handleChatMessage(await request.json());
    }
    if (method === 'DELETE' && url.pathname === '/clear') {
      this.setState({ ...this.state, messages: [], activeSkills: [] });
      return Response.json({ success: true, data: this.state });
    }
    if (method === 'POST' && url.pathname === '/model') {
      const { model } = await request.json();
      this.setState({ ...this.state, model });
      this.chatHandler?.updateModel(model);
      return Response.json({ success: true, data: this.state });
    }
    if (method === 'POST' && url.pathname.includes('/skills/') && url.pathname.endsWith('/toggle')) {
      const skillId = url.pathname.split('/')[2];
      const newSkills = this.state.skills.map(s => 
        s.id === skillId ? { ...s, status: s.status === 'Disabled' ? 'Standby' : 'Disabled' } : s
      );
      this.setState({ ...this.state, skills: newSkills });
      return Response.json({ success: true, data: this.state });
    }
    return Response.json({ success: false, error: 'Not Found' }, { status: 404 });
  }
  private async handleChatMessage(body: any): Promise<Response> {
    const { message, stream } = body;
    if (!message?.trim()) return Response.json({ success: false, error: 'Missing message' }, { status: 400 });
    const triggeredSkills = this.identifyActiveSkills(message);
    const userMessage = createMessage('user', message.trim());
    // Check resilience (Simulate gate)
    const failure = await this.checkResilience();
    let systemLogs: Message[] = [];
    if (failure) {
      systemLogs.push({
        id: crypto.randomUUID(),
        role: 'system',
        content: `[RESILIENCE] Gate Failure Detected. Initiating Retry ${this.state.resilience.retryCount}/3...`,
        timestamp: Date.now(),
        isSystemLog: true
      });
    }
    this.setState({
      ...this.state,
      messages: [...this.state.messages, userMessage, ...systemLogs],
      activeSkills: triggeredSkills,
      isProcessing: true
    });
    if (this.state.resilience.circuitBreakerStatus === 'Open') {
      const breakerMsg = createMessage('assistant', "System Gate is currently LOCKED due to persistent integrity failures. Please check 'Overview' for remediation steps.");
      this.setState({ ...this.state, messages: [...this.state.messages, breakerMsg], isProcessing: false });
      return Response.json({ success: true, data: this.state });
    }
    try {
      if (stream) {
        // Simple stream wrapper
        return Response.json({ success: false, error: "Streaming currently requires update to chatHandler for Phase 2 Context" }, { status: 501 });
      }
      const response = await this.chatHandler!.processMessage(
        message,
        this.state.messages,
        undefined,
        triggeredSkills,
        this.state.skills
      );
      const assistantMessage: Message = {
        ...createMessage('assistant', response.content, response.toolCalls),
        skillInsight: triggeredSkills.length > 0 ? triggeredSkills.join(', ') : undefined
      };
      // Adaptive learning update
      const updatedSkills = this.state.skills.map(s => {
        if (triggeredSkills.includes(s.id)) {
          return {
            ...s,
            totalActivations: s.totalActivations + 1,
            successCount: s.successCount + 1,
            confidence: Math.min(100, s.confidence + 0.5),
            lastAdjustment: Date.now()
          };
        }
        return s;
      });
      this.setState({
        ...this.state,
        messages: [...this.state.messages, assistantMessage],
        skills: updatedSkills,
        isProcessing: false
      });
      return Response.json({ success: true, data: this.state });
    } catch (error) {
      this.setState({ ...this.state, isProcessing: false });
      return Response.json({ success: false, error: 'Processing error' }, { status: 500 });
    }
  }
}