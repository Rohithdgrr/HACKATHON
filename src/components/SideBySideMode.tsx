import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Columns, Send, RotateCcw, Zap, Crown, Activity, Gauge, DollarSign, Hash, Sparkles, ArrowRight, Loader2, MessageSquare } from 'lucide-react';
import { Card, Button, Badge } from './UI';
import ModelSelector from './ModelSelector';
import { MODELS, ModelInfo, ModelStats } from '../types';
import { getChatResponseFromBackend } from '../services/routerApi';
import MarkdownRenderer from './MarkdownRenderer';
import { cn } from '../lib/utils';

interface ChatTurn {
  query: string;
  responses: {
    modelA: { content: string; info: ModelInfo; stats: ModelStats };
    modelB: { content: string; info: ModelInfo; stats: ModelStats };
  };
  winner?: 'modelA' | 'modelB' | 'draw';
}

// Streaming dot animation component
const StreamingIndicator = () => (
  <div className="flex items-center gap-1 px-2 py-1">
    <div className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-500"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
    <span className="text-[10px] text-gray-400 font-medium ml-1">generating...</span>
  </div>
);

// Stat item component for cleaner code
const StatItem = ({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) => (
  <div className="flex flex-col items-center gap-0.5">
    <Icon size={11} className={color} />
    <span className="text-[9px] font-bold text-gray-900">{value}</span>
    <span className="text-[7px] text-gray-400 uppercase font-bold tracking-wide">{label}</span>
  </div>
);

export default function SideBySideMode() {
  const [query, setQuery] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [modelA, setModelA] = useState<string>(MODELS[0].id);
  const [modelB, setModelB] = useState<string>(MODELS[1].id);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollTimerRef.current) cancelAnimationFrame(scrollTimerRef.current);
    scrollTimerRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Auto-scroll while streaming content
  useEffect(() => {
    if (isComparing || history.length > 0) {
      const lastTurn = history[history.length - 1];
      if (lastTurn) {
        scrollToBottom();
      }
    }
  }, [history, isComparing]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [query]);

  const calculateWinner = (statsA: ModelStats, statsB: ModelStats): 'modelA' | 'modelB' | 'draw' => {
    const scoreA = (statsA.latency * 0.5) + (100 / statsA.tokensPerSecond * 0.3) + (statsA.costPer1k * 0.2);
    const scoreB = (statsB.latency * 0.5) + (100 / statsB.tokensPerSecond * 0.3) + (statsB.costPer1k * 0.2);

    if (Math.abs(scoreA - scoreB) < 0.05) return 'draw';
    return scoreA < scoreB ? 'modelA' : 'modelB';
  };

  const handleCompare = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isComparing) return;

    const currentQuery = query;
    setQuery('');
    setIsComparing(true);

    try {
      const modelAInfo = MODELS.find(m => m.id === modelA) || { id: modelA, name: modelA, size: '?', provider: 'Unknown' };
      const modelBInfo = MODELS.find(m => m.id === modelB) || { id: modelB, name: modelB, size: '?', provider: 'Unknown' };

      const initialTurn: ChatTurn = {
        query: currentQuery,
        responses: {
          modelA: { content: "", info: modelAInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 } },
          modelB: { content: "", info: modelBInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 } }
        }
      };

      setHistory(prev => [...prev, initialTurn]);

      const sessionId = `compare_${Date.now()}`;
      
      const [respA, respB] = await Promise.all([
        getChatResponseFromBackend(currentQuery, modelAInfo.id, (chunk) => {
          setHistory(prev => {
            const newHistory = [...prev];
            const lastTurn = { ...newHistory[newHistory.length - 1] };
            lastTurn.responses = {
              ...lastTurn.responses,
              modelA: { ...lastTurn.responses.modelA, content: lastTurn.responses.modelA.content + chunk }
            };
            newHistory[newHistory.length - 1] = lastTurn;
            return newHistory;
          });
        }, `${sessionId}_A`),
        getChatResponseFromBackend(currentQuery, modelBInfo.id, (chunk) => {
          setHistory(prev => {
            const newHistory = [...prev];
            const lastTurn = { ...newHistory[newHistory.length - 1] };
            lastTurn.responses = {
              ...lastTurn.responses,
              modelB: { ...lastTurn.responses.modelB, content: lastTurn.responses.modelB.content + chunk }
            };
            newHistory[newHistory.length - 1] = lastTurn;
            return newHistory;
          });
        }, `${sessionId}_B`)
      ]);

      const winner = calculateWinner(respA.stats, respB.stats);

      setHistory(prev => {
        const newHistory = [...prev];
        const lastTurn = { ...newHistory[newHistory.length - 1] };
        lastTurn.responses = {
          modelA: { ...lastTurn.responses.modelA, content: respA.content, stats: respA.stats },
          modelB: { ...lastTurn.responses.modelB, content: respB.content, stats: respB.stats }
        };
        lastTurn.winner = winner;
        newHistory[newHistory.length - 1] = lastTurn;
        return newHistory;
      });
    } catch (error) {
      console.error('Comparison error:', error);
      // Show error in UI
      setHistory(prev => {
        if (prev.length > 0) {
          const newHistory = [...prev];
          const lastTurn = { ...newHistory[newHistory.length - 1] };
          lastTurn.responses.modelA.content = lastTurn.responses.modelA.content || 'Error: Could not connect to the backend server. Please ensure it is running on port 8000.';
          lastTurn.responses.modelB.content = lastTurn.responses.modelB.content || 'Error: Could not connect to the backend server.';
          newHistory[newHistory.length - 1] = lastTurn;
          return newHistory;
        }
        return prev;
      });
    } finally {
      setIsComparing(false);
    }
  };

  const resetComparison = () => {
    setQuery('');
    setHistory([]);
  };

  const renderResponseCard = (
    response: { content: string; info: ModelInfo; stats: ModelStats },
    side: 'A' | 'B',
    isWinner: boolean,
    isStreaming: boolean
  ) => {
    const accentColor = side === 'A' ? 'blue' : 'purple';
    const dotColor = side === 'A' ? 'bg-blue-500' : 'bg-purple-500';
    const badgeBg = side === 'A' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100';

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: side === 'A' ? 0 : 0.1 }}
      >
        <Card className={cn(
          "flex flex-col bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group",
          isWinner && "ring-2 ring-amber-400 border-amber-200 shadow-amber-100/50 shadow-lg"
        )}>
          {/* Winner badge with animation */}
          <AnimatePresence>
            {isWinner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="absolute top-0 right-0 z-10"
              >
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2.5 py-1 rounded-bl-xl flex items-center gap-1 shadow-md">
                  <Crown size={12} className="fill-white drop-shadow-sm" />
                  <span className="text-[9px] font-black uppercase tracking-tight">Winner</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card header */}
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full shadow-sm", dotColor)} />
              <span className="font-bold text-[11px] text-gray-900">{response.info.name}</span>
              <Badge className={cn("text-[9px] px-1.5 py-0", badgeBg)}>{response.info.size}</Badge>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">{response.info.provider}</span>
          </div>

          {/* Response content */}
          <div className="flex-1 min-h-[60px]">
            {response.content ? (
              <MarkdownRenderer
                content={response.content}
                className="p-3 text-[13px] text-gray-700 leading-relaxed"
              />
            ) : isStreaming ? (
              <div className="p-3">
                <StreamingIndicator />
              </div>
            ) : (
              <div className="p-3 text-gray-400 text-sm italic">Waiting for response...</div>
            )}
          </div>

          {/* Stats footer - only show when we have real stats */}
          {response.stats.latency > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-auto border-t border-gray-100"
            >
              <div className="p-2 bg-gradient-to-r from-gray-50/80 to-gray-50/30 grid grid-cols-4 gap-1">
                <StatItem icon={Activity} value={`${response.stats.latency.toFixed(2)}s`} label="Latency" color="text-blue-500" />
                <StatItem icon={Gauge} value={response.stats.tokensPerSecond.toFixed(1)} label="T/s" color="text-green-500" />
                <StatItem icon={Hash} value={String(response.stats.totalTokens)} label="Tokens" color="text-purple-500" />
                <StatItem icon={DollarSign} value={`$${(response.stats.costPer1k * response.stats.totalTokens / 1000).toFixed(4)}`} label="Cost" color="text-amber-500" />
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white p-1 text-gray-900 font-sans relative overflow-hidden">
      {/* Top Model Selectors */}
      <div className="shrink-0 z-20 bg-white pb-1 mb-1">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 w-full">
            <ModelSelector label="Model A" value={modelA} onChange={setModelA} />
          </div>
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 font-bold text-[10px] border border-gray-100">
            VS
          </div>
          <div className="flex-1 w-full">
            <ModelSelector label="Model B" value={modelB} onChange={setModelB} />
          </div>
          {history.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <Button variant="outline" onClick={resetComparison} className="shrink-0 h-9 px-3 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95">
                <RotateCcw size={14} />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Chat History Area - Scrollable */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full space-y-4 pb-2 scrollbar-hide px-1"
      >
        {history.length === 0 && !isComparing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center py-10"
          >
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner mb-3 border border-blue-100/50"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Columns size={28} />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Side-by-Side Mode</h2>
            <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium">
              Compare two models head-to-head in real time.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400">
              <Sparkles size={14} className="text-purple-400" />
              <span>Select models above <ArrowRight size={10} className="inline" /> type your prompt below</span>
            </div>
          </motion.div>
        )}

        {history.map((turn, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {/* User Query */}
            <div className="flex justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-[80%] flex items-start gap-2"
              >
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-tr-md text-sm border border-gray-200 text-gray-900 font-medium shadow-sm">
                  {turn.query}
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare size={12} className="text-white" />
                </div>
              </motion.div>
            </div>

            {/* Side-by-Side Responses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {renderResponseCard(
                turn.responses.modelA,
                'A',
                turn.winner === 'modelA',
                isComparing && index === history.length - 1
              )}
              {renderResponseCard(
                turn.responses.modelB,
                'B',
                turn.winner === 'modelB',
                isComparing && index === history.length - 1
              )}
            </div>

            {/* Draw indicator */}
            {turn.winner === 'draw' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wide border border-gray-200">
                  ⚖️ Draw — Models performed equally
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom Floating Input Area */}
      <div className="shrink-0 pt-1 pb-2 bg-white">
        <div className="px-2">
          <div className="relative max-w-4xl mx-auto">
            {/* Multi-layer animated glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-orange-400 rounded-2xl opacity-0 focus-within:opacity-100 transition-all duration-500 blur-[4px] animate-pulse" />
            <div className="absolute -inset-[3px] bg-gradient-to-r from-yellow-400 via-red-500 via-purple-600 via-blue-600 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-60 transition-all duration-700 blur-[8px] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute -inset-[4px] bg-gradient-to-br from-pink-400 via-purple-500 via-blue-500 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-40 transition-all duration-1000 blur-[12px] animate-pulse" style={{ animationDelay: '0.4s' }} />
            
            <div className="relative bg-white border border-gray-200 rounded-2xl p-3 shadow-lg shadow-black/5 focus-within:border-transparent focus-within:shadow-none transition-all">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Compare models with a new prompt..."
                rows={1}
                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none min-h-[24px] max-h-[120px] text-sm font-medium leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCompare();
                  }
                }}
              />
              
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-purple-600 transition-all shrink-0 active:scale-90">
                    <Zap size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all shrink-0 active:scale-90">
                    <Sparkles size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => handleCompare()}
                  disabled={!query.trim() || isComparing}
                  className="w-9 h-9 bg-gradient-to-r from-gray-900 to-black hover:from-purple-600 hover:to-pink-600 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-black/15 hover:shadow-purple-500/30 active:scale-90"
                >
                  {isComparing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={14} className="-ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-gray-400 text-center font-medium mt-1.5">
            Side-by-side comparison uses real-time API calls.
          </p>
        </div>
      </div>
    </div>
  );
}
