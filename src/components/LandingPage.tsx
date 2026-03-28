import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Cpu, Zap, Shield, ArrowRight, Layers, Globe, BarChart3, Code2, Github, Sparkles, Star, Terminal, Box } from 'lucide-react';
import { Button, Badge, Card } from './UI';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const FloatingElement = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function LandingPage({ onStart }: LandingPageProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="bg-white overflow-x-hidden -m-6 lg:-m-10 selection:bg-gray-900 selection:text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50/50 rounded-full blur-[120px]" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-6 z-10">
        <motion.div 
          className="max-w-6xl mx-auto text-center space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-gray-900/5 backdrop-blur-md border border-gray-900/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900">
              <Sparkles size={12} className="text-amber-500" />
              Introducing HRouter v0.4.0
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter text-[#1A1C20] leading-[0.85] md:leading-[0.8]">
              Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400">
                LLM Routing
              </span>
            </h1>
            
            <FloatingElement className="absolute -top-12 -right-12 hidden lg:block" delay={0.5}>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xl rotate-12 backdrop-blur-sm bg-white/80">
                <Terminal size={24} className="text-gray-900" />
              </div>
            </FloatingElement>
            
            <FloatingElement className="absolute -bottom-12 -left-12 hidden lg:block" delay={1}>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xl -rotate-12 backdrop-blur-sm bg-white/80">
                <Box size={24} className="text-gray-900" />
              </div>
            </FloatingElement>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            The world's most advanced intelligent routing layer for LLMs. 
            Dynamically optimize for cost, speed, and capability in real-time.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button 
              onClick={onStart} 
              className="group relative px-10 py-5 bg-gray-900 text-white rounded-2xl text-lg font-bold transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl shadow-black/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="flex items-center gap-2">
                Launch Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-10 py-5 bg-white border border-gray-200 text-gray-900 rounded-2xl text-lg font-bold transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95 shadow-sm">
              Documentation
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="pt-24 md:pt-32"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-12">Trusted by industry leaders</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['NVIDIA', 'OpenAI', 'Together AI', 'Mistral'].map((brand) => (
                <div key={brand} className="flex items-center justify-center font-black text-2xl md:text-3xl tracking-tighter text-gray-900">
                  {brand}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 bg-gray-50/50 border-y border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24 space-y-4">
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Core Capabilities</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Engineered for Performance</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg font-medium">
              HRouter uses advanced ML models to predict cost vs. quality trade-offs in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Latency Optimized",
                desc: "Detect and use the nearest or fastest available endpoint automatically.",
                color: "bg-yellow-50 text-yellow-600",
                border: "hover:border-yellow-200"
              },
              {
                icon: Shield,
                title: "Privacy Aware",
                desc: "Route sensitive queries to local or private endpoints based on data classification.",
                color: "bg-blue-50 text-blue-600",
                border: "hover:border-blue-200"
              },
              {
                icon: BarChart3,
                title: "Cost Efficient",
                desc: "Incentivize efficient usage by rewarding cost-saving behavior across providers.",
                color: "bg-green-50 text-green-600",
                border: "hover:border-green-200"
              },
              {
                icon: Layers,
                title: "18+ Built-in Routers",
                desc: "From KNN and SVM to Graph-based and Agentic multi-round implementations.",
                color: "bg-purple-50 text-purple-600",
                border: "hover:border-purple-200"
              },
              {
                icon: Globe,
                title: "Global Failover",
                desc: "Enable fallback and failover intelligence across multiple providers seamlessly.",
                color: "bg-orange-50 text-orange-600",
                border: "hover:border-orange-200"
              },
              {
                icon: Code2,
                title: "Plugin System",
                desc: "Easily extend HRouter with your own custom routing strategies and metrics.",
                color: "bg-indigo-50 text-indigo-600",
                border: "hover:border-indigo-200"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={cn(
                  "bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 group cursor-default",
                  feature.border
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-black/5", feature.color)}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 text-base leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {[
              { label: 'Total Queries', value: '12M+' },
              { label: 'Cost Saved', value: '$450K+' },
              { label: 'Avg. Latency', value: '142ms' },
              { label: 'Model Accuracy', value: '98.4%' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="text-center space-y-4"
              >
                <p className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-gray-900">{stat.value}</p>
                <div className="h-1 w-12 bg-gray-900 mx-auto rounded-full opacity-10" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto bg-gray-900 rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center text-white space-y-10 relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              Join 10,000+ developers
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">Ready to optimize your <br className="hidden md:block" /> LLM infrastructure?</h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Join the open-source community building the future of intelligent model orchestration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 relative z-10">
            <button 
              onClick={onStart} 
              className="px-12 py-6 bg-white text-black hover:bg-gray-100 text-lg font-bold rounded-2xl w-full sm:w-auto transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
            >
              Get Started Now
            </button>
            <button className="px-12 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-lg font-bold rounded-2xl w-full sm:w-auto transition-all active:scale-95 flex items-center justify-center gap-2">
              <Github size={20} />
              Star on GitHub
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-black">H</div>
            <span className="font-bold tracking-tight text-gray-900">HRouter</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">© 2026 HRouter Open Source Project. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Twitter', 'Discord', 'GitHub'].map(link => (
              <a key={link} href="#" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
