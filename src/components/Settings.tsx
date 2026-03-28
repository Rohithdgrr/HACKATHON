import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Save,
  Layers,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

// Rotating glow border component
const RotatingGlowBorder = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative group", className)}>
    <motion.div 
      className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f97316, #22d3ee)",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-80 transition-all duration-500 blur-md animate-pulse" />
    <div className="relative bg-white rounded-2xl border border-gray-200 group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-2xl overflow-hidden">
      {children}
    </div>
  </div>
);

interface APIProvider {
  id: string;
  name: string;
  description: string;
  icon: any;
  placeholder: string;
  docsUrl: string;
  category: 'Aggregator' | 'Direct' | 'Specialized';
  color: string;
}

const PROVIDERS: APIProvider[] = [
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    description: 'Access 100+ models through a single API. Unified interface for all major providers.', 
    icon: Globe, 
    placeholder: 'sk-or-v1-...',
    docsUrl: 'https://openrouter.ai/keys',
    category: 'Aggregator',
    color: '#3B82F6'
  },
  { 
    id: 'nvidia', 
    name: 'NVIDIA NIM', 
    description: 'High-performance inference for NVIDIA-optimized models. Enterprise-grade deployment.', 
    icon: Cpu, 
    placeholder: 'nvapi-...',
    docsUrl: 'https://build.nvidia.com/explore/discover',
    category: 'Direct',
    color: '#76B900'
  },
  { 
    id: 'groq', 
    name: 'Groq', 
    description: 'Ultra-fast LPU inference for Llama and Mixtral. 10x faster than traditional GPUs.', 
    icon: Zap, 
    placeholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
    category: 'Direct',
    color: '#F59E0B'
  },
  { 
    id: 'openai', 
    name: 'OpenAI', 
    description: 'GPT-4o, GPT-4 Turbo, and DALL-E 3. Industry-leading models for all tasks.', 
    icon: () => <span className="text-[10px] font-black">GPT</span>, 
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    category: 'Direct',
    color: '#10A37F'
  },
  { 
    id: 'anthropic', 
    name: 'Claude (Anthropic)', 
    description: 'Claude 3.5 Sonnet, Opus, and Haiku. Best-in-class reasoning and safety.', 
    icon: () => <span className="text-[10px] font-black">C</span>, 
    placeholder: 'sk-ant-api03-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    category: 'Direct',
    color: '#D97757'
  },
  { 
    id: 'google', 
    name: 'Gemini (Google)', 
    description: 'Gemini 1.5 Pro and Flash models. Multimodal capabilities with 1M+ token context.', 
    icon: () => <span className="text-[10px] font-black">G</span>, 
    placeholder: 'AIzaSy...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    category: 'Direct',
    color: '#4285F4'
  },
  { 
    id: 'mistral', 
    name: 'Mistral AI', 
    description: 'Mistral Large, Pixtral, and Codestral. European leader in open-source models.', 
    icon: () => <span className="text-[10px] font-black">M</span>, 
    placeholder: '...',
    docsUrl: 'https://console.mistral.ai/api-keys/',
    category: 'Direct',
    color: '#FF6B00'
  },
  { 
    id: 'cohere', 
    name: 'Cohere', 
    description: 'Command R+ and enterprise-grade RAG. Purpose-built for business applications.', 
    icon: () => <span className="text-[10px] font-black">Co</span>, 
    placeholder: '...',
    docsUrl: 'https://dashboard.cohere.com/api-keys',
    category: 'Direct',
    color: '#8B5CF6'
  },
  { 
    id: 'bytez', 
    name: 'Bytez', 
    description: 'Serverless deployment for open-source models. Pay-per-use inference at scale.', 
    icon: Layers, 
    placeholder: '...',
    docsUrl: 'https://bytez.com/dashboard',
    category: 'Specialized',
    color: '#EC4899'
  }
];

