import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Check, Bot } from 'lucide-react';
import { MODELS } from '../types';
import { Badge, Input } from './UI';
import { cn } from '../lib/utils';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function ModelSelector({ value, onChange, label }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedModel = MODELS.find(m => m.id === value);
  const filteredModels = MODELS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.provider.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm flex items-center justify-between transition-all hover:border-gray-200 hover:shadow-md group",
          isOpen && "ring-4 ring-blue-500/5 border-blue-500/20 shadow-lg"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
            <Bot size={20} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900 text-base">{selectedModel?.name}</span>
              <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-2 py-0.5">{selectedModel?.size}</Badge>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{selectedModel?.provider}</p>
          </div>
        </div>
        <ChevronDown 
          size={18} 
          className={cn("text-gray-300 transition-transform duration-300 group-hover:text-gray-900", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <Input
                  autoFocus
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-lg"
                />
              </div>
            </div>
            
            <div className="max-h-[280px] overflow-y-auto p-2">
              {filteredModels.length > 0 ? (
                filteredModels.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      onChange(model.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group mb-1 last:mb-0",
                      value === model.id ? "bg-gray-900 text-white" : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{model.name}</span>
                        <Badge className={cn(
                          "text-[9px]",
                          value === model.id ? "bg-white/10 text-white border-white/20" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {model.size}
                        </Badge>
                      </div>
                      <p className={cn(
                        "text-[10px] font-medium",
                        value === model.id ? "text-gray-400" : "text-gray-500"
                      )}>
                        {model.provider} • {model.description}
                      </p>
                    </div>
                    {value === model.id && <Check size={16} className="text-white" />}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-bold text-gray-900">No models found</p>
                  <p className="text-xs text-gray-500">Try searching for a different name or provider.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
