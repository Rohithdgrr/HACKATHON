import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, ChevronRight, History, MessageSquare, Clock, Coins, ArrowUpRight } from 'lucide-react';
import { Card, Badge, Button } from './UI';
import { cn } from '../lib/utils';
import { historyService, ChatSession } from '../services/historyService';

const modelColors: Record<string, string> = {
  'llama-3.1-8b': 'bg-blue-100 text-blue-700',
  'mistral-large-latest': 'bg-purple-100 text-purple-700',
  'qwen-2.5-7b': 'bg-cyan-100 text-cyan-700',
  'mistral-7b': 'bg-pink-100 text-pink-700',
  'nemotron-70b': 'bg-indigo-100 text-indigo-700',
};

// Rotating gradient border component
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

export default function ChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await historyService.getHistory();
      setSessions(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 text-white rounded-xl">
              <History size={20} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Recent Chat History</h3>
          </div>
          <p className="text-sm text-gray-500 font-medium pl-1">View and manage sessions synced to HRouter Cloud Database.</p>
        </div>
        <div className="flex gap-2">
          {/* ... buttons ... */}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="h-48 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
           ))}
         </div>
      )}

      {/* Empty State */}
      {!loading && sessions.length === 0 && (
        <Card className="p-12 border-dashed border-2 bg-gray-50 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <MessageSquare size={32} className="text-gray-300" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">No Remote History</h4>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">Complete a chat session to see it persisted in the SQLite database.</p>
          </div>
        </Card>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
          >
            <RotatingGlowBorder className="h-full cursor-pointer">
              <div className="p-5 h-full bg-white group relative">
                <div className="space-y-4">
                  {/* Top Row - Icon and Date */}
                  <div className="flex items-start justify-between">
                    <motion.div
                      className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-gray-900 group-hover:text-white transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <MessageSquare size={18} />
                    </motion.div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Clock size={12} />
                      {session.date}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="min-h-[60px]">
                    <h4 className="font-bold text-gray-900 group-hover:text-gray-900 transition-colors line-clamp-2 text-base leading-tight">
                      {session.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={cn(
                          "border-none text-[10px] px-2 py-0.5 font-bold",
                          modelColors[session.model] || 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {session.model}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Activity size={12} className="text-gray-400" />
                      <span className="font-mono font-bold">{(session.total_tokens || 0).toLocaleString()}</span>
                      <span className="text-gray-400">tokens</span>
                    </div>
                  </div>

                  {/* Bottom Row - Cost and Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Coins size={12} className="text-green-500" />
                      <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">${(session.cost || 0).toFixed(4)}</span>
                    </div>
                    <motion.div
                      className="flex items-center gap-1 text-gray-400 group-hover:text-gray-900 transition-colors"
                      whileHover={{ x: 3 }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">View</span>
                      <ArrowUpRight size={14} />
                    </motion.div>
                  </div>
                </div>

                {/* Hover gradient line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </RotatingGlowBorder>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


