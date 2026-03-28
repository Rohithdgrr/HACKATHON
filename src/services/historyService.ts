import { routerAPI } from './routerApi';
import { Message } from '../types';

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  timestamp: string | number;
  model: string;
  total_tokens: number;
  cost: number;
  messages?: Message[];
}

export const historyService = {
  async getHistory(): Promise<ChatSession[]> {
    try {
      const data = await routerAPI.getHistory();
      // Map backend fields to frontend fields
      return (data.sessions || []).map((s: any) => ({
        id: s.id,
        title: s.title,
        date: this.formatDate(new Date(s.created_at).getTime()),
        timestamp: s.created_at,
        model: s.model,
        total_tokens: s.total_tokens || 0,
        cost: s.cost || 0,
      }));
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  },

  async getSessionDetails(id: string): Promise<Message[]> {
    try {
      const data = await routerAPI.getSessionDetails(id);
      return data.messages || [];
    } catch (error) {
      console.error('Failed to load session details:', error);
      return [];
    }
  },

  async deleteSession(id: string) {
    try {
      await routerAPI.deleteSession(id);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  },

  clearHistory() {
     // No global clear endpoint yet, but could be added
     console.warn('Clear history not implemented globally on backend yet');
  },

  formatDate(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 172800000) return 'Yesterday';
    
    return new Date(timestamp).toLocaleDateString();
  }
};
