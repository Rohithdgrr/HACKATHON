export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: number;
}

export interface RouterInfo {
  id: string;
  name: string;
  description: string;
  config?: string;
}

export interface RoutingResult {
  modelId: string;
  modelName: string;
  size: string;
  provider: string;
  reason: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  size: string;
  provider: string;
  description?: string;
}

export interface ModelStats {
  latency: number;
  tokensPerSecond: number;
  costPer1k: number;
  totalTokens: number;
}

export interface LeaderboardEntry {
  modelId: string;
  modelName: string;
  votes: number;
  tasks: {
    coding: number;
    reasoning: number;
    math: number;
    general: number;
  };
  winRate: number;
}

export const AVAILABLE_ROUTERS: RouterInfo[] = [
  { id: 'knnrouter', name: 'KNN Router', description: 'K-Nearest Neighbors based routing', config: 'knnrouter.yaml' },
  { id: 'svmrouter', name: 'SVM Router', description: 'Support Vector Machine routing', config: 'svmrouter.yaml' },
  { id: 'mlprouter', name: 'MLP Router', description: 'Multi-Layer Perceptron routing', config: 'mlprouter.yaml' },
  { id: 'mfrouter', name: 'MF Router', description: 'Matrix Factorization routing', config: 'mfrouter.yaml' },
  { id: 'elorouter', name: 'Elo Router', description: 'Elo Rating based routing', config: 'elorouter.yaml' },
  { id: 'routerdc', name: 'Router DC', description: 'Dual Contrastive learning routing', config: 'dcrouter.yaml' },
  { id: 'automix', name: 'AutoMix', description: 'Automatic model mixing', config: 'automix.yaml' },
  { id: 'hybrid_llm', name: 'Hybrid LLM', description: 'Hybrid LLM routing', config: 'hybrid_llm.yaml' },
  { id: 'graphrouter', name: 'Graph Router', description: 'Graph-based routing', config: 'graphrouter.yaml' },
  { id: 'causallm_router', name: 'CausalLM Router', description: 'Causal Language Model router', config: 'causallm_router.yaml' },
  { id: 'smallest_llm', name: 'Smallest LLM', description: 'Always routes to smallest model' },
  { id: 'largest_llm', name: 'Largest LLM', description: 'Always routes to largest model' },
  { id: 'personalizedrouter', name: 'Personalized Router', description: 'GNN-based personalized routing', config: 'personalizedrouter.yaml' },
  { id: 'gmtrouter', name: 'GMT Router', description: 'Graph-based personalized routing', config: 'gmtrouter.yaml' },
];

export const MODELS: ModelInfo[] = [
  { id: 'qwen2.5-7b', name: 'Qwen 2.5 7B', size: '7B', provider: 'NVIDIA', description: 'Fast, efficient, and versatile.' },
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', size: '8B', provider: 'NVIDIA', description: 'State-of-the-art reasoning and logic.' },
  { id: 'mistral-7b', name: 'Mistral 7B', size: '7B', provider: 'NVIDIA', description: 'High performance with low latency.' },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', size: '46.7B', provider: 'NVIDIA', description: 'Powerful mixture-of-experts model.' },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { modelId: 'llama-3.1-8b', modelName: 'Llama 3.1 8B', votes: 1240, winRate: 68.5, tasks: { coding: 72, reasoning: 85, math: 78, general: 82 } },
  { modelId: 'mixtral-8x7b', modelName: 'Mixtral 8x7B', votes: 1100, winRate: 64.2, tasks: { coding: 80, reasoning: 75, math: 65, general: 78 } },
  { modelId: 'qwen2.5-7b', modelName: 'Qwen 2.5 7B', votes: 950, winRate: 58.1, tasks: { coding: 65, reasoning: 60, math: 55, general: 72 } },
  { modelId: 'mistral-7b', modelName: 'Mistral 7B', votes: 880, winRate: 55.4, tasks: { coding: 58, reasoning: 55, math: 50, general: 68 } },
];
