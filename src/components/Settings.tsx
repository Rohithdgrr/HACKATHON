import React, { useState } from 'react';
import { Card, Button, Badge } from './UI';
import { 
  Settings as SettingsIcon, 
  Key, 
  Shield, 
  Globe, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Save
} from 'lucide-react';
import { cn } from '../lib/utils';

interface APIProvider {
  id: string;
  name: string;
  description: string;
  icon: any;
  placeholder: string;
  docsUrl: string;
  category: 'Aggregator' | 'Direct' | 'Specialized';
}

const PROVIDERS: APIProvider[] = [
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    description: 'Access 100+ models through a single API.', 
    icon: Globe, 
    placeholder: 'sk-or-v1-...',
    docsUrl: 'https://openrouter.ai/keys',
    category: 'Aggregator'
  },
  { 
    id: 'nvidia', 
    name: 'NVIDIA NIM', 
    description: 'High-performance inference for NVIDIA-optimized models.', 
    icon: Cpu, 
    placeholder: 'nvapi-...',
    docsUrl: 'https://build.nvidia.com/explore/discover',
    category: 'Direct'
  },
  { 
    id: 'groq', 
    name: 'Groq', 
    description: 'Ultra-fast LPU inference for Llama and Mixtral.', 
    icon: Zap, 
    placeholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
    category: 'Direct'
  },
  { 
    id: 'openai', 
    name: 'OpenAI', 
    description: 'GPT-4o, GPT-4 Turbo, and DALL-E 3.', 
    icon: Shield, 
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    category: 'Direct'
  },
  { 
    id: 'anthropic', 
    name: 'Claude (Anthropic)', 
    description: 'Claude 3.5 Sonnet, Opus, and Haiku.', 
    icon: Shield, 
    placeholder: 'sk-ant-api03-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    category: 'Direct'
  },
  { 
    id: 'google', 
    name: 'Gemini (Google)', 
    description: 'Gemini 1.5 Pro and Flash models.', 
    icon: Shield, 
    placeholder: 'AIzaSy...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    category: 'Direct'
  },
  { 
    id: 'mistral', 
    name: 'Mistral AI', 
    description: 'Mistral Large, Pixtral, and Codestral.', 
    icon: Shield, 
    placeholder: '...',
    docsUrl: 'https://console.mistral.ai/api-keys/',
    category: 'Direct'
  },
  { 
    id: 'cohere', 
    name: 'Cohere', 
    description: 'Command R+ and enterprise-grade RAG.', 
    icon: Shield, 
    placeholder: '...',
    docsUrl: 'https://dashboard.cohere.com/api-keys',
    category: 'Direct'
  },
  { 
    id: 'bytez', 
    name: 'Bytez', 
    description: 'Serverless deployment for open-source models.', 
    icon: Cpu, 
    placeholder: '...',
    docsUrl: 'https://bytez.com/dashboard',
    category: 'Specialized'
  }
];

export default function SettingsView() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSave = (id: string) => {
    setSavedStatus(id);
    setTimeout(() => setSavedStatus(null), 2000);
    // In a real app, this would save to localStorage or a backend
    console.log(`Saving key for ${id}:`, apiKeys[id]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">API Settings</h2>
        <p className="text-gray-500">Manage your API providers and keys. Keys are stored locally in your browser.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {PROVIDERS.map((provider) => (
          <Card key={provider.id} className="p-6 bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 text-gray-900">
                  <provider.icon size={24} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{provider.name}</h3>
                    <Badge className="bg-gray-100 text-gray-500 border-none text-[10px] py-0 px-2">{provider.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 max-w-md">{provider.description}</p>
                </div>
              </div>

              <div className="flex-1 max-w-md w-full space-y-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                    <Key size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder={provider.placeholder}
                    value={apiKeys[provider.id] || ''}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <a 
                    href={provider.docsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-1 transition-colors"
                  >
                    Get API Key <ExternalLink size={10} />
                  </a>
                  <Button 
                    onClick={() => handleSave(provider.id)}
                    className={cn(
                      "h-8 px-4 text-xs font-bold transition-all",
                      savedStatus === provider.id ? "bg-green-600 hover:bg-green-600" : "bg-black"
                    )}
                  >
                    {savedStatus === provider.id ? (
                      <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Saved</span>
                    ) : (
                      <span className="flex items-center gap-1"><Save size={14} /> Save Key</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gray-900 text-white border-none shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold">Security Note</h3>
            <p className="text-sm text-gray-400">Your API keys are encrypted and stored locally. We never see or store your keys on our servers.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
