import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle, Sparkles, Github, Twitter, Linkedin, ArrowRight, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

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

const contactMethods = [
  { icon: Mail, title: 'Email', value: 'support@hrouter.ai', desc: 'Get help within 24 hours', color: 'cyan' },
  { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567', desc: 'Mon-Fri 9am-6pm EST', color: 'purple' },
  { icon: MapPin, title: 'Office', value: 'San Francisco, CA', desc: 'Come visit us', color: 'pink' },
];

const socialLinks = [
  { icon: Twitter, name: 'Twitter', handle: '@hrouter', color: 'from-cyan-400 to-blue-500' },
  { icon: Github, name: 'GitHub', handle: 'github.com/hrouter', color: 'from-purple-400 to-pink-500' },
  { icon: Linkedin, name: 'LinkedIn', handle: 'linkedin.com/company/hrouter', color: 'from-pink-400 to-orange-500' },
];

const supportCategories = [
  { name: 'Technical Support', desc: 'Help with integration and API issues' },
  { name: 'Sales', desc: 'Questions about pricing and enterprise' },
  { name: 'Partnerships', desc: 'Integration and reseller opportunities' },
  { name: 'General', desc: 'General questions and feedback' },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 px-6 border-b border-gray-200">
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
            className="inline-flex"
          >
            <RotatingGlowBorder>
              <div className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-900">
                <MessageSquare size={14} className="text-pink-500" />
                Contact
              </div>
            </RotatingGlowBorder>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[0.9]">
            Get in Touch<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              We're Here to Help
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question or need assistance? Our team is ready to help you 24/7.
          </p>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <RotatingGlowBorder className="h-full">
                  <div className="bg-white p-8 text-center h-full">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center",
                      method.color === 'cyan' && "bg-cyan-100",
                      method.color === 'purple' && "bg-purple-100",
                      method.color === 'pink' && "bg-pink-100"
                    )}>
                      <method.icon size={28} className={cn(
                        method.color === 'cyan' && "text-cyan-600",
                        method.color === 'purple' && "text-purple-600",
                        method.color === 'pink' && "text-pink-600"
                      )} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                    <p className="text-gray-900 font-medium mb-2">{method.value}</p>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </div>
                </RotatingGlowBorder>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {isSubmitted ? (
                <RotatingGlowBorder>
                  <div className="bg-white p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  </div>
                </RotatingGlowBorder>
              ) : (
                <RotatingGlowBorder>
                  <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        required
                        value={formState.category}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-white"
                      >
                        <option value="">Select a category</option>
                        {supportCategories.map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </RotatingGlowBorder>
              )}
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Response Time */}
              <RotatingGlowBorder>
                <div className="bg-white p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Response Time</h4>
                      <p className="text-sm text-gray-500">We typically respond within</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-black text-gray-900">2h</p>
                      <p className="text-xs text-gray-500">Enterprise</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-black text-gray-900">6h</p>
                      <p className="text-xs text-gray-500">Pro</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-black text-gray-900">24h</p>
                      <p className="text-xs text-gray-500">Free</p>
                    </div>
                  </div>
                </div>
              </RotatingGlowBorder>

              {/* Support Categories */}
              <RotatingGlowBorder>
                <div className="bg-white p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Support Categories</h4>
                  <div className="space-y-3">
                    {supportCategories.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
                          <p className="text-xs text-gray-500">{cat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RotatingGlowBorder>

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-4">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-xl bg-gradient-to-br hover:shadow-lg transition-all",
                      social.color
                    )}
                  >
                    <social.icon size={24} className="text-white mb-2" />
                    <span className="text-white font-bold text-sm">{social.name}</span>
                    <span className="text-white/70 text-xs">{social.handle}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 px-6 bg-gray-50/50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RotatingGlowBorder>
              <div className="bg-white p-12 text-center rounded-2xl">
                <MapPin size={48} className="text-gray-900 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Visit Our Headquarters</h3>
                <p className="text-gray-500 mb-4">123 AI Street, San Francisco, CA 94102</p>
                <button className="inline-flex items-center gap-2 text-gray-900 font-bold hover:gap-3 transition-all">
                  Get Directions
                  <ArrowRight size={18} />
                </button>
              </div>
            </RotatingGlowBorder>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
