// src/contexts/GameContext.tsx

import React, { createContext, useState, ReactNode } from 'react';
import type { GameState } from '../libs/state/GameState';
import type { GameMetaState } from '../libs/state/MetaGameState';
import { initGameMetaState } from '../libs/state/MetaGameState';

type GameContextType = {
  gameState: GameState | null;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  metaState: GameMetaState;
  setMetaState: React.Dispatch<React.SetStateAction<GameMetaState>>;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [metaState, setMetaState] = useState<GameMetaState>(initGameMetaState());

  return (
    <GameContext.Provider value={{ gameState, setGameState, metaState, setMetaState }}>
      {children}
    </GameContext.Provider>
  );
}
