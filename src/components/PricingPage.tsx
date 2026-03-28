import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Sparkles, Zap, Shield, Building2, ArrowRight, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';

const RotatingGlowBorder = ({ children, className, active = false }: { children: React.ReactNode; className?: string; active?: boolean }) => (
  <div className={cn("relative group", className)}>
    <motion.div 
      className={cn("absolute -inset-[2px] rounded-2xl transition-opacity duration-500", active ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
      style={{
        background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f97316, #22d3ee)",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
    <div className={cn("absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl blur-md animate-pulse", active ? "opacity-80" : "opacity-0 group-hover:opacity-80")} />
    <div className={cn("relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden", active ? "border-transparent shadow-2xl" : "border-gray-200 group-hover:border-transparent shadow-lg group-hover:shadow-2xl")}>
      {children}
    </div>
  </div>
);

const plans = [
  {
    name: 'Free',
    icon: Zap,
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      { text: '1,000 requests/month', included: true },
      { text: '3 providers', included: true },
      { text: 'Basic routing strategies', included: true },
      { text: 'Community support', included: true },
      { text: 'Analytics dashboard', included: false },
      { text: 'Custom strategies', included: false },
      { text: 'SLA guarantee', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Sparkles,
    price: '$49',
    period: '/month',
    description: 'For growing teams',
    features: [
      { text: '50,000 requests/month', included: true },
      { text: '10+ providers', included: true },
      { text: 'All routing strategies', included: true },
      { text: 'Email support', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Custom strategies', included: true },
      { text: 'SLA guarantee', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      { text: 'Unlimited requests', included: true },
      { text: 'All providers', included: true },
      { text: 'All routing strategies', included: true },
      { text: '24/7 phone support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom strategies', included: true },
      { text: '99.99% SLA', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const comparisonFeatures = [
  { name: 'Requests/Month', free: '1,000', pro: '50,000', enterprise: 'Unlimited' },
  { name: 'Providers', free: '3', pro: '10+', enterprise: 'All 50+' },
  { name: 'Routing Strategies', free: 'Basic', pro: 'All', enterprise: 'All + Custom' },
  { name: 'Analytics', free: 'Basic', pro: 'Advanced', enterprise: 'Enterprise' },
  { name: 'Support', free: 'Community', pro: 'Email', enterprise: '24/7 Dedicated' },
  { name: 'SLA', free: '-', pro: '99.9%', enterprise: '99.99%' },
  { name: 'Custom Integration', free: '-', pro: '-', enterprise: '✓' },
  { name: 'On-premise Option', free: '-', pro: '-', enterprise: '✓' },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

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
            <RotatingGlowBorder active>
              <div className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-900">
                <CreditCard size={14} className="text-purple-500" />
                Pricing
              </div>
            </RotatingGlowBorder>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[0.9]">
            Simple, Transparent<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Pricing
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={cn("text-sm font-bold", billingCycle === 'monthly' ? "text-gray-900" : "text-gray-400")}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors"
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-gray-900 rounded-full"
                animate={{ left: billingCycle === 'monthly' ? '4px' : '34px' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={cn("text-sm font-bold", billingCycle === 'yearly' ? "text-gray-900" : "text-gray-400")}>
              Yearly
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Save 20%</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                <RotatingGlowBorder active={plan.popular || hoveredPlan === plan.name}>
                  <div className={cn("bg-white p-8", plan.popular && "relative")}>
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-white text-center py-2 text-xs font-bold uppercase tracking-wider">
                        Most Popular
                      </div>
                    )}
                    <div className={cn("flex items-center gap-3 mb-4", plan.popular && "mt-6")}>
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", plan.popular ? "bg-gray-900" : "bg-gray-100")}>
                        <plan.icon size={24} className={plan.popular ? "text-white" : "text-gray-600"} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                      {billingCycle === 'yearly' && plan.price !== 'Custom' && plan.price !== '$0' && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          Save ${Math.round(parseInt(plan.price.slice(1)) * 0.2 * 12)}/year
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check size={18} className="text-green-500 shrink-0" />
                          ) : (
                            <X size={18} className="text-gray-300 shrink-0" />
                          )}
                          <span className={cn("text-sm", feature.included ? "text-gray-700" : "text-gray-400")}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button className={cn(
                      "w-full py-4 rounded-xl font-bold transition-all",
                      plan.popular 
                        ? "bg-gray-900 text-white hover:bg-black" 
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}>
                      {plan.cta}
                    </button>
                  </div>
                </RotatingGlowBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-6 bg-gray-50/50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Plans</h2>
            <p className="text-gray-500">Detailed feature comparison</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Free</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Pro</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">{feature.name}</td>
                    <td className="text-center py-4 px-4 text-gray-600">{feature.free}</td>
                    <td className="text-center py-4 px-4 text-gray-900 font-medium">{feature.pro}</td>
                    <td className="text-center py-4 px-4 text-gray-900 font-medium">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing FAQ</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Can I change plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'Yes, all paid plans include a 14-day free trial with full access to all features.' },
              { q: 'What happens if I exceed my request limit?', a: "We'll notify you when you're close to your limit. You can upgrade or pay per request for overages." },
              { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee for all paid plans.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
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
            <RotatingGlowBorder active>
              <div className="bg-gray-900 text-white p-12 text-center rounded-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Still have questions?</h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Our team is here to help you find the perfect plan for your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    Contact Sales
                    <ArrowRight size={18} />
                  </button>
                  <button className="px-8 py-4 border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                    Schedule Demo
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
