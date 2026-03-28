import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Code2, 
  Brain,
  Calculator, 
  MessageSquare, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Edit3, 
  Search, 
  Video, 
  Film, 
  Clapperboard,
  ChevronRight,
  Clock,
  ArrowUpRight,
  LayoutGrid,
  Info,
  Zap,
  Send
} from 'lucide-react';
import { Card, Badge } from './UI';
import { cn } from '../lib/utils';

type Category = 'Overview' | 'Text' | 'Code' | 'Vision' | 'Document' | 'Text-to-Image' | 'Image Edit' | 'Search' | 'Text-to-Video' | 'Image-to-Video' | 'Video Edit';

interface LeaderboardModel {
  rank: number;
  name: string;
  score: number;
  votes: string;
  provider: 'OpenAI' | 'Google' | 'Anthropic' | 'xAI' | 'Mistral' | 'Meta' | 'Other';
  hasInfo?: boolean;
}

const CATEGORIES: { id: Category; icon: any }[] = [
  { id: 'Overview', icon: LayoutGrid },
  { id: 'Text', icon: MessageSquare },
  { id: 'Code', icon: Code2 },
  { id: 'Vision', icon: Eye },
  { id: 'Document', icon: FileText },
  { id: 'Text-to-Image', icon: ImageIcon },
  { id: 'Image Edit', icon: Edit3 },
  { id: 'Search', icon: Search },
  { id: 'Text-to-Video', icon: Video },
  { id: 'Image-to-Video', icon: Film },
  { id: 'Video Edit', icon: Clapperboard },
];

