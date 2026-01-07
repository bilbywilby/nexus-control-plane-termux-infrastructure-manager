import type { Message, ChatState, ToolCall, SessionInfo, ResearchQuery, WorkflowState } from '../../worker/types';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
export const MODELS = [
  { id: 'google-ai-studio/gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'google-ai-studio/gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'google-ai-studio/gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
];
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor() {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  async sendMessage(
    message: string,
    model?: string,
    onChunk?: (chunk: string) => void
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, stream: !!onChunk }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }
  async executeCommand(command: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: command }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Command execution failed' };
    }
  }
  async deployToGithub(branch: string = 'main', remote: string = 'origin'): Promise<{ success: boolean; error?: string }> {
    return this.triggerWorkflowAction('deploy-github', { branch, remote });
  }
  async executeRollback(snapshotId?: string): Promise<{ success: boolean; error?: string }> {
    return this.triggerWorkflowAction('rollback', { snapshotId });
  }
  async conductResearch(question: string): Promise<{ success: boolean; data?: ResearchQuery; error?: string }> {
    try {
      const response = await fetch(`/api/research/${this.sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Research engine offline' };
    }
  }
  async triggerWorkflowAction(action: string, args?: Record<string, any>): Promise<{ success: boolean; data?: WorkflowState; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, args }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Workflow manager unreachable' };
    }
  }
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to load messages' };
    }
  }
  async clearMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to clear messages' };
    }
  }
  getSessionId(): string {
    return this.sessionId;
  }
}
export const chatService = new ChatService();
export const renderToolCall = (toolCall: ToolCall): string => {
  const result = toolCall.result;
  if (result === undefined || result === null) {
    return `⏳ ${toolCall.name}: Pending...`;
  }
  if (typeof result === 'object' && 'error' in (result as any)) {
    return `❌ ${toolCall.name}: ${(result as any).error}`;
  }
  return `✅ ${toolCall.name}: Success`;
};