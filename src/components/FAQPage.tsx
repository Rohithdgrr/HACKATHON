import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { MessageCircleQuestion, Search, ChevronDown, ChevronUp, HelpCircle, Zap, Shield, CreditCard, Code, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const ShimmerEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" initial={{ x: "-200%" }} whileHover={{ x: "200%" }} transition={{ duration: 0.8, ease: "easeInOut" }} />
  </div>
);

const RotatingGlowBorder = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative group", className)}>
    <motion.div className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f97316, #22d3ee)" }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
    <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-80 transition-all duration-500 blur-md animate-pulse" />
    <div className="relative bg-white rounded-2xl border border-gray-200 group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-2xl overflow-hidden">{children}</div>
  </div>
);

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.span className={cn("inline-flex flex-wrap justify-center", className)}>
      {text.split("").map((char, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.02, duration: 0.4 }} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const categories = [
  { id: 'all', name: 'All Questions', icon: HelpCircle },
  { id: 'getting-started', name: 'Getting Started', icon: Sparkles },
  { id: 'billing', name: 'Billing & Plans', icon: CreditCard },
  { id: 'technical', name: 'Technical', icon: Code },
  { id: 'security', name: 'Security & Privacy', icon: Shield },
];

const faqs = [
  {
    id: 1,
    category: 'getting-started',
    question: 'What is HRouter and how does it work?',
    answer: 'HRouter is an intelligent routing layer for LLMs that automatically selects the best AI model for each query based on cost, quality, speed, and your specific requirements. It works by analyzing your prompt and routing it to the most suitable provider from our network of 50+ supported LLMs.',
  },
  {
    id: 2,
    category: 'getting-started',
    question: 'How do I get started with HRouter?',
    answer: 'Getting started is simple: 1) Access the dashboard, 2) Configure your API settings, 3) Install our SDK with npm/yarn, 4) Configure your providers and start routing queries. Check our Documentation page for detailed setup instructions.',
  },
  {
    id: 3,
    category: 'getting-started',
    question: 'What providers does HRouter support?',
    answer: 'HRouter supports 50+ providers including OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), Google (Gemini, PaLM), Azure OpenAI, AWS Bedrock, Together AI, Replicate, and many open-source models. We continuously add new providers as they become available.',
  },
  {
    id: 4,
    category: 'billing',
    question: 'Is there a free plan available?',
    answer: 'Yes! Our Free plan includes 1,000 requests per month, access to 3 providers, and basic routing strategies. It is perfect for testing and small projects.',
  },
  {
    id: 5,
    category: 'billing',
    question: 'How does billing work?',
    answer: 'We offer both subscription plans (Free, Pro at $49/month) and usage-based pricing. Subscription plans include a set number of requests per month. Enterprise customers can get custom pricing based on volume and specific requirements.',
  },
  {
    id: 6,
    category: 'billing',
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Absolutely! You can change your plan at any time from your account settings. Upgrades take effect immediately, while downgrades apply at the start of your next billing cycle. We also offer a 14-day free trial for paid plans.',
  },
  {
    id: 7,
    category: 'technical',
    question: 'What routing strategies are available?',
    answer: 'We offer 18+ built-in routing strategies including: Cost-Optimized, Quality-First, Speed-Optimized, Round Robin, Load Balancing, KNN-based routing, SVM-based classification, Graph-based routing, and Adaptive ML-powered routing. You can also build custom strategies.',
  },
  {
    id: 8,
    category: 'technical',
    question: 'Does HRouter support streaming responses?',
    answer: 'Yes, HRouter fully supports streaming responses from all compatible providers. Our SDK handles streaming seamlessly, so you get real-time responses just like using the providers directly.',
  },
  {
    id: 9,
    category: 'technical',
    question: 'Can I use HRouter with my own models?',
    answer: 'Yes! HRouter works with any OpenAI-compatible API endpoint, including self-hosted models. You can add custom providers with their API endpoints, and our routing system will include them in the decision process.',
  },
  {
    id: 10,
    category: 'technical',
    question: 'What is the latency overhead?',
    answer: 'HRouter adds minimal latency (typically 10-50ms) for routing decisions. Our edge-deployed infrastructure ensures that routing happens close to your users. In many cases, the optimal provider selection actually reduces overall latency.',
  },
  {
    id: 11,
    category: 'security',
    question: 'Is my data secure with HRouter?',
    answer: 'Security is our top priority. We do not store your prompts or responses (unless you explicitly enable logging). All traffic is encrypted with TLS 1.3. Enterprise plans include additional security features like audit logs, SSO, and dedicated infrastructure.',
  },
  {
    id: 12,
    category: 'security',
    question: 'Do you support HIPAA/GDPR compliance?',
    answer: 'Yes, our Enterprise plan includes HIPAA and GDPR compliance features. We offer Business Associate Agreements (BAAs) for healthcare customers and Data Processing Agreements (DPAs) for GDPR compliance. Contact our sales team for more details.',
  },
  {
    id: 13,
    category: 'security',
    question: 'Can I route sensitive data to specific providers?',
    answer: 'Absolutely. You can configure data classification rules to automatically route sensitive queries to compliant providers (e.g., HIPAA-compliant endpoints, EU-based servers for GDPR). Our Privacy-Aware router handles this automatically.',
  },
  {
    id: 14,
    category: 'getting-started',
    question: 'How much can I save with HRouter?',
    answer: 'Most customers save 40-60% on their LLM API costs by using our intelligent routing. The exact savings depend on your usage patterns and which providers you configure. Our dashboard shows real-time cost savings analytics.',
  },
  {
    id: 15,
    category: 'technical',
    question: 'What happens if a provider fails?',
    answer: 'HRouter includes automatic failover. If a provider is unavailable or returns an error, we automatically retry with the next best provider. You can configure fallback chains and retry policies to match your requirements.',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                  <MessageCircleQuestion size={14} className="text-purple-500" />
                </motion.div>
                Most Asked Questions
              </div>
            </RotatingGlowBorder>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[0.9]">
            <AnimatedText text="Frequently Asked" /><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              <AnimatedText text="Questions" />
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Find answers to the most common questions about HRouter
          </motion.p>
        </motion.div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 px-6 bg-gray-50/50 border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-lg"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all",
                  selectedCategory === cat.id
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or category</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RotatingGlowBorder>
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="w-full bg-white p-6 text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded">
                              {categories.find(c => c.id === faq.category)?.name}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">{faq.question}</h3>
                        </div>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                          expandedId === faq.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                        )}>
                          {expandedId === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedId === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </RotatingGlowBorder>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RotatingGlowBorder>
              <div className="bg-gray-900 text-white p-12 text-center rounded-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Still have questions?</h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Can't find what you are looking for? Our support team is here to help you 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {}}
                    className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Contact Support
                    <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => {}}
                    className="px-8 py-4 border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
                  >
                    View Documentation
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
