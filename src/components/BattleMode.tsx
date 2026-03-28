import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Send, Activity, Gauge, Hash, DollarSign, Trophy, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { Card, Button, Badge } from './UI';
import { MODELS, ModelInfo, ModelStats } from '../types';
import { getChatResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
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

export default function BattleMode() {
  const [query, setQuery] = useState('');
  const [isBattling, setIsBattling] = useState(false);
  const [history, setHistory] = useState<BattleTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isBattling]);

  const handleBattle = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isBattling) return;

    const currentQuery = query;
    setQuery('');
    setIsBattling(true);
    
    try {
      const shuffled = [...MODELS].sort(() => 0.5 - Math.random());
      const modelAInfo = shuffled[0];
      const modelBInfo = shuffled[1];

      // Initialize the turn with empty content
      const initialTurn: BattleTurn = {
        query: currentQuery,
        responses: {
          modelA: { content: "", info: modelAInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 }, revealed: false },
          modelB: { content: "", info: modelBInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 }, revealed: false }
        },
        voted: false
      };

      setHistory(prev => [...prev, initialTurn]);

      const [respA, respB] = await Promise.all([
        getChatResponse(currentQuery, modelAInfo.name, (chunk) => {
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
        }),
        getChatResponse(currentQuery, modelBInfo.name, (chunk) => {
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
        })
      ]);

      setHistory(prev => {
        const newHistory = [...prev];
        const lastTurn = { ...newHistory[newHistory.length - 1] };
        lastTurn.responses = {
          modelA: { ...lastTurn.responses.modelA, content: respA.content, stats: respA.stats },
          modelB: { ...lastTurn.responses.modelB, content: respB.content, stats: respB.stats }
        };
        newHistory[newHistory.length - 1] = lastTurn;
        return newHistory;
      });
    } catch (error) {
      console.error('Battle error:', error);
    } finally {
      setIsBattling(false);
    }
  };

  const handleVote = (turnIndex: number, winner: 'A' | 'B' | 'tie' | 'both_bad') => {
    const turn = history[turnIndex];
    const modelAId = turn.responses.modelA.info.id;
    const modelBId = turn.responses.modelB.info.id;

    if (winner === 'A') {
      recordVote(modelAId, modelBId);
    } else if (winner === 'B') {
      recordVote(modelBId, modelAId);
    } else {
      recordVote(null, null); // Tie or both bad
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

  return (
    <div className="h-full flex flex-col bg-white p-2 md:p-3 text-gray-900 font-sans relative overflow-hidden">
      {/* Chat History Area - Scrollable */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full space-y-6 pb-24 scrollbar-hide px-1"
      >
        {history.length === 0 && !isBattling && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center tracking-tight px-2"
            >
              What would you like to do?
            </motion.h2>
          </div>
        )}

        {history.map((turn, index) => (
          <div key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Query Bubble */}
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-gray-100 px-6 py-3 rounded-2xl text-sm border border-gray-200 text-gray-900 font-medium shadow-sm">
                {turn.query}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Model A */}
              <Card className={cn(
                "flex flex-col bg-white border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative",
                turn.voted && turn.winner === 'A' && "ring-2 ring-green-500 border-green-200 shadow-green-100/50"
              )}>
                {turn.voted && turn.winner === 'A' && (
                  <div className="absolute top-1 right-1 z-10">
                    <Trophy size={16} className="text-green-500 fill-green-500" />
                  </div>
                )}
                <div className="p-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                    <span className="font-bold text-[9px] uppercase tracking-wider text-gray-500">
                      {turn.responses.modelA.revealed ? turn.responses.modelA.info.name : 'Assistant A'}
                    </span>
                    {turn.responses.modelA.revealed && (
                      <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[9px] px-1.5 py-0">{turn.responses.modelA.info.size}</Badge>
                    )}
                  </div>
                  {turn.responses.modelA.revealed && (
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">{turn.responses.modelA.info.provider}</span>
                  )}
                </div>
                <div className="p-3 prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[60px]">
                  <ReactMarkdown>{turn.responses.modelA.content}</ReactMarkdown>
                </div>
                {/* Stats Footer (Only when revealed) */}
                {turn.responses.modelA.revealed && (
                  <div className="mt-auto p-2 bg-gray-50/50 border-t border-gray-100 grid grid-cols-4 gap-1">
                    <div className="flex flex-col items-center">
                      <Activity size={10} className="text-blue-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">{turn.responses.modelA.stats.latency.toFixed(2)}s</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">Latency</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Gauge size={10} className="text-green-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">{turn.responses.modelA.stats.tokensPerSecond.toFixed(1)}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">T/s</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Hash size={10} className="text-purple-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">{turn.responses.modelA.stats.totalTokens}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">Tokens</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <DollarSign size={10} className="text-amber-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">${(turn.responses.modelA.stats.costPer1k * turn.responses.modelA.stats.totalTokens / 1000).toFixed(4)}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">Cost</span>
                    </div>
                  </div>
                )}
              </Card>

              {/* Model B */}
              <Card className={cn(
                "flex flex-col bg-white border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative",
                turn.voted && turn.winner === 'B' && "ring-2 ring-green-500 border-green-200 shadow-green-100/50"
              )}>
                {turn.voted && turn.winner === 'B' && (
                  <div className="absolute top-1 right-1 z-10">
                    <Trophy size={12} className="text-green-500 fill-green-500" />
                  </div>
                )}
                <div className="p-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                    <span className="font-bold text-[9px] uppercase tracking-wider text-gray-500">
                      {turn.responses.modelB.revealed ? turn.responses.modelB.info.name : 'Assistant B'}
                    </span>
                    {turn.responses.modelB.revealed && (
                      <Badge className="bg-purple-50 text-purple-600 border-purple-100 text-[9px] px-1.5 py-0">{turn.responses.modelB.info.size}</Badge>
                    )}
                  </div>
                  {turn.responses.modelB.revealed && (
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">{turn.responses.modelB.info.provider}</span>
                  )}
                </div>
                <div className="p-3 prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[60px]">
                  <ReactMarkdown>{turn.responses.modelB.content}</ReactMarkdown>
                </div>
                {turn.responses.modelB.revealed && (
                  <div className="mt-auto p-2 bg-gray-50/50 border-t border-gray-100 grid grid-cols-4 gap-1">
                    <div className="flex flex-col items-center">
                      <Activity size={10} className="text-blue-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">{turn.responses.modelB.stats.latency.toFixed(2)}s</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">Latency</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Gauge size={10} className="text-green-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">{turn.responses.modelB.stats.tokensPerSecond.toFixed(1)}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">T/s</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Hash size={10} className="text-purple-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">{turn.responses.modelB.stats.totalTokens}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">Tokens</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <DollarSign size={10} className="text-amber-500 mb-0.5" />
                      <span className="text-[8px] font-bold text-gray-900">${(turn.responses.modelB.stats.costPer1k * turn.responses.modelB.stats.totalTokens / 1000).toFixed(4)}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-bold">Cost</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Voting Buttons (Only for the latest turn if not voted) */}
            {index === history.length - 1 && !turn.voted && (
              <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-lg shadow-black/5 animate-in zoom-in duration-300">
                <button 
                  onClick={() => handleVote(index, 'A')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-1.5 text-gray-900 shadow-sm active:scale-95 group"
                >
                  <CheckCircle2 size={14} className="text-gray-400 group-hover:text-green-500" />
                  Model A
                </button>
                <button 
                  onClick={() => handleVote(index, 'tie')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5 text-gray-900 shadow-sm active:scale-95 group"
                >
                  <MinusCircle size={14} className="text-gray-400 group-hover:text-blue-500" />
                  Tie
                </button>
                <button 
                  onClick={() => handleVote(index, 'both_bad')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 text-gray-900 shadow-sm active:scale-95 group"
                >
                  <XCircle size={14} className="text-gray-400 group-hover:text-red-500" />
                  Both bad
                </button>
                <button 
                  onClick={() => handleVote(index, 'B')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-1.5 text-gray-900 shadow-sm active:scale-95 group"
                >
                  Model B
                  <CheckCircle2 size={14} className="text-gray-400 group-hover:text-green-500" />
                </button>
              </div>
            )}

            {turn.voted && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-2"
              >
                <div className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
                  <Trophy size={12} className="text-amber-400" />
                  Leaderboard Updated
                </div>
              </motion.div>
            )}
          </div>
        ))}

        {isBattling && (
          <div className="space-y-4 animate-pulse">
            <div className="flex justify-end">
              <div className="w-24 h-8 bg-gray-100 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="h-48 bg-gray-50 rounded-xl border border-gray-100" />
              <div className="h-48 bg-gray-50 rounded-xl border border-gray-100" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Area */}
      <div className="shrink-0 pt-2 pb-10 flex flex-col items-center bg-white">
        <div className="w-full max-w-4xl px-2">
          <div className="relative">
            {/* Multi-layer animated glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-orange-400 rounded-2xl opacity-0 focus-within:opacity-100 transition-all duration-500 blur-[4px] animate-pulse" />
            <div className="absolute -inset-[3px] bg-gradient-to-r from-yellow-400 via-red-500 via-purple-600 via-blue-600 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-70 transition-all duration-700 blur-[8px] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute -inset-[4px] bg-gradient-to-br from-pink-400 via-purple-500 via-blue-500 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-50 transition-all duration-1000 blur-[12px] animate-pulse" style={{ animationDelay: '0.4s' }} />
            
            <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl shadow-black/10 focus-within:border-transparent focus-within:shadow-none transition-all">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={history.length > 0 ? "Ask followup..." : "Ask anything..."}
                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none min-h-[100px] text-base font-medium leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleBattle();
                  }
                }}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 transition-all shrink-0 hover:shadow-md">
                    <Zap size={20} />
                  </button>
                </div>
                
                <button 
                  onClick={() => handleBattle()}
                  disabled={!query.trim() || isBattling}
                  className="w-11 h-11 bg-gradient-to-r from-gray-900 to-black hover:from-purple-600 hover:to-pink-600 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all shadow-xl shadow-black/20 hover:shadow-purple-500/30 active:scale-95"
                >
                  {isBattling ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-gray-400 text-center font-medium mt-2">
            AI responses may be inaccurate.
          </p>
        </div>
      </div>
    </div>
  );
}
