import { create } from 'zustand';
import { GameType } from '@/types/game';

interface SessionState {
  totalTime: number;
  mode: 'random' | 'specific' | 'multiple';
  selectedGames: GameType[];
  gamesCompleted?: number;
}

interface SessionStoreState {
  session: SessionState | null;
  sessionHistory: SessionState[];
  startSession: (session: SessionState) => void;
  updateSession: (session: SessionState) => void;
  completeGame: (gameIndex: number) => void;
  failGame: (gameIndex: number) => void;
  finishSession: () => void;
  selectGame: (gameId: string) => void;
  startNewSession: () => void;
  clearHistory: () => void;
}

export const useSessionStore = create<SessionStoreState>((set, get) => ({
  session: null,
  sessionHistory: [],
  
  startSession: (session: SessionState) => {
    set({ session: { ...session, timestamp: Date.now() } });
  },
  
  updateSession: (session: SessionState) => {
    set({ session: { ...session, timestamp: Date.now() } });
  },
  
  completeGame: (gameIndex: number) => {
    const { session } = get();
    if (!session) return;
    
    const updatedGames = session.selectedGames.map((game, index) => 
      index === gameIndex ? { ...game, completed: true } : game
    );
    
    set({
      session: {
        ...session,
        selectedGames: updatedGames,
        gamesCompleted: (session.gamesCompleted || 0) + 1
      }
    });
  },
  
  failGame: (gameIndex: number) => {
    const { session } = get();
    if (!session) return;
    
    const updatedGames = session.selectedGames.map((game, index) => 
      index === gameIndex ? { ...game, completed: false } : game
    );
    
    set({
      session: {
        ...session,
        selectedGames: updatedGames
      }
    });
  },
  
  finishSession: () => {
    const { session, sessionHistory } = get();
    if (!session) return;
    
    set({
      sessionHistory: [session, ...sessionHistory]
    });
  },
  
  selectGame: (gameId: string) => {
    const { session } = get();
    if (!session) return;
    
    // Update the selected game for 'specific' mode
    if (session.mode === 'specific') {
      import('@/constants/games').then(({ GAMES }) => {
        const game = GAMES.find(g => g.id === gameId);
        if (game) {
          set({
            session: {
              ...session,
              selectedGames: [{ ...game, timeAllocation: session.totalTime }]
            }
          });
        }
      });
    }
  },
  
  startNewSession: () => {
    const { session } = get();
    if (!session) return;
    
    // Reset completion status for games
    const resetGames = session.selectedGames.map(game => ({
      ...game,
      completed: undefined
    }));
    
    set({
      session: {
        ...session,
        selectedGames: resetGames,
        gamesCompleted: 0,
        timestamp: Date.now()
      }
    });
  },
  
  clearHistory: () => {
    set({ sessionHistory: [] });
  }
}));