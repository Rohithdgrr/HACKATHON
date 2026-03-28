// API Service for connecting Frontend to OpenClaw Router Backend
// When running via Vite dev server, the proxy handles /v1/* routes to backend
// In production or without proxy, use the full URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

// Types matching backend models
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  user?: string;
  session_id?: string;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface RouterInfo {
  available_routers: string[];
  current: string;
}

export interface MLStatus {
  strategy: string;
  loaded: boolean;
  model_info?: Record<string, any>;
  available_models?: string[];
}

export interface MLPrediction {
  query: string;
  strategy: string;
  selected_model: string;
  predicted_class?: number;
  confidence?: number;
  details?: Record<string, any>;
  available_models: string[];
}

export interface FeedbackRequest {
  query: string;
  selected_model: string;
  user_rating: number;
  user_comment?: string;
  session_id?: string;
  routing_strategy?: string;
}

export interface ModelStats {
  latency: number;
  tokensPerSecond: number;
  costPer1k: number;
  totalTokens: number;
}

// API Client
class RouterAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async fetch(endpoint: string, options?: RequestInit): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Health check
  async getHealth(): Promise<{ status: string; version: string }> {
    return this.fetch('/health');
  }

  // Get router info
  async getRouterInfo(): Promise<RouterInfo> {
    return this.fetch('/routers');
  }

  // Get available models
  async getModels(): Promise<{ data: Array<{ id: string; object: string; owned_by: string }> }> {
    return this.fetch('/v1/models');
  }

  // Chat completion (non-streaming)
  async chatCompletion(request: ChatRequest): Promise<ChatResponse> {
    return this.fetch('/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({ ...request, stream: false }),
    });
  }

  // Chat completion (streaming)
  async *streamChatCompletion(request: ChatRequest): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Streaming Error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            // Ignore parse errors for [DONE] or other non-JSON lines
          }
        }
      }
    }
  }

  // ML Router status
  async getMLStatus(): Promise<MLStatus> {
    return this.fetch('/v1/ml/status');
  }

  // ML Prediction test
  async getMLPrediction(query: string, strategy?: string): Promise<MLPrediction> {
    const params = new URLSearchParams({ query });
    if (strategy) params.append('strategy', strategy);
    return this.fetch(`/v1/ml/predict?${params.toString()}`);
  }

  // Submit feedback
  async submitFeedback(feedback: FeedbackRequest): Promise<{ feedback_id: string; status: string; message: string }> {
    return this.fetch('/v1/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  // Get feedback stats
  async getFeedbackStats(model?: string): Promise<Record<string, any>> {
    const params = model ? `?model=${model}` : '';
    return this.fetch(`/v1/feedback/stats${params}`);
  }

  // Get model performance
  async getModelPerformance(): Promise<Record<string, any>> {
    return this.fetch('/v1/feedback/model-performance');
  }

  // Cache stats
  async getCacheStats(): Promise<Record<string, any>> {
    return this.fetch('/v1/cache/stats');
  }

  // Clear cache
  async clearCache(): Promise<{ status: string }> {
    return this.fetch('/v1/cache/clear', { method: 'POST' });
  }

  // Token analysis
  async analyzeTokens(query: string): Promise<{
    query: string;
    estimated_input_tokens: number;
    estimated_output_tokens: number;
    estimated_total_tokens: number;
    classification: string;
  }> {
    return this.fetch(`/v1/token/analyze?query=${encodeURIComponent(query)}`);
  }

  // Privacy check
  async checkPrivacy(query: string): Promise<{
    query: string;
    privacy_level: string;
    detected_types: string[];
    confidence: number;
    recommendation: string;
  }> {
    return this.fetch(`/v1/privacy/check?query=${encodeURIComponent(query)}`);
  }

  // Fallback health
  async getFallbackHealth(): Promise<{
    health_status: Record<string, any>;
    config: { primary_model: string | null; fallback_models: string[] };
  }> {
    return this.fetch('/v1/fallback/health');
  }

  // History Methods
  async getHistory(limit: number = 50): Promise<{ sessions: any[] }> {
    return this.fetch(`/v1/history?limit=${limit}`);
  }

  async getSessionDetails(sessionId: string): Promise<{ messages: any[] }> {
    return this.fetch(`/v1/history/${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<{ status: string }> {
    return this.fetch(`/v1/history/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const routerAPI = new RouterAPI();

// Helper function to get chat response with stats
export async function getChatResponseFromBackend(
  query: string,
  modelName: string,
  onChunk?: (chunk: string) => void,
  sessionId?: string
): Promise<{ content: string; stats: ModelStats; actualModel: string; sessionId?: string }> {
  const startTime = Date.now();
  let fullContent = '';
  let actualModel = modelName;
  let returnedSessionId = sessionId;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

  const messages: ChatMessage[] = [
    { role: 'user', content: query }
  ];

  try {
    if (onChunk) {
      // Streaming mode
      const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName === 'auto' ? 'auto' : modelName,
          messages,
          stream: true,
          session_id: sessionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Streaming failed: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.trim().startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.trim().slice(6));
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch(e) {}
          }
        }
      }
    } else {
      // Non-streaming mode
      const response = await routerAPI.chatCompletion({
        model: modelName === 'auto' ? 'auto' : modelName,
        messages,
        session_id: sessionId,
      });
      fullContent = response.choices[0]?.message?.content || '';
      actualModel = response.model || modelName;
    }
  } finally {
    clearTimeout(timeoutId);
  }

  const endTime = Date.now();
  const latency = (endTime - startTime) / 1000;
  const tokens = fullContent.split(/\s+/).length * 1.3;

  return {
    content: fullContent,
    actualModel,
    sessionId: returnedSessionId,
    stats: {
      latency,
      tokensPerSecond: tokens / latency,
      costPer1k: modelName.includes('70b') || modelName.includes('72b') ? 0.002 : 0.0005,
      totalTokens: Math.round(tokens),
    },
  };
}

// Route query using ML router
export async function routeQueryWithBackend(
  query: string,
  routerId: string = 'auto'
): Promise<{
  modelId: string;
  modelName: string;
  provider: string;
  reason: string;
  confidence?: number;
}> {
  try {
    // Get ML prediction for the query
    const prediction = await routerAPI.getMLPrediction(query, routerId === 'auto' ? undefined : routerId);

    const selectedModel = prediction.selected_model;
    const modelInfo = await routerAPI.getModels();
    const modelDetails = modelInfo.data.find(m => m.id === selectedModel);

    return {
      modelId: selectedModel,
      modelName: modelDetails?.id || selectedModel,
      provider: modelDetails?.owned_by || 'together',
      reason: `Selected by ${prediction.strategy} router with confidence ${(prediction.confidence || 0).toFixed(2)}`,
      confidence: prediction.confidence,
    };
  } catch (error) {
    console.error('Routing error:', error);
    // Fallback to default model
    return {
      modelId: 'llama-3.1-8b',
      modelName: 'Llama 3.1 8B',
      provider: 'together',
      reason: 'Fallback due to routing error',
    };
  }
}

export default routerAPI;