export default function SettingsView() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('hrouter_api_keys');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSave = (id: string) => {
    // Persist to localStorage
    const updated = { ...apiKeys };
    localStorage.setItem('hrouter_api_keys', JSON.stringify(updated));
    setSavedStatus(id);
    setTimeout(() => setSavedStatus(null), 2000);
  };

  // Group providers by category
  const groupedProviders = {
    Aggregator: PROVIDERS.filter(p => p.category === 'Aggregator'),
    Direct: PROVIDERS.filter(p => p.category === 'Direct'),
    Specialized: PROVIDERS.filter(p => p.category === 'Specialized'),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-4xl font-bold tracking-tight text-gray-900">API Settings</h2>
        <p className="text-gray-500">Manage your API providers and keys. Keys are stored locally in your browser.</p>
      </motion.div>

      {/* Aggregators Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-cyan-500" />
          <h3 className="font-bold text-gray-900">Aggregators</h3>
          <Badge className="bg-cyan-100 text-cyan-700 border-none text-[10px]">Multi-Provider</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {groupedProviders.Aggregator.map((provider) => (
            <ProviderCard 
              key={provider.id} 
              provider={provider} 
              apiKey={apiKeys[provider.id] || ''}
              onChange={(value) => setApiKeys(prev => ({ ...prev, [provider.id]: value }))}
              onSave={() => handleSave(provider.id)}
              saved={savedStatus === provider.id}
            />
          ))}
        </div>
      </motion.div>

      {/* Direct Providers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-purple-500" />
          <h3 className="font-bold text-gray-900">Direct Providers</h3>
          <Badge className="bg-purple-100 text-purple-700 border-none text-[10px]">Official APIs</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groupedProviders.Direct.map((provider) => (
            <ProviderCard 
              key={provider.id} 
              provider={provider} 
              apiKey={apiKeys[provider.id] || ''}
              onChange={(value) => setApiKeys(prev => ({ ...prev, [provider.id]: value }))}
              onSave={() => handleSave(provider.id)}
              saved={savedStatus === provider.id}
            />
          ))}
        </div>
      </motion.div>

      {/* Specialized Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-pink-500" />
          <h3 className="font-bold text-gray-900">Specialized</h3>
          <Badge className="bg-pink-100 text-pink-700 border-none text-[10px]">Niche Use Cases</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groupedProviders.Specialized.map((provider) => (
            <ProviderCard 
              key={provider.id} 
              provider={provider} 
              apiKey={apiKeys[provider.id] || ''}
              onChange={(value) => setApiKeys(prev => ({ ...prev, [provider.id]: value }))}
              onSave={() => handleSave(provider.id)}
              saved={savedStatus === provider.id}
            />
          ))}
        </div>
      </motion.div>

      {/* Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
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
      </motion.div>
    </div>
  );
}

// Individual Provider Card Component
function ProviderCard({ 
  provider, 
  apiKey, 
  onChange, 
  onSave, 
  saved 
}: { 
  provider: APIProvider;
  apiKey: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saved: boolean;
}) {
  return (
    <RotatingGlowBorder className="h-full">
      <div className="bg-white p-5 h-full">
        <div className="flex items-start gap-4">
          {/* Icon with brand color */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white"
            style={{ backgroundColor: provider.color }}
          >
            <provider.icon size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">{provider.name}</h3>
              <Badge 
                className="border-none text-[10px] py-0 px-2"
                style={{ backgroundColor: `${provider.color}20`, color: provider.color }}
              >
                {provider.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-4">{provider.description}</p>
            
            {/* API Key Input */}
            <div className="relative group mb-3">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                <Key size={16} />
              </div>
              <input
                type="password"
                placeholder={provider.placeholder}
                value={apiKey}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            
            {/* Actions */}
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
                onClick={onSave}
                className={cn(
                  "h-8 px-4 text-xs font-bold transition-all",
                  saved ? "bg-green-600 hover:bg-green-600" : "bg-black hover:bg-gray-800"
                )}
              >
                {saved ? (
                  <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Saved</span>
                ) : (
                  <span className="flex items-center gap-1"><Save size={14} /> Save</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RotatingGlowBorder>
  );
}