const MOCK_DATA: Record<Exclude<Category, 'Overview'>, LeaderboardModel[]> = {
  'Text': [
    { rank: 1, name: 'claude-opus-4-6-thinking', score: 1504, votes: '12,730', provider: 'Anthropic' },
    { rank: 2, name: 'claude-opus-4-6', score: 1500, votes: '13,553', provider: 'Anthropic' },
    { rank: 3, name: 'gemini-3.1-pro-preview', score: 1493, votes: '15,809', provider: 'Google' },
    { rank: 4, name: 'grok-4.20-beta1', score: 1491, votes: '7,378', provider: 'xAI', hasInfo: true },
    { rank: 5, name: 'gemini-3-pro', score: 1486, votes: '41,631', provider: 'Google' },
    { rank: 6, name: 'gpt-5.4-high', score: 1484, votes: '5,570', provider: 'OpenAI' },
    { rank: 7, name: 'grok-4.20-beta-0309-reasoning', score: 1483, votes: '5,702', provider: 'xAI' },
    { rank: 8, name: 'gpt-5.2-chat-latest-202603', score: 1480, votes: '11,405', provider: 'OpenAI' },
  ],
  'Code': [
    { rank: 1, name: 'claude-opus-4-6', score: 1549, votes: '4,264', provider: 'Anthropic' },
    { rank: 2, name: 'claude-opus-4-6-thinking', score: 1545, votes: '3,495', provider: 'Anthropic' },
    { rank: 3, name: 'claude-sonnet-4-6', score: 1523, votes: '6,391', provider: 'Anthropic' },
    { rank: 4, name: 'claude-opus-4-5-20251101-beta', score: 1491, votes: '13,247', provider: 'Anthropic' },
    { rank: 5, name: 'claude-opus-4-5-20251101', score: 1465, votes: '13,559', provider: 'Anthropic' },
    { rank: 6, name: 'gpt-5.4-high (codex-harness)', score: 1457, votes: '1,488', provider: 'OpenAI' },
    { rank: 7, name: 'gemini-3.1-pro-preview', score: 1455, votes: '4,733', provider: 'Google' },
    { rank: 8, name: 'glm-5', score: 1445, votes: '4,265', provider: 'Other' },
  ],
  'Vision': [
    { rank: 1, name: 'gpt-5-vision-latest', score: 1420, votes: '8,210', provider: 'OpenAI' },
    { rank: 2, name: 'claude-opus-4-6-vision', score: 1415, votes: '7,450', provider: 'Anthropic' },
    { rank: 3, name: 'gemini-3.1-pro-vision', score: 1410, votes: '9,120', provider: 'Google' },
    { rank: 4, name: 'grok-4-vision', score: 1395, votes: '4,560', provider: 'xAI' },
  ],
  'Document': [
    { rank: 1, name: 'claude-opus-4-6-doc', score: 1480, votes: '5,670', provider: 'Anthropic' },
    { rank: 2, name: 'gemini-3.1-pro-long-context', score: 1475, votes: '12,340', provider: 'Google' },
    { rank: 3, name: 'gpt-5-doc-analyzer', score: 1460, votes: '4,890', provider: 'OpenAI' },
  ],
  'Text-to-Image': [
    { rank: 1, name: 'gemini-3.1-flash-image-preview', score: 1265, votes: '26,666', provider: 'Google' },
    { rank: 2, name: 'gpt-image-1.5-high-fidelity', score: 1244, votes: '66,785', provider: 'OpenAI' },
    { rank: 3, name: 'gemini-3-pro-image-preview', score: 1233, votes: '61,854', provider: 'Google' },
    { rank: 4, name: 'gemini-3-pro-image-preview-v2', score: 1232, votes: '82,543', provider: 'Google' },
    { rank: 5, name: 'mai-image-2', score: 1190, votes: '11,001', provider: 'Other' },
    { rank: 6, name: 'reve-v1.5', score: 1177, votes: '7,797', provider: 'Other' },
    { rank: 7, name: 'grok-imagine-image', score: 1173, votes: '53,997', provider: 'xAI' },
    { rank: 8, name: 'flux-2-max', score: 1166, votes: '70,018', provider: 'Other' },
  ],
  'Image Edit': [
    { rank: 1, name: 'chatgpt-image-latest-high', score: 1398, votes: '282,599', provider: 'OpenAI' },
    { rank: 2, name: 'gemini-3-pro-image-preview', score: 1391, votes: '264,935', provider: 'Google' },
    { rank: 3, name: 'gemini-3-pro-image-preview-v2', score: 1389, votes: '518,705', provider: 'Google' },
    { rank: 4, name: 'gemini-3.1-flash-image-preview', score: 1387, votes: '86,607', provider: 'Google' },
    { rank: 5, name: 'gpt-image-1.5-high-fidelity', score: 1381, votes: '301,379', provider: 'OpenAI' },
    { rank: 6, name: 'grok-imagine-image', score: 1338, votes: '28,700', provider: 'xAI' },
  ],
  'Search': [
    { rank: 1, name: 'perplexity-pro-latest', score: 1510, votes: '45,670', provider: 'Other' },
    { rank: 2, name: 'gpt-5-search-enabled', score: 1495, votes: '32,450', provider: 'OpenAI' },
    { rank: 3, name: 'gemini-3.1-pro-search', score: 1490, votes: '28,900', provider: 'Google' },
  ],
  'Text-to-Video': [
    { rank: 1, name: 'veo-3.1-fast-generate', score: 1350, votes: '12,450', provider: 'Google' },
    { rank: 2, name: 'sora-v2-preview', score: 1345, votes: '15,670', provider: 'OpenAI' },
    { rank: 3, name: 'runway-gen-4', score: 1320, votes: '8,900', provider: 'Other' },
  ],
  'Image-to-Video': [
    { rank: 1, name: 'veo-3.1-animate', score: 1380, votes: '9,450', provider: 'Google' },
    { rank: 2, name: 'luma-dream-machine-v3', score: 1365, votes: '11,200', provider: 'Other' },
  ],
  'Video Edit': [
    { rank: 1, name: 'veo-3.1-edit', score: 1410, votes: '5,670', provider: 'Google' },
    { rank: 2, name: 'adobe-firefly-video', score: 1390, votes: '4,560', provider: 'Other' },
  ],
};

