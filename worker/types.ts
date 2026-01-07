export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: string; }
export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}
export interface MCPResult {
  content: string;
}
export interface ErrorResult {
  error: string;
}
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  toolCalls?: ToolCall[];
  skillInsight?: string;
  isSystemLog?: boolean;
}
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}
export type SkillStatus = 'Active' | 'Standby' | 'Disabled';
export type CircuitBreakerStatus = 'Closed' | 'Open' | 'Half-Open';
export interface Skill {
  id: string;
  name: string;
  icon: string;
  triggerRegex: string;
  confidence: number;
  successCount: number;
  totalActivations: number;
  status: SkillStatus;
  lastAdjustment: number;
  description: string;
}
export interface ResilienceStats {
  gatePassRate: number;
  retryCount: number;
  circuitBreakerStatus: CircuitBreakerStatus;
  avgLatency: number;
  lastFailureTime?: number;
  consecutiveFailures: number;
}
export interface ChatState {
  messages: Message[];
  sessionId: string;
  isProcessing: boolean;
  model: string;
  streamingMessage?: string;
  activeSkills: string[];
  skills: Skill[];
  resilience: ResilienceStats;
}
export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}