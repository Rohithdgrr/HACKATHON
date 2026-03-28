import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { Card, Badge, Button } from './UI';

interface ChatSession {
  title: string;
  date: string;
  model: string;
  tokens: number;
  cost: string;
}

const mockHistory: ChatSession[] = [
  { title: 'Quantum Physics Explained', date: '2 mins ago', model: 'Llama 3.1 8B', tokens: 452, cost: '$0.0002' },
  { title: 'React Performance Optimization', date: '1 hour ago', model: 'Mixtral 8x7B', tokens: 1240, cost: '$0.0015' },
  { title: 'Marketing Copy Generation', date: '3 hours ago', model: 'Qwen 2.5 7B', tokens: 850, cost: '$0.0008' },
  { title: 'Python Script Debugging', date: 'Yesterday', model: 'Mistral 7B', tokens: 2100, cost: '$0.0021' },
  { title: 'Creative Writing Prompt', date: '2 days ago', model: 'Llama 3.1 8B', tokens: 320, cost: '$0.0001' },
  { title: 'SQL Query Optimization', date: '3 days ago', model: 'Mixtral 8x7B', tokens: 560, cost: '$0.0006' },
];

export default function ChatHistory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">Recent Chat History</h3>
          <p className="text-sm text-gray-500 font-medium">View and manage your previous routing sessions.</p>
        </div>
        <Button variant="outline" className="text-[10px] font-bold uppercase tracking-widest">
          Export History
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockHistory.map((session, i) => (
          <Card key={i} className="p-5 bg-white border-gray-100 shadow-sm hover:border-gray-300 transition-all cursor-pointer group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <Activity size={16} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session.date}</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-gray-900 transition-colors line-clamp-1">{session.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gray-50 text-gray-500 border-none text-[9px] px-1.5 py-0">{session.model}</Badge>
                  <span className="text-[10px] font-medium text-gray-400">{session.tokens} tokens</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Cost: {session.cost}</span>
                <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-900 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest">View</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