const ProviderIcon = ({ provider }: { provider: LeaderboardModel['provider'] }) => {
  switch (provider) {
    case 'OpenAI':
      return <div className="w-4 h-4 bg-[#74aa9c] rounded-sm flex items-center justify-center text-[10px] text-white font-bold">O</div>;
    case 'Google':
      return <div className="w-4 h-4 bg-[#4285f4] rounded-sm flex items-center justify-center text-[10px] text-white font-bold">G</div>;
    case 'Anthropic':
      return <div className="w-4 h-4 bg-[#d97757] rounded-sm flex items-center justify-center text-[10px] text-white font-bold">A</div>;
    case 'xAI':
      return <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center text-[10px] text-black font-bold">X</div>;
    case 'Meta':
      return <div className="w-4 h-4 bg-[#0668E1] rounded-sm flex items-center justify-center text-[10px] text-white font-bold">M</div>;
    default:
      return <div className="w-4 h-4 bg-gray-600 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">?</div>;
  }
};

const LeaderboardTable = ({ category, data, compact = false, onExpand, searchQuery = '' }: { category: Category; data: LeaderboardModel[]; compact?: boolean; onExpand?: () => void; searchQuery?: string }) => {
  const Icon = CATEGORIES.find(c => c.id === category)?.icon || MessageSquare;
  
  const filteredData = searchQuery 
    ? data.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.provider.toLowerCase().includes(searchQuery.toLowerCase()))
    : data;
  
  return (
    <Card className="bg-white border-gray-100 overflow-hidden flex flex-col h-full group/card shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">{category}</h3>
        </div>
        <div className="flex items-center gap-4">
          {compact && (
            <button 
              onClick={onExpand}
              className="text-[10px] text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors font-bold uppercase tracking-widest"
            >
              View <ChevronRight size={10} />
            </button>
          )}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
            <Clock size={12} />
            <span>2 days ago</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100">
              <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px]">Rank</th>
              <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px]">Model</th>
              <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px] text-right">Score</th>
              <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px] text-right">Votes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.slice(0, compact ? 10 : undefined).map((model) => (
              <tr 
                key={model.name} 
                className="hover:bg-gray-50 transition-all duration-300 relative group/row"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-md" />
                </div>
                <td className="px-4 py-3 font-bold text-gray-400 relative z-10">{model.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProviderIcon provider={model.provider} />
                    <span className="font-bold text-gray-900 truncate max-w-[150px]">{model.name}</span>
                    {model.hasInfo && (
                      <div className="w-3 h-3 rounded-full border border-gray-200 flex items-center justify-center text-[8px] text-gray-400">
                        i
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-gray-700 relative z-10">{model.score}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-400 relative z-10">{model.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {compact && data.length > 10 && (
        <button 
          onClick={onExpand}
          className="w-full py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all border-t border-gray-100"
        >
          View all
        </button>
      )}
    </Card>
  );
};

import { getLeaderboardData } from '../services/leaderboardService';

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState<Category>('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const realData = getLeaderboardData();

  // Map real data to LeaderboardModel format
  const mappedData: LeaderboardModel[] = realData.map((m, i) => ({
    rank: i + 1,
    name: m.name,
    score: m.score,
    votes: m.votes.toLocaleString(),
    provider: m.provider as any
  }));

  const displayData = activeCategory === 'Overview' || activeCategory === 'Text' ? mappedData : MOCK_DATA[activeCategory as keyof typeof MOCK_DATA];

  return (
    <div className="min-h-screen bg-white -m-6 lg:-m-10 p-6 lg:p-10 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Input with Glow */}
        <div className="relative max-w-2xl mx-auto">
          {/* Multi-layer animated glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-orange-400 rounded-2xl opacity-0 focus-within:opacity-100 transition-all duration-500 blur-[4px] animate-pulse" />
          <div className="absolute -inset-[3px] bg-gradient-to-r from-yellow-400 via-red-500 via-purple-600 via-blue-600 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-70 transition-all duration-700 blur-[8px] animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="absolute -inset-[4px] bg-gradient-to-br from-pink-400 via-purple-500 via-blue-500 to-cyan-400 rounded-2xl opacity-0 focus-within:opacity-50 transition-all duration-1000 blur-[12px] animate-pulse" style={{ animationDelay: '0.4s' }} />
          
          <div className="relative bg-white border border-gray-200 rounded-2xl p-3 shadow-lg shadow-black/5 focus-within:border-transparent focus-within:shadow-none transition-all flex items-center gap-3">
            <Search size={20} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models or providers..."
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors shrink-0"
              >
                <Zap size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 overflow-x-auto scrollbar-hide sticky top-0 z-20">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                activeCategory === cat.id 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
              )}
            >
              <cat.icon size={14} />
              {cat.id}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeCategory === 'Overview' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <LeaderboardTable 
                  category="Text" 
                  data={displayData} 
                  compact 
                  onExpand={() => setActiveCategory('Text')}
                  searchQuery={searchQuery}
                />
                <LeaderboardTable 
                  category="Code" 
                  data={MOCK_DATA['Code']} 
                  compact 
                  onExpand={() => setActiveCategory('Code')}
                  searchQuery={searchQuery}
                />
                <LeaderboardTable 
                  category="Text-to-Image" 
                  data={MOCK_DATA['Text-to-Image']} 
                  compact 
                  onExpand={() => setActiveCategory('Text-to-Image')}
                  searchQuery={searchQuery}
                />
                <LeaderboardTable 
                  category="Image Edit" 
                  data={MOCK_DATA['Image Edit']} 
                  compact 
                  onExpand={() => setActiveCategory('Image Edit')}
                  searchQuery={searchQuery}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      {React.createElement(CATEGORIES.find(c => c.id === activeCategory)?.icon || MessageSquare, { size: 24, className: "text-gray-900" })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{activeCategory} Arena</h2>
                      <p className="text-sm text-gray-500 font-medium">Top performing models in {activeCategory.toLowerCase()} tasks.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Votes</p>
                      <p className="text-lg md:text-xl font-mono font-bold text-gray-900">1.2M+</p>
                    </div>
                    <div className="w-px h-10 bg-gray-100" />
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Last Updated</p>
                      <p className="text-lg md:text-xl font-mono font-bold text-gray-900">Today</p>
                    </div>
                  </div>
                </div>
                
                <LeaderboardTable category={activeCategory} data={displayData} searchQuery={searchQuery} />
                
                {/* Stats Cards for Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-white border-gray-100 flex items-center gap-4 shadow-sm relative group/card hover:shadow-lg transition-all duration-500">
                    {/* Card hover glow */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />
                    </div>
                    <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center">
                      <ArrowUpRight size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Trending Model</p>
                      <p className="text-lg font-bold text-gray-900">{displayData[0].name}</p>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white border-gray-100 flex items-center gap-4 shadow-sm relative group/card hover:shadow-lg transition-all duration-500">
                    {/* Card hover glow */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                      <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 via-orange-400/30 to-yellow-400/30 blur-xl" />
                    </div>
                    <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Arena Leader</p>
                      <p className="text-lg font-bold text-gray-900">{displayData[0].provider}</p>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white border-gray-100 flex items-center gap-4 shadow-sm relative group/card hover:shadow-lg transition-all duration-500">
                    {/* Card hover glow */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-teal-400/30 blur-xl" />
                    </div>
                    <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center">
                      <ImageIcon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">New Entry</p>
                      <p className="text-lg font-bold text-gray-900">grok-4.20-beta</p>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
