import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Users, Target, Rocket, Heart, Globe, Award, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

// ==================== ANIMATION COMPONENTS ====================

const ShimmerEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
      initial={{ x: "-200%" }}
      whileHover={{ x: "200%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  </div>
);

const MagneticButton = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
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

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn("relative px-8 py-4 rounded-xl font-bold transition-all overflow-hidden", className)}
    >
      <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md" />
      <ShimmerEffect />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

const RotatingGlowBorder = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative group", className)}>
    <motion.div 
      className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f97316, #22d3ee)" }}
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

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setRotateX((-(e.clientY - centerY) / (rect.height / 2)) * 10);
    setRotateY(((e.clientX - centerX) / (rect.width / 2)) * 10);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      animate={{ rotateX, rotateY, y: rotateX !== 0 ? -8 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1, y: 0, rotateX: 0,
      transition: { delay: i * 0.03, duration: 0.5, ease: "easeOut" as const },
    }),
  };
  return (
    <motion.span className={cn("inline-flex flex-wrap justify-center", className)}>
      {text.split("").map((char, i) => (
        <motion.span key={i} custom={i} variants={letterVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const ParticleBackground = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 4 + 2, duration: Math.random() * 10 + 10, delay: Math.random() * 5,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-400/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -100, -200], x: [0, Math.random() * 50 - 25], opacity: [0, 0.6, 0], scale: [0, 1, 0.5] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const teamMembers = [
  { name: 'Alex Chen', role: 'Founder & CEO', initials: 'AC' },
  { name: 'Sarah Miller', role: 'CTO', initials: 'SM' },
  { name: 'James Wilson', role: 'Head of Engineering', initials: 'JW' },
  { name: 'Emily Zhang', role: 'Lead Designer', initials: 'EZ' },
  { name: 'Michael Brown', role: 'Product Manager', initials: 'MB' },
  { name: 'Lisa Wang', role: 'ML Engineer', initials: 'LW' },
];

const milestones = [
  { year: '2023', title: 'Project Inception', desc: 'HRouter started as a research project at MIT' },
  { year: '2024', title: 'First Release', desc: 'Launched v0.1 with basic routing capabilities' },
  { year: '2024', title: 'Series A', desc: 'Raised $12M to scale the platform' },
  { year: '2025', title: 'Enterprise Launch', desc: 'Released enterprise features and SLA guarantees' },
  { year: '2026', title: 'Global Expansion', desc: 'Expanded to 50+ countries with local endpoints' },
];

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-white relative">
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 origin-left z-50" style={{ scaleX }} />
      
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative py-20 px-6 border-b border-gray-200 z-10">
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
                  <Sparkles size={14} className="text-amber-500" />
                </motion.div>
                Our Story
              </div>
            </RotatingGlowBorder>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[0.9]">
            <AnimatedText text="Building the Future of" /><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              <AnimatedText text="LLM Infrastructure" />
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            We're on a mission to democratize access to AI by making intelligent routing accessible to everyone.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To build intelligent infrastructure that makes AI accessible, affordable, and efficient for developers worldwide.' },
              { icon: Globe, title: 'Our Vision', desc: 'A world where every developer can leverage the best AI models without worrying about cost or complexity.' },
              { icon: Heart, title: 'Our Values', desc: 'Open source, transparency, and community-driven innovation. We believe AI should benefit everyone.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <RotatingGlowBorder className="h-full">
                  <div className="bg-white p-8 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-6">
                      <item.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </RotatingGlowBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-gray-50/50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50+', label: 'Countries' },
              { value: '10K+', label: 'Developers' },
              { value: '100M+', label: 'Queries Routed' },
              { value: '$2M+', label: 'Cost Saved' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{stat.value}</p>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-500">From a research project to a global platform</p>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="w-20 shrink-0 text-right">
                  <span className="text-2xl font-black text-gray-900">{milestone.year}</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-gray-900 mt-2 shrink-0 relative">
                  <div className="absolute -inset-2 bg-gray-900/20 rounded-full animate-pulse" />
                </div>
                <RotatingGlowBorder className="flex-1">
                  <div className="bg-white p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{milestone.title}</h4>
                    <p className="text-gray-500">{milestone.desc}</p>
                  </div>
                </RotatingGlowBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-gray-50/50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-gray-500">The people building the future of AI infrastructure</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <RotatingGlowBorder>
                    <div className="bg-white p-6 text-center relative overflow-hidden">
                      <ShimmerEffect />
                      <motion.div 
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {member.initials}
                      </motion.div>
                      <h4 className="font-bold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </RotatingGlowBorder>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Investors/Partners */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Backed By</h2>
            <p className="text-gray-500">Leading investors in AI infrastructure</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Andreessen Horowitz', 'Sequoia Capital', 'Y Combinator', 'Google Ventures'].map((investor, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <RotatingGlowBorder>
                    <div className="bg-white p-8 flex items-center justify-center h-24 relative overflow-hidden">
                      <ShimmerEffect />
                      <motion.span 
                        className="font-bold text-gray-900 text-lg relative z-10"
                        whileHover={{ scale: 1.05 }}
                      >
                        {investor}
                      </motion.span>
                    </div>
                  </RotatingGlowBorder>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
