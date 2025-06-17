// src/GameContainer.tsx

import { useContext } from 'react';
import { GameProvider, GameContext } from './contexts/GameContext';
import { initGameState } from './libs/state/GameState';
import MainScreen from './components/MainScreen';
import StartScreen from './components/StartScreen';
import type { PlayerShipState } from './libs/state/Ships/PlayerShipState';
import GameLayout from './components/GameLayout';

function GameContent() {
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext not found');

  const { gameState, setGameState } = context;

  const startGame = (playerName: string, playerShip: PlayerShipState) => {
    const initialState = initGameState(playerName, playerShip);
    setGameState(initialState);
  };

  return gameState === null ? (
    <StartScreen onStartGame={startGame} />
  ) : (
    <MainScreen />
  );
}

export default function GameContainer() {
  return (
    <GameProvider>
      <GameLayout>
        <GameContent />
      </GameLayout>
    </GameProvider>
  );
}
