import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { 
  Cpu, Zap, Shield, ArrowRight, Layers, Globe, BarChart3, Code2, 
  Github, Sparkles, Star, Terminal, Box, ArrowUpRight, ChevronRight 
} from 'lucide-react';
import { Button, Badge } from './UI';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
  onDocs?: () => void;
}

// ==================== ANIMATION VARIANTS ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" as const } 
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

const floatVariants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 3, 0, -3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// ==================== COMPONENTS ====================

// Animated text with letter-by-letter reveal
const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.span className={cn("inline-flex flex-wrap justify-center", className)}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Shimmer effect component
const ShimmerEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      initial={{ x: "-200%" }}
      whileHover={{ x: "200%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  </div>
);

// Magnetic button with cursor following
const MagneticButton = ({ 
  children, 
  onClick, 
  className, 
  variant = "primary" 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles = "relative px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 overflow-hidden";
  const variantStyles = {
    primary: "bg-gray-900 text-white hover:bg-black border-2 border-gray-900 shadow-2xl shadow-black/30",
    secondary: "bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-400 shadow-xl",
    outline: "bg-transparent text-white border-2 border-white/30 hover:border-white/60 backdrop-blur-sm",
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md animate-pulse pointer-events-none" />
      <div className="absolute -inset-[3px] bg-gradient-to-r from-yellow-400 via-red-500 via-purple-600 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-60 transition-all duration-700 blur-lg animate-pulse pointer-events-none" style={{ animationDelay: '0.2s' }} />
      <ShimmerEffect />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

// Rotating gradient border
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
    <div className="absolute -inset-[4px] bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-50 transition-all duration-700 blur-xl animate-pulse" style={{ animationDelay: '0.3s' }} />
    <div className="relative bg-white rounded-2xl border border-gray-200 group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-2xl overflow-hidden">
      {children}
    </div>
  </div>
);

// Floating particle effect
const ParticleEffect = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-400/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -100, -200], x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50], opacity: [0, 0.8, 0], scale: [0, 1, 0.5] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Card with tilt effect
const TiltCard = ({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    setRotateX((-mouseY / (rect.height / 2)) * 12);
    setRotateY((mouseX / (rect.width / 2)) * 12);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      animate={{ rotateX, rotateY, y: rotateX !== 0 || rotateY !== 0 ? -10 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group cursor-pointer"
    >
      <RotatingGlowBorder className="h-full">
        <div className="bg-white p-8 h-full flex flex-col relative overflow-hidden">
          <motion.div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 border-2 border-gray-900 shadow-lg relative"
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white rounded-xl" />
            <Icon size={28} className="text-gray-900 relative z-10" />
            <motion.div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-pink-400/50 rounded-2xl blur-md -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:via-purple-600 group-hover:to-gray-900 transition-all duration-500">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
          <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </RotatingGlowBorder>
    </motion.div>
  );
};

// Stat counter
const AnimatedStat = ({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) => {
  const prefix = value.replace(/[0-9.]/g, "").replace(suffix, "");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group"
    >
      <RotatingGlowBorder>
        <div className="text-center space-y-4 py-10 px-6 bg-white relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.p className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {prefix}{value.replace(prefix, "").replace(suffix, "")}{suffix}
          </motion.p>
          <motion.div className="h-1 w-16 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400 relative z-10">{label}</p>
        </div>
      </RotatingGlowBorder>
    </motion.div>
  );
};

// Spotlight cursor effect
const SpotlightCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setMousePosition({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 blur-3xl transition-transform duration-100"
      style={{
        background: "radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
      }}
    />
  );
};

// Nebula background
const NebulaBackground = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div style={{ y: y1, rotate }} className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%]">
        <motion.div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(59,130,246,0.1) 30%, rgba(168,85,247,0.05) 60%, transparent 80%)", filter: "blur(80px)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div style={{ y: y2, rotate: useTransform(rotate, v => -v) }} className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%]">
        <motion.div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.1) 30%, rgba(34,211,238,0.05) 60%, transparent 80%)", filter: "blur(80px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>
    </div>
  );
};

// Floating decorative element
const FloatingIcon = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div className={cn("absolute", className)} variants={floatVariants} animate="animate" style={{ animationDelay: `${delay}s` }} whileHover={{ scale: 1.2, rotate: 15 }}>
    <RotatingGlowBorder>
      <div className="p-3 bg-white">{children}</div>
    </RotatingGlowBorder>
  </motion.div>
);

export default function LandingPage({ onStart, onDocs }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="bg-white overflow-x-hidden -m-6 lg:-m-10 selection:bg-gray-900 selection:text-white">
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 origin-left z-50" style={{ scaleX }} />
      
      {/* Effects */}
      <SpotlightCursor />
      <NebulaBackground />
      <ParticleEffect />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 z-10">
        <motion.div className="max-w-6xl mx-auto text-center space-y-12 relative" variants={containerVariants} initial="hidden" animate="visible">
          {/* Floating decorative elements */}
          <FloatingIcon className="-top-8 -right-16 hidden xl:block" delay={0}>
            <Terminal size={28} className="text-gray-900" />
          </FloatingIcon>
          <FloatingIcon className="top-20 -left-20 hidden xl:block" delay={1.5}>
            <Box size={28} className="text-gray-900" />
          </FloatingIcon>
          <FloatingIcon className="bottom-32 -right-24 hidden xl:block" delay={3}>
            <Sparkles size={28} className="text-amber-500" />
          </FloatingIcon>

          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} className="inline-flex">
              <RotatingGlowBorder>
                <div className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-900">
                  <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Sparkles size={14} className="text-amber-500" />
                  </motion.div>
                  Introducing HRouter v0.4.0
                </div>
              </RotatingGlowBorder>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="relative">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter text-gray-900 leading-[0.85] md:leading-[0.8]">
              <AnimatedText text="Intelligent" />
              <br />
              <span className="relative inline-block">
                <motion.span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-600 to-gray-400 inline-block" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <AnimatedText text="LLM Routing" />
                </motion.span>
                <motion.div className="absolute -inset-8 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-3xl -z-10"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            The world's most advanced intelligent routing layer for LLMs.
            <motion.span className="inline-block" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
              Dynamically optimize
            </motion.span> for cost, speed, and capability in real-time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <div className="group">
              <MagneticButton onClick={onStart} variant="primary">
                Launch Dashboard
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={20} />
                </motion.span>
              </MagneticButton>
            </div>
            <MagneticButton variant="secondary" onClick={onDocs}>
              Documentation
              <ArrowUpRight size={18} />
            </MagneticButton>
          </motion.div>

          {/* Brand logos */}
          <motion.div variants={itemVariants} className="pt-24 md:pt-32">
            <motion.p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-12"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Trusted by industry leaders
            </motion.p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {['NVIDIA', 'OpenAI', 'Together AI', 'Mistral'].map((brand, i) => (
                <motion.div key={brand}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <RotatingGlowBorder>
                    <div className="flex items-center justify-center font-black text-xl md:text-2xl tracking-tighter text-gray-900 py-6 grayscale hover:grayscale-0 transition-all duration-500">
                      {brand}
                    </div>
                  </RotatingGlowBorder>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1">
              <motion.div className="w-1.5 h-3 bg-gray-400 rounded-full" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 bg-gray-50/30 border-y border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16 md:mb-24 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} viewport={{ once: true }} whileHover={{ scale: 1.05 }} className="inline-block">
              <RotatingGlowBorder>
                <Badge className="bg-white text-gray-900 border-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest">Core Capabilities</Badge>
              </RotatingGlowBorder>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              <AnimatedText text="Engineered for Performance" />
            </h2>
            <motion.p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              HRouter uses advanced ML models to predict cost vs. quality trade-offs in real-time.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Latency Optimized", desc: "Detect and use the nearest or fastest available endpoint automatically." },
              { icon: Shield, title: "Privacy Aware", desc: "Route sensitive queries to local or private endpoints based on data classification." },
              { icon: BarChart3, title: "Cost Efficient", desc: "Incentivize efficient usage by rewarding cost-saving behavior across providers." },
              { icon: Layers, title: "18+ Built-in Routers", desc: "From KNN and SVM to Graph-based and Agentic multi-round implementations." },
              { icon: Globe, title: "Global Failover", desc: "Enable fallback and failover intelligence across multiple providers seamlessly." },
              { icon: Code2, title: "Plugin System", desc: "Easily extend HRouter with your own custom routing strategies and metrics." }
            ].map((feature, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <TiltCard icon={feature.icon} title={feature.title} desc={feature.desc} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Queries', value: '12M+', suffix: '+' },
              { label: 'Cost Saved', value: '$450K+', suffix: '+' },
              { label: 'Avg. Latency', value: '142', suffix: 'ms' },
              { label: 'Model Accuracy', value: '98.4', suffix: '%' },
            ].map((stat, i) => (
              <AnimatedStat key={i} value={stat.value} label={stat.label} suffix={stat.suffix} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative max-w-6xl mx-auto">
          {/* Animated outer glow */}
          <motion.div className="absolute -inset-6 rounded-[2.5rem] md:rounded-[3rem]"
            style={{ background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f97316, #22d3ee)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-[3rem] md:rounded-[4rem] opacity-40 blur-2xl animate-pulse" />
          <div className="absolute -inset-12 bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 rounded-[4rem] md:rounded-[5rem] opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center text-white space-y-10 border-2 border-gray-800 shadow-2xl overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.03)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.03)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />
            </div>
            
            {/* Floating orbs inside CTA */}
            <motion.div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-cyan-500/20 blur-3xl" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} />
            <motion.div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />
            
            <div className="relative z-10 space-y-6">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200 }} className="inline-block">
                <RotatingGlowBorder>
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest">
                    <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                    </motion.div>
                    Join 10,000+ developers
                  </div>
                </RotatingGlowBorder>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                <AnimatedText text="Ready to optimize your" />
                <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  <AnimatedText text="LLM infrastructure?" />
                </span>
              </h2>
              
              <motion.p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Join the open-source community building the future of intelligent model orchestration.
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 relative z-10">
              <MagneticButton onClick={onStart} variant="primary" className="bg-white text-black hover:bg-gray-100">
                Get Started Now
                <ChevronRight size={20} />
              </MagneticButton>
              <MagneticButton variant="outline">
                <Github size={20} />
                Star on GitHub
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 border-y border-gray-200 bg-gray-50/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">HRouter</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Intelligent routing infrastructure for AI models. We help developers get the best results at the lowest cost.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '50+ Countries', desc: 'Global edge deployment' },
              { title: '10K+ Developers', desc: 'Trust HRouter daily' },
              { title: '100M+ Queries', desc: 'Routed successfully' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <h3 className="text-3xl font-black text-gray-900 mb-2">{stat.title}</h3>
                <p className="text-gray-500">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 border-b border-gray-200 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'What is HRouter?', a: 'HRouter is an intelligent routing layer that automatically selects the best AI model for each query based on cost, quality, and speed.' },
              { q: 'How does it save costs?', a: 'We analyze each query and route it to the most cost-effective provider, saving 40-60% on API costs.' },
              { q: 'What providers are supported?', a: 'We support 50+ providers including OpenAI, Anthropic, Google, Mistral, DeepSeek, and more.' },
              { q: 'Is my data secure?', a: 'Yes. We do not store prompts or responses unless you explicitly enable logging. All traffic uses TLS 1.3 encryption.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 px-6 border-b border-gray-200 bg-gray-50/50 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Quick <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Start</span>
            </h2>
            <p className="text-lg text-gray-500">Get started in minutes</p>
          </motion.div>

          <div className="bg-gray-900 rounded-2xl p-8 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
              <code>{`# Install
npm install @hrouter/core

# Configure
import { HRouter } from '@hrouter/core';

const router = new HRouter({
  strategy: 'cost-optimized',
  providers: ['openai', 'anthropic']
});

# Route a query
const response = await router.route({
  prompt: 'Explain quantum computing',
  maxTokens: 500
});`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 border-b border-gray-200 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Touch</span>
            </h2>
            <p className="text-lg text-gray-500">Questions? We are here to help 24/7.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Email', value: 'support@hrouter.ai', desc: 'Get help within 24 hours' },
              { title: 'Discord', value: 'Join Community', desc: 'Real-time support' },
              { title: 'GitHub', value: 'github.com/hrouter', desc: 'Open source issues' },
            ].map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-gray-900 transition-colors cursor-pointer"
              >
                <h3 className="font-bold text-gray-900 mb-1">{contact.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{contact.value}</p>
                <p className="text-sm text-gray-500">{contact.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-200 relative z-10 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex flex-col md:flex-row items-center justify-between gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <RotatingGlowBorder>
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xl">H</div>
              </RotatingGlowBorder>
              <span className="font-bold tracking-tight text-gray-900 text-xl">HRouter</span>
            </motion.div>
            <p className="text-sm text-gray-400 font-medium">© 2026 HRouter Open Source Project. All rights reserved.</p>
            <div className="flex items-center gap-8">
              {['Twitter', 'Discord', 'GitHub'].map((link, i) => (
                <motion.a key={link} href="#" className="relative group text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                  whileHover={{ y: -2, scale: 1.05 }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="relative z-10">{link}</span>
                  <motion.div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
