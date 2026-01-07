import OpenAI from 'openai';
import type { Message, ToolCall, Skill } from './types';
import { getToolDefinitions, executeTool } from './tools';
import { ChatCompletionMessageFunctionToolCall } from 'openai/resources/index.mjs';
export class ChatHandler {
  private client: OpenAI;
  private model: string;
  constructor(aiGatewayUrl: string, apiKey: string, model: string) {
    this.client = new OpenAI({ baseURL: aiGatewayUrl, apiKey: apiKey });
    this.model = model;
  }
  async processMessage(
    message: string,
    history: Message[],
    onChunk?: (chunk: string) => void,
    activeSkills?: string[],
    skillLibrary?: Skill[]
  ): Promise<{ content: string; toolCalls?: ToolCall[]; }> {
    const messages = this.buildConversationMessages(message, history, activeSkills, skillLibrary);
    const toolDefinitions = await getToolDefinitions();
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      tools: toolDefinitions,
      tool_choice: 'auto',
      max_tokens: 16000,
      stream: false
    });
    return this.handleNonStreamResponse(completion, message, history);
  }
  private buildConversationMessages(
    userMessage: string, 
    history: Message[], 
    activeSkills?: string[], 
    skillLibrary?: Skill[]
  ) {
    let systemPrompt = 'You are the Nexus Control Plane Agent. You manage a Termux-based autonomous development infrastructure.\n';
    if (activeSkills && activeSkills.length > 0 && skillLibrary) {
      systemPrompt += '\n[CONTEXT COMPRESSION ACTIVE] Loading only specific skill modules:\n';
      activeSkills.forEach(skillId => {
        const skill = skillLibrary.find(s => s.id === skillId);
        if (skill) {
          systemPrompt += `- ${skill.name}: ${skill.description} (Confidence: ${skill.confidence}%)\n`;
          // Simulate loading specialized markdown content
          if (skillId === 'python-dev') systemPrompt += '  Rules: Use PEP8, prioritize fast-fail tests.\n';
          if (skillId === 'security-audit') systemPrompt += '  Rules: Scan for RSA/PEM blocks, reject plaintext secrets.\n';
        }
      });
      systemPrompt += '\nEfficiency: Loading matching skills saved ~40% context window tokens.';
    }
    return [
      { role: 'system' as const, content: systemPrompt },
      ...history.slice(-5).filter(m => !m.isSystemLog).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user' as const, content: userMessage }
    ];
  }
  private async handleNonStreamResponse(
    completion: OpenAI.Chat.Completions.ChatCompletion,
    message: string,
    history: Message[]
  ) {
    const responseMessage = completion.choices[0]?.message;
    if (!responseMessage) return { content: 'System error: empty agent response.' };
    if (!responseMessage.tool_calls) return { content: responseMessage.content || 'Response complete.' };
    const toolCalls = await this.executeToolCalls(responseMessage.tool_calls as ChatCompletionMessageFunctionToolCall[]);
    const finalResponse = await this.generateToolResponse(message, history, responseMessage.tool_calls, toolCalls);
    return { content: finalResponse, toolCalls };
  }
  private async executeToolCalls(openAiToolCalls: ChatCompletionMessageFunctionToolCall[]): Promise<ToolCall[]> {
    return Promise.all(
      openAiToolCalls.map(async (tc) => {
        try {
          const args = tc.function.arguments ? JSON.parse(tc.function.arguments) : {};
          const result = await executeTool(tc.function.name, args);
          return { id: tc.id, name: tc.function.name, arguments: args, result };
        } catch (error) {
          return { id: tc.id, name: tc.function.name, arguments: {}, result: { error: 'Execution failed' } };
        }
      })
    );
  }
  private async generateToolResponse(
    userMessage: string,
    history: Message[],
    openAiToolCalls: any[],
    toolResults: ToolCall[]
  ): Promise<string> {
    const followUp = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'Process the tool results and provide the user with a concise infrastructure update.' },
        ...history.slice(-3).filter(m => !m.isSystemLog).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: null, tool_calls: openAiToolCalls },
        ...toolResults.map((result, index) => ({
          role: 'tool' as const,
          content: JSON.stringify(result.result),
          tool_call_id: openAiToolCalls[index]?.id || result.id
        }))
      ],
      max_tokens: 16000
    });
    return followUp.choices[0]?.message?.content || 'Tool execution complete.';
  }
  updateModel(newModel: string): void {
    this.model = newModel;
  }
}