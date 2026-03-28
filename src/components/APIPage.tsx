import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Code2, Terminal, Copy, Check, Server, Key, Webhook, Globe, Shield, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const ShimmerEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" initial={{ x: "-200%" }} whileHover={{ x: "200%" }} transition={{ duration: 0.8, ease: "easeInOut" }} />
  </div>
);

const AnimatedText = ({ text, className }: { text: string; className?: string }) => (
  <motion.span className={cn("inline-flex flex-wrap justify-center", className)}>
    {text.split("").map((char, i) => (
      <motion.span key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.02, duration: 0.4 }} className="inline-block">
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </motion.span>
);

const RotatingGlowBorder = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative group", className)}>
    <motion.div className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f97316, #22d3ee)" }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
    <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-80 transition-all duration-500 blur-md animate-pulse" />
    <div className="relative bg-white rounded-2xl border border-gray-200 group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-2xl overflow-hidden">{children}</div>
  </div>
);

const apiEndpoints = [
  {
    method: 'POST',
    path: '/v1/route',
    description: 'Route a query to the optimal LLM provider',
    example: `curl -X POST https://api.hrouter.ai/v1/route \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explain quantum computing",
    "strategy": "cost-optimized",
    "max_tokens": 500
  }'`,
  },
  {
    method: 'GET',
    path: '/v1/providers',
    description: 'List all available providers and their status',
    example: `curl -X GET https://api.hrouter.ai/v1/providers \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  {
    method: 'POST',
    path: '/v1/chat/completions',
    description: 'OpenAI-compatible chat completions endpoint',
    example: `curl -X POST https://api.hrouter.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "hrouter-auto",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "stream": true
  }'`,
  },
  {
    method: 'GET',
    path: '/v1/usage',
    description: 'Get usage statistics for your account',
    example: `curl -X GET https://api.hrouter.ai/v1/usage \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'`,
  },
];

const sdks = [
  { name: 'JavaScript/TypeScript', icon: 'JS', color: 'bg-yellow-400', desc: 'npm install @hrouter/sdk' },
  { name: 'Python', icon: 'PY', color: 'bg-blue-500', desc: 'pip install hrouter' },
  { name: 'Go', icon: 'GO', color: 'bg-cyan-500', desc: 'go get github.com/hrouter/sdk' },
  { name: 'Rust', icon: 'RS', color: 'bg-orange-500', desc: 'cargo add hrouter-sdk' },
];

export default function APIPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'rest' | 'sdk'>('rest');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 origin-left z-50" style={{ scaleX }} />
      
      {/* Hero */}
      <section className="relative py-16 px-6 border-b border-gray-200 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex"
          >
            <RotatingGlowBorder>
              <div className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-900">
                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Code2 size={14} className="text-cyan-500" />
                </motion.div>
                API Reference
              </div>
            </RotatingGlowBorder>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[0.9]">
            <AnimatedText text="HRouter API" /><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              <AnimatedText text="Documentation" />
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Simple, powerful REST API for intelligent LLM routing. OpenAI-compatible endpoints.
          </motion.p>
        </motion.div>
      </section>

      {/* Quick Start Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Key, title: 'Get API Key', desc: 'Generate your API key from the dashboard settings', color: 'cyan' },
              { icon: Terminal, title: 'Make a Request', desc: 'Use our REST API or SDKs to start routing queries', color: 'purple' },
              { icon: Zap, title: 'Optimize', desc: 'Let HRouter automatically optimize for cost and quality', color: 'pink' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <RotatingGlowBorder className="h-full">
                  <div className="bg-white p-6 h-full">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      step.color === 'cyan' && "bg-cyan-100",
                      step.color === 'purple' && "bg-purple-100",
                      step.color === 'pink' && "bg-pink-100"
                    )}>
                      <step.icon size={24} className={cn(
                        step.color === 'cyan' && "text-cyan-600",
                        step.color === 'purple' && "text-purple-600",
                        step.color === 'pink' && "text-pink-600"
                      )} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm">{step.desc}</p>
                  </div>
                </RotatingGlowBorder>
              </motion.div>
            ))}
          </div>

          {/* Tab Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setActiveTab('rest')}
                className={cn(
                  "px-6 py-2 rounded-lg font-bold transition-all",
                  activeTab === 'rest' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                REST API
              </button>
              <button
                onClick={() => setActiveTab('sdk')}
                className={cn(
                  "px-6 py-2 rounded-lg font-bold transition-all",
                  activeTab === 'sdk' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                SDKs
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'rest' ? (
            <div className="space-y-6">
              {apiEndpoints.map((endpoint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RotatingGlowBorder>
                    <div className="bg-white">
                      <div className="flex items-center gap-4 p-6 border-b border-gray-100">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          endpoint.method === 'GET' && "bg-green-100 text-green-700",
                          endpoint.method === 'POST' && "bg-blue-100 text-blue-700",
                          endpoint.method === 'PUT' && "bg-yellow-100 text-yellow-700",
                          endpoint.method === 'DELETE' && "bg-red-100 text-red-700"
                        )}>
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-gray-900 font-bold">{endpoint.path}</code>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 mb-4">{endpoint.description}</p>
                        <div className="relative bg-gray-950 rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                            <span className="text-xs text-gray-400 font-mono">Example Request</span>
                            <button
                              onClick={() => copyToClipboard(endpoint.example, index)}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                              {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                              {copiedIndex === index ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-sm text-gray-300 font-mono">{endpoint.example}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </RotatingGlowBorder>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sdks.map((sdk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RotatingGlowBorder className="h-full">
                    <div className="bg-white p-6 flex items-center gap-4">
                      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg", sdk.color)}>
                        {sdk.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{sdk.name}</h3>
                        <code className="text-sm text-gray-500 font-mono">{sdk.desc}</code>
                      </div>
                      <ArrowRight size={20} className="text-gray-400" />
                    </div>
                  </RotatingGlowBorder>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50/50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use HRouter API?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: 'Global Edge', desc: 'Deploy close to your users for minimal latency' },
              { icon: Shield, title: 'Secure', desc: 'TLS 1.3, API key auth, and request signing' },
              { icon: Webhook, title: 'Webhooks', desc: 'Real-time events for routing decisions' },
              { icon: Server, title: '99.99% Uptime', desc: 'Enterprise SLA with guaranteed availability' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <RotatingGlowBorder className="h-full">
                  <div className="bg-white p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-sm">{feature.desc}</p>
                  </div>
                </RotatingGlowBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RotatingGlowBorder>
              <div className="bg-gray-900 text-white p-12 text-center rounded-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to integrate?</h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Get started with our API in minutes. Free tier includes 1,000 requests.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    Get API Key
                    <ArrowRight size={18} />
                  </button>
                  <button className="px-8 py-4 border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                    View Full Docs
                  </button>
                </div>
              </div>
            </RotatingGlowBorder>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
