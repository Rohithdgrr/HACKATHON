import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Columns, Send, RotateCcw, Info, Paperclip, Zap, Globe, Image as ImageIcon, Code, Play, Copy, ArrowRight, User, Bot, Activity, Gauge, DollarSign, Hash, Crown } from 'lucide-react';
import { Card, Button, Badge } from './UI';
import ModelSelector from './ModelSelector';
import { MODELS, ModelInfo, ModelStats } from '../types';
import { getChatResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface ChatTurn {
  query: string;
  responses: {
    modelA: { content: string; info: ModelInfo; stats: ModelStats };
    modelB: { content: string; info: ModelInfo; stats: ModelStats };
  };
  winner?: 'modelA' | 'modelB' | 'draw';
}

export default function SideBySideMode() {
  const [query, setQuery] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [modelA, setModelA] = useState<string>(MODELS[0].id);
  const [modelB, setModelB] = useState<string>(MODELS[1].id);
  const [history, setHistory] = useState<ChatTurn[]>([]);
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
  }, [history, isComparing]);

  const calculateWinner = (statsA: ModelStats, statsB: ModelStats): 'modelA' | 'modelB' | 'draw' => {
    // Scoring system (lower is better for latency and cost, higher is better for TPS)
    // We normalize them roughly
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
      const modelAInfo = MODELS.find(m => m.id === modelA)!;
      const modelBInfo = MODELS.find(m => m.id === modelB)!;

      // Initialize the turn with empty content
      const initialTurn: ChatTurn = {
        query: currentQuery,
        responses: {
          modelA: { content: "", info: modelAInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 } },
          modelB: { content: "", info: modelBInfo, stats: { latency: 0, tokensPerSecond: 0, costPer1k: 0, totalTokens: 0 } }
        }
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
    } finally {
      setIsComparing(false);
    }
  };

  const resetComparison = () => {
    setQuery('');
    setHistory([]);
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 md:p-6 lg:p-10 text-gray-900 font-sans relative overflow-hidden">
      {/* Top Model Selectors */}
      <div className="shrink-0 z-20 bg-white pb-4 mb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
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
            <Button variant="outline" onClick={resetComparison} className="shrink-0 h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-50 transition-colors">
              <RotateCcw size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* Chat History Area - Scrollable */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full space-y-12 pb-32 scrollbar-hide px-2"
      >
        {history.length === 0 && !isComparing && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
              <Columns size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">Side-by-Side Mode</h2>
              <p className="text-gray-500 max-w-md mx-auto font-medium">
                Compare two models simultaneously. Enter a prompt below to see how different architectures handle your request.
              </p>
            </div>
          </div>
        )}

        {history.map((turn, index) => (
          <div key={index} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Query */}
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-gray-100 px-6 py-3 rounded-2xl text-sm border border-gray-200 text-gray-900 font-medium shadow-sm">
                {turn.query}
              </div>
            </div>

            {/* Side-by-Side Responses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model A Response */}
              <Card className={cn(
                "flex flex-col bg-white border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative",
                turn.winner === 'modelA' && "ring-2 ring-amber-400 border-amber-200 shadow-amber-100 shadow-lg"
              )}>
                {turn.winner === 'modelA' && (
                  <div className="absolute top-0 right-0 p-2 z-10">
                    <div className="bg-amber-400 text-white p-1.5 rounded-bl-xl rounded-tr-xl shadow-sm flex items-center gap-1">
                      <Crown size={14} className="fill-white" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Winner</span>
                    </div>
                  </div>
                )}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="font-bold text-xs text-gray-900">{turn.responses.modelA.info.name}</span>
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100">{turn.responses.modelA.info.size}</Badge>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black">{turn.responses.modelA.info.provider}</span>
                </div>
                <div className="p-6 prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[100px]">
                  <ReactMarkdown>{turn.responses.modelA.content}</ReactMarkdown>
                </div>
                {/* Stats Footer */}
                <div className="mt-auto p-3 bg-gray-50/50 border-t border-gray-100 grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <Activity size={12} className="text-blue-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">{turn.responses.modelA.stats.latency.toFixed(2)}s</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Latency</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Gauge size={12} className="text-green-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">{turn.responses.modelA.stats.tokensPerSecond.toFixed(1)}</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">T/s</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Hash size={12} className="text-purple-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">{turn.responses.modelA.stats.totalTokens}</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Tokens</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <DollarSign size={12} className="text-amber-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">${(turn.responses.modelA.stats.costPer1k * turn.responses.modelA.stats.totalTokens / 1000).toFixed(4)}</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Cost</span>
                  </div>
                </div>
              </Card>

              {/* Model B Response */}
              <Card className={cn(
                "flex flex-col bg-white border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative",
                turn.winner === 'modelB' && "ring-2 ring-amber-400 border-amber-200 shadow-amber-100 shadow-lg"
              )}>
                {turn.winner === 'modelB' && (
                  <div className="absolute top-0 right-0 p-2 z-10">
                    <div className="bg-amber-400 text-white p-1.5 rounded-bl-xl rounded-tr-xl shadow-sm flex items-center gap-1">
                      <Crown size={14} className="fill-white" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Winner</span>
                    </div>
                  </div>
                )}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <span className="font-bold text-xs text-gray-900">{turn.responses.modelB.info.name}</span>
                    <Badge className="bg-purple-50 text-purple-600 border-purple-100">{turn.responses.modelB.info.size}</Badge>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black">{turn.responses.modelB.info.provider}</span>
                </div>
                <div className="p-6 prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[100px]">
                  <ReactMarkdown>{turn.responses.modelB.content}</ReactMarkdown>
                </div>
                {/* Stats Footer */}
                <div className="mt-auto p-3 bg-gray-50/50 border-t border-gray-100 grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <Activity size={12} className="text-blue-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">{turn.responses.modelB.stats.latency.toFixed(2)}s</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Latency</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Gauge size={12} className="text-green-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">{turn.responses.modelB.stats.tokensPerSecond.toFixed(1)}</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">T/s</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Hash size={12} className="text-purple-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">{turn.responses.modelB.stats.totalTokens}</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Tokens</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <DollarSign size={12} className="text-amber-500 mb-1" />
                    <span className="text-[9px] font-bold text-gray-900">${(turn.responses.modelB.stats.costPer1k * turn.responses.modelB.stats.totalTokens / 1000).toFixed(4)}</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Cost</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}

        {isComparing && (
          <div className="space-y-8 animate-pulse">
            <div className="flex justify-end">
              <div className="w-32 h-10 bg-gray-100 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100" />
              <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Input Area (ChatGPT Style) */}
      <div className="shrink-0 pt-4 pb-8 flex flex-col items-center bg-white">
        <div className="w-full max-w-4xl px-4">
          <div className="relative group">
            <div className="bg-white border border-gray-200 rounded-[24px] p-4 shadow-2xl shadow-black/5 focus-within:border-gray-300 focus-within:shadow-black/10 transition-all">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Compare models with a new prompt..."
                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none min-h-[60px] md:min-h-[100px] text-base md:text-lg font-medium leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCompare();
                  }
                }}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border border-gray-100">
                    <Paperclip size={14} />
                    Add files
                  </button>
                  <div className="w-px h-6 bg-gray-100 mx-1" />
                  <div className="flex items-center gap-1">
                    <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors shrink-0">
                      <Zap size={18} />
                    </button>
                    <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors shrink-0">
                      <Globe size={18} />
                    </button>
                    <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors shrink-0">
                      <ImageIcon size={18} />
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCompare()}
                  disabled={!query.trim() || isComparing}
                  className="w-12 h-12 bg-gray-900 hover:bg-black disabled:opacity-30 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-black/20 active:scale-95"
                >
                  {isComparing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 text-center font-medium mt-4">
            Side-by-side comparison uses real-time API calls. Responses may vary by model architecture.
          </p>
        </div>
      </div>
    </div>
  );
}
