import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Zap, Shield, ChevronRight, Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Badge } from './UI';
import { Message, AVAILABLE_ROUTERS, RoutingResult } from '../types';
import { routeQuery, getChatResponse } from '../services/geminiService';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import LandingPage from './LandingPage';
import Sidebar, { DashboardView } from './Sidebar';
import BattleMode from './BattleMode';
import SideBySideMode from './SideBySideMode';
import Leaderboard from './Leaderboard';
import Stats from './Stats';
import ChatHistory from './ChatHistory';
import Settings from './Settings';

export default function HRouterApp() {
  const [activeDashboardView, setActiveDashboardView] = useState<DashboardView>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am HRouter. I can help you route your queries to the most efficient LLM models. Try sending a message or routing a specific query.',
      model: 'HRouter System',
      timestamp: Date.now(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, activeDashboardView]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: Date.now(),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const route = await routeQuery(chatInput, 'round_robin');
      
      const assistantMsgId = (Date.now() + 1).toString();
      const initialAssistantMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        model: route.modelName,
        timestamp: Date.now(),
      };
      
      setChatMessages(prev => [...prev, initialAssistantMsg]);

      const response = await getChatResponse(chatInput, route.modelName, (chunk) => {
        setChatMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId 
            ? { ...msg, content: msg.content + chunk }
            : msg
        ));
      });
      
      setChatMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, content: response.content }
          : msg
      ));
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsChatting(false);
    }
  };

  const renderDashboardContent = () => {
    switch (activeDashboardView) {
      case 'home':
        return <LandingPage onStart={() => setActiveDashboardView('battle')} />;
      case 'battle':
        return <BattleMode />;
      case 'side-by-side':
        return <SideBySideMode />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'stats':
        return <Stats />;
      case 'history':
        return <ChatHistory />;
      case 'settings':
        return <Settings />;
      default:
        return <BattleMode />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-white relative">
      {activeDashboardView !== 'home' && (
        <Sidebar 
          activeView={activeDashboardView} 
          onViewChange={(view) => {
            setActiveDashboardView(view);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col min-w-0 overflow-hidden relative"
      >
        {/* Floating Mobile Menu Button */}
        {activeDashboardView !== 'home' && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "fixed top-4 left-4 z-40 p-3 bg-white border border-gray-100 rounded-2xl shadow-xl lg:hidden transition-all hover:bg-gray-50 active:scale-95",
              isSidebarOpen && "hidden"
            )}
          >
            <Menu size={20} className="text-gray-900" />
          </button>
        )}

        <main className={cn(
          "flex-1 relative",
          (activeDashboardView === 'side-by-side' || activeDashboardView === 'battle') ? "p-0 overflow-hidden" : "overflow-y-auto scrollbar-hide",
          activeDashboardView === 'home' ? "p-0" : "p-4 md:p-6 lg:p-10"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDashboardView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderDashboardContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}
