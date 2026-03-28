import { MODELS } from '../types';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  votes: number;
  provider: string;
}

// Initial mock data based on MODELS
let leaderboardData: LeaderboardEntry[] = MODELS.map((model, index) => ({
  id: model.id,
  name: model.name,
  score: 1200 - (index * 10), // Initial spread
  votes: 1000 + Math.floor(Math.random() * 5000),
  provider: model.provider
}));

export const getLeaderboardData = () => [...leaderboardData].sort((a, b) => b.score - a.score);

export const recordVote = (winnerId: string | null, loserId: string | null) => {
  if (winnerId && loserId) {
    // Simple Elo-like update
    const winner = leaderboardData.find(m => m.id === winnerId);
    const loser = leaderboardData.find(m => m.id === loserId);
    
    if (winner && loser) {
      winner.score += 15;
      loser.score -= 10;
      winner.votes += 1;
      loser.votes += 1;
    }
  } else if (!winnerId && !loserId) {
    // Tie - both get a small boost or stay same
    leaderboardData.forEach(m => {
      m.votes += 1;
    });
  }
  
  // Persist to localStorage for demo purposes
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
