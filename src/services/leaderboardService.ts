import { MODELS } from '../types';
import { routerAPI } from './routerApi';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  votes: number;
  provider: string;
  winRate?: number;
}

// Initial data based on MODELS
let leaderboardData: LeaderboardEntry[] = MODELS.map((model, index) => ({
  id: model.id,
  name: model.name,
  score: 1200 - (index * 10),
  votes: 1000 + Math.floor(Math.random() * 5000),
  provider: model.provider,
  winRate: 50 + Math.random() * 30
}));

// Fetch leaderboard data from backend
export const fetchLeaderboardFromBackend = async (): Promise<LeaderboardEntry[]> => {
  try {
    // Get model performance from backend
    const performance = await routerAPI.getModelPerformance();
    
    if (performance && Object.keys(performance).length > 0) {
      // Transform backend data to leaderboard format
      const backendData = Object.entries(performance).map(([modelId, data]: [string, any]) => ({
        id: modelId,
        name: modelId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        score: Math.round((data.avg_rating || 3) * 400 + 1000),
        votes: data.count || 0,
        provider: 'NVIDIA',
        winRate: (data.avg_rating || 3) * 20
      }));
      
      if (backendData.length > 0) {
        leaderboardData = backendData;
      }
    }
    
    return getLeaderboardData();
  } catch (error) {
    console.error('Failed to fetch leaderboard from backend:', error);
    return getLeaderboardData();
  }
};

export const getLeaderboardData = () => [...leaderboardData].sort((a, b) => b.score - a.score);

export const recordVote = async (winnerId: string | null, loserId: string | null) => {
  if (winnerId && loserId) {
    // Submit feedback to backend for the winner
    try {
      await routerAPI.submitFeedback({
        query: 'battle_vote',
        selected_model: winnerId,
        user_rating: 5,
        user_comment: `Won against ${loserId} in battle mode`
      });
    } catch (error) {
      console.error('Failed to submit vote to backend:', error);
    }
    
    // Simple Elo-like update locally
    const winner = leaderboardData.find(m => m.id === winnerId);
    const loser = leaderboardData.find(m => m.id === loserId);
    
    if (winner && loser) {
      winner.score += 15;
      loser.score -= 10;
      winner.votes += 1;
      loser.votes += 1;
    }
  } else if (!winnerId && !loserId) {
    // Tie - both get a small boost
    leaderboardData.forEach(m => {
      m.votes += 1;
    });
  }
  
  localStorage.setItem('hrouter_leaderboard', JSON.stringify(leaderboardData));
};

// Load from localStorage if exists
const saved = localStorage.getItem('hrouter_leaderboard');
if (saved) {
  try {
    leaderboardData = JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load leaderboard', e);
  }
}
