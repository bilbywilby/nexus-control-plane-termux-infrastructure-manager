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
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' | 'RECOVERY' | 'GATE_PASS' | 'GIT_COMMIT' | 'DEPLOYMENT_START' | 'INTENT_MATCH' | 'HOOK_EXEC' | 'INTENT_SUGGESTION';
export interface InfrastructureFile {
  path: string;
  content: string;
  type: 'Markdown' | 'JSON' | 'YAML' | 'Shell';
}
export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  specification: string;
  avatar?: string;
}
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  toolCalls?: ToolCall[];
  skillInsight?: string;
  isSystemLog?: boolean;
  isQueued?: boolean;
  level?: LogLevel;
  intentMatch?: string;
}
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}
export interface WorkflowState {
  currentBranch: string;
  lastCommitHash: string;
  pipelineStatus: 'Idle' | 'Building' | 'Validating' | 'Deploying' | 'Failed' | 'RollingBack' | 'GitHubDeploying' | 'ActionRunning';
  version: string;
  changelog: string[];
  scriptLogs: string[];
  lastGithubPush?: number;
  lastRollback?: { timestamp: number; snapshotId: string };
  executionStep?: 'Idle' | 'CheckingVars' | 'ValidatingBuild' | 'AutoFixing' | 'Snapshotting' | 'Pushing';
}
export interface PluginItem {
  id: string;
  name: string;
  author: string;
  rating: number;
  status: 'Installed' | 'Available';
  loadPath?: string;
}
export interface SystemAlert {
  id: string;
  level: 'Warning' | 'Critical';
  message: string;
  timestamp: number;
  threshold?: number;
  currentValue?: number;
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
  loadPath?: string;
  sop?: string;
  intentRules?: string[];
  hooks?: {
    pre?: string;
    post?: string;
  };
}
export interface AuditLog {
  id: string;
  level: 'Info' | 'Warning' | 'Error' | 'Recovery' | 'Gate_Pass' | 'Skill_Activate' | 'Git_Op' | 'Deploy';
  message: string;
  timestamp: string;
  metadata: Record<string, any>;
}
export interface RoadmapStage {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
}
export interface ReportingMetrics {
  totalOperations: number;
  avgLatency: number;
  securityScore: number;
  uptimeTrend: number[];
  failureCategories: Record<string, number>;
}
export interface FaultToleranceStats {
  primaryPathActive: boolean;
  secondaryPathActive: boolean;
  recoverySuccessRate: number;
  uptimeScore: number;
  redundantSnapshotsCount: number;
}
export interface ResearchQuery {
  id: string;
  question: string;
  status: 'Analyzing' | 'Resolved';
  confidence: number;
  results?: string;
  sources: string[];
  timestamp: number;
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
  suggestedSkills: string[];
  skills: Skill[];
  resilience: ResilienceStats;
  faultTolerance: FaultToleranceStats;
  researchHistory: ResearchQuery[];
  auditLogs: AuditLog[];
  reporting: ReportingMetrics;
  environment: 'Termux' | 'Desktop';
  roadmap: RoadmapStage[];
  systemEnv: Record<string, string>;
  workflow: WorkflowState;
  plugins: PluginItem[];
  alerts: SystemAlert[];
  infraFiles: InfrastructureFile[];
  agentProfiles: AgentProfile[];
  availableCommands: string[];
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