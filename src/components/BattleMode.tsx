import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Send, Activity, Gauge, Hash, DollarSign, Trophy, CheckCircle2, XCircle, MinusCircle, Sparkles, Loader2, MessageSquare, Swords } from 'lucide-react';
import { Card, Button, Badge } from './UI';
import { MODELS, ModelInfo, ModelStats } from '../types';
import { getChatResponseFromBackend, routerAPI } from '../services/routerApi';
import MarkdownRenderer from './MarkdownRenderer';
import { cn } from '../lib/utils';

import { recordVote } from '../services/leaderboardService';

interface BattleTurn {
  query: string;
  responses: {
    modelA: { content: string; info: ModelInfo; stats: ModelStats; revealed: boolean };
    modelB: { content: string; info: ModelInfo; stats: ModelStats; revealed: boolean };
  };
  voted: boolean;
  winner?: 'A' | 'B' | 'tie' | 'both_bad';
}

// Streaming dot animation component
const StreamingIndicator = () => (
  <div className="flex items-center gap-1 px-2 py-1">
    <div className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gray-500"
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

export default function BattleMode() {
  const [query, setQuery] = useState('');
  const [isBattling, setIsBattling] = useState(false);
  const [history, setHistory] = useState<BattleTurn[]>([]);
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
    if (isBattling || history.length > 0) {
      const lastTurn = history[history.length - 1];
      if (lastTurn) {
        scrollToBottom();
      }
    }
  }, [history, isBattling]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [query]);

  const handleBattle = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isBattling) return;

    const currentQuery = query;
    setQuery('');
    setIsBattling(true);
    
    const sessionId = `battle_${Date.now()}`;
    
    try {
      // Get available models, with fallback to hardcoded list
      let availableModels: string[] = [];
      try {
        const modelsResponse = await routerAPI.getModels();
        availableModels = modelsResponse.data.map(m => m.id);
      } catch {
        availableModels = MODELS.map(m => m.id);
      }

      // Pick two DIFFERENT random models for blind battle
      const shuffled = [...availableModels].sort(() => Math.random() - 0.5);
      const modelAId = shuffled[0] || MODELS[0].id;
      const modelBId = shuffled.length > 1 ? shuffled[1] : (MODELS[1]?.id || MODELS[0].id);
      
      const modelAInfo = MODELS.find(m => m.id === modelAId) || { id: modelAId, name: modelAId, size: '?', provider: 'Unknown' };
      const modelBInfo = MODELS.find(m => m.id === modelBId) || { id: modelBId, name: modelBId, size: '?', provider: 'Unknown' };

      const initialTurn: BattleTurn = {
        query: currentQuery,
        responses: {
          modelA: { content: "", info: modelAInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 }, revealed: false },
          modelB: { content: "", info: modelBInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 }, revealed: false }
        },
        voted: false
      };

      setHistory(prev => [...prev, initialTurn]);

      // Run both requests independently (not Promise.all) so one failure doesn't block the other
      console.log(`[Battle] Starting requests - Model A: ${modelAInfo.id}, Model B: ${modelBInfo.id}`);
      
      const requestA = getChatResponseFromBackend(currentQuery, modelAInfo.id, (chunk) => {
        console.log(`[Battle] Model A chunk:`, chunk?.substring(0, 50));
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
      }, `${sessionId}_A`).then(resp => {
        console.log(`[Battle] Model A complete:`, resp.content?.substring(0, 50));
        setHistory(prev => {
          const newHistory = [...prev];
          const lastTurn = { ...newHistory[newHistory.length - 1] };
          lastTurn.responses.modelA = { ...lastTurn.responses.modelA, content: resp.content, stats: resp.stats };
          newHistory[newHistory.length - 1] = lastTurn;
          return newHistory;
        });
      }).catch(err => {
        console.error('[Battle] Model A error:', err);
        setHistory(prev => {
          const newHistory = [...prev];
          const lastTurn = { ...newHistory[newHistory.length - 1] };
          lastTurn.responses.modelA.content = lastTurn.responses.modelA.content || `Error: ${err.message || 'Failed to get response from Model A'}`;
          newHistory[newHistory.length - 1] = lastTurn;
          return newHistory;
        });
      });

      const requestB = getChatResponseFromBackend(currentQuery, modelBInfo.id, (chunk) => {
        console.log(`[Battle] Model B chunk:`, chunk?.substring(0, 50));
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
      }, `${sessionId}_B`).then(resp => {
        console.log(`[Battle] Model B complete:`, resp.content?.substring(0, 50));
        setHistory(prev => {
          const newHistory = [...prev];
          const lastTurn = { ...newHistory[newHistory.length - 1] };
          lastTurn.responses.modelB = { ...lastTurn.responses.modelB, content: resp.content, stats: resp.stats };
          newHistory[newHistory.length - 1] = lastTurn;
          return newHistory;
        });
      }).catch(err => {
        console.error('[Battle] Model B error:', err);
        setHistory(prev => {
          const newHistory = [...prev];
          const lastTurn = { ...newHistory[newHistory.length - 1] };
          lastTurn.responses.modelB.content = lastTurn.responses.modelB.content || `Error: ${err.message || 'Failed to get response from Model B'}`;
          newHistory[newHistory.length - 1] = lastTurn;
          return newHistory;
        });
      });

      // Wait for both to complete (or fail) before ending battle state
      await Promise.allSettled([requestA, requestB]);
      console.log('[Battle] Both requests settled');

    } catch (error) {
      console.error('Battle error:', error);
    } finally {
      setIsBattling(false);
    }
  };

  const handleVote = async (turnIndex: number, winner: 'A' | 'B' | 'tie' | 'both_bad') => {
    const turn = history[turnIndex];
    const modelAId = turn.responses.modelA.info.id;
    const modelBId = turn.responses.modelB.info.id;

    // Update leaderboard scores via recordVote
    try {
      if (winner === 'A') {
        await recordVote(modelAId, modelBId);
        await routerAPI.submitFeedback({
          query: turn.query,
          selected_model: modelAId,
          user_rating: 5,
          user_comment: `Won battle against ${modelBId}`
        }).catch(() => {});
      } else if (winner === 'B') {
        await recordVote(modelBId, modelAId);
        await routerAPI.submitFeedback({
          query: turn.query,
          selected_model: modelBId,
          user_rating: 5,
          user_comment: `Won battle against ${modelAId}`
        }).catch(() => {});
      } else if (winner === 'tie') {
        await recordVote(null, null);
      } else {
        // both_bad — no score changes but still record
        await routerAPI.submitFeedback({
          query: turn.query,
          selected_model: modelAId,
          user_rating: 1,
          user_comment: 'Both models rated poorly in battle'
        }).catch(() => {});
      }
    } catch (error) {
      console.error('Failed to submit vote feedback:', error);
    }

    setHistory(prev => {
      const newHistory = [...prev];
      newHistory[turnIndex] = {
        ...newHistory[turnIndex],
        voted: true,
        winner,
        responses: {
          modelA: { ...newHistory[turnIndex].responses.modelA, revealed: true },
          modelB: { ...newHistory[turnIndex].responses.modelB, revealed: true }
        }
      };
      return newHistory;
    });
  };

  const resetBattle = () => {
    setQuery('');
    setHistory([]);
  };

  const renderBattleCard = (
    response: { content: string; info: ModelInfo; stats: ModelStats; revealed: boolean },
    side: 'A' | 'B',
    isWinner: boolean,
    isStreaming: boolean
  ) => {
    const dotColor = side === 'A' ? 'bg-blue-500' : 'bg-purple-500';
    const badgeBg = side === 'A' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100';

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: side === 'A' ? 0 : 0.1 }}
      >
        <Card className={cn(
          "flex flex-col bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative",
          isWinner && "ring-2 ring-green-500 border-green-200 shadow-green-100/50"
        )}>
          {/* Winner trophy badge */}
          <AnimatePresence>
            {isWinner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-0 right-0 z-10"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-bl-xl flex items-center gap-1 shadow-md">
                  <Trophy size={12} className="fill-white drop-shadow-sm" />
                  <span className="text-[9px] font-black uppercase tracking-tight">Winner</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card header */}
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full shadow-sm", dotColor)} />
              <span className="font-bold text-[10px] uppercase tracking-wider text-gray-500">
                {response.revealed ? response.info.name : `Assistant ${side}`}
              </span>
              {response.revealed && (
                <Badge className={cn("text-[9px] px-1.5 py-0", badgeBg)}>{response.info.size}</Badge>
              )}
            </div>
            {response.revealed && (
              <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">{response.info.provider}</span>
            )}
          </div>

          {/* Response content */}
          <div className="flex-1 min-h-[60px]">
            {isStreaming ? (
              response.content ? (
                <MarkdownRenderer
                  content={response.content}
                  className="p-3 text-[13px] text-gray-700 leading-relaxed"
                />
              ) : (
                <div className="p-3">
                  <StreamingIndicator />
                </div>
              )
            ) : response.content ? (
              <MarkdownRenderer
                content={response.content}
                className="p-3 text-[13px] text-gray-700 leading-relaxed"
              />
            ) : (
              <div className="p-3 text-gray-400 text-sm italic">Waiting for response...</div>
            )}
          </div>

          {/* Stats Footer (only when revealed) */}
          {response.revealed && response.stats.latency > 0 && (
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
      {/* Chat History Area - Scrollable */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full space-y-4 pb-2 scrollbar-hide px-1"
      >
        {history.length === 0 && !isBattling && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center py-10"
          >
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-red-50 to-orange-50 text-red-500 rounded-2xl flex items-center justify-center shadow-inner mb-3 border border-red-100/50"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Swords size={28} />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              What would you like to battle?
            </h2>
            <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium mt-1">
              Two anonymous models compete. You pick the winner.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400">
              <Sparkles size={14} className="text-orange-400" />
              <span>Models are hidden until you vote</span>
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
            {/* User Query Bubble */}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {renderBattleCard(
                turn.responses.modelA,
                'A',
                turn.voted && turn.winner === 'A',
                isBattling && index === history.length - 1
              )}
              {renderBattleCard(
                turn.responses.modelB,
                'B',
                turn.voted && turn.winner === 'B',
                isBattling && index === history.length - 1
              )}
            </div>

            {/* Voting Buttons */}
            {index === history.length - 1 && !turn.voted && !isBattling && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center justify-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-lg shadow-black/5 max-w-2xl mx-auto"
              >
                <button 
                  onClick={() => handleVote(index, 'A')}
                  className="flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 hover:text-blue-700 active:scale-95 group"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <CheckCircle2 size={12} className="text-blue-500" />
                  </div>
                  <span>Model A</span>
                </button>
                
                <button 
                  onClick={() => handleVote(index, 'tie')}
                  className="flex-1 min-w-[80px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 hover:text-purple-700 active:scale-95 group"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <MinusCircle size={12} className="text-purple-500" />
                  </div>
                  <span>Tie</span>
                </button>
                
                <button 
                  onClick={() => handleVote(index, 'both_bad')}
                  className="flex-1 min-w-[90px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:shadow-md hover:shadow-red-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 hover:text-red-700 active:scale-95 group"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <XCircle size={12} className="text-red-500" />
                  </div>
                  <span>Both bad</span>
                </button>
                
                <button 
                  onClick={() => handleVote(index, 'B')}
                  className="flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-green-500 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-md hover:shadow-green-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 hover:text-green-700 active:scale-95 group"
                >
                  <span>Model B</span>
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <CheckCircle2 size={12} className="text-green-500" />
                  </div>
                </button>
              </motion.div>
            )}

            {turn.voted && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-1"
              >
                <div className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
                  <Trophy size={12} className="text-amber-400" />
                  Leaderboard Updated
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
            <div className="absolute -inset-[3px] bg-gradient-to-r from-yellow-400 via-red-500 via-purple-600 via-blue-600 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-70 transition-all duration-700 blur-[8px] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute -inset-[4px] bg-gradient-to-br from-pink-400 via-purple-500 via-blue-500 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-50 transition-all duration-1000 blur-[12px] animate-pulse" style={{ animationDelay: '0.4s' }} />
            
            <div className="relative bg-white border border-gray-200 rounded-2xl p-3 shadow-lg shadow-black/5 focus-within:border-transparent focus-within:shadow-none transition-all">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={history.length > 0 ? "Ask followup..." : "Ask anything..."}
                rows={1}
                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none min-h-[24px] max-h-[120px] text-sm font-medium leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleBattle();
                  }
                }}
              />
              
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-purple-600 transition-all shrink-0 active:scale-90">
                    <Zap size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-orange-600 transition-all shrink-0 active:scale-90">
                    <Sparkles size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => handleBattle()}
                  disabled={!query.trim() || isBattling}
                  className="w-9 h-9 bg-gradient-to-r from-gray-900 to-black hover:from-purple-600 hover:to-pink-600 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-black/15 hover:shadow-purple-500/30 active:scale-90"
                >
                  {isBattling ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={14} className="-ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-gray-400 text-center font-medium mt-1.5">
            AI responses may be inaccurate.
          </p>
        </div>
      </div>
    </div>
  );
}
