import React, { useContext } from 'react';

import { GameContext, GameProvider } from './contexts/GameContext';
import { MessageProvider } from './contexts/MessageContext';

import { initGameState } from './libs/state/GameState';
import { initGameMetaState } from './libs/state/MetaGameState';
import type { PlayerShipState } from './libs/state/Ships/PlayerShipState';
import { allPlayerShips } from './libs/models/Ships/PlayerShipsTemplates';
import { MessageBus } from './contexts/MessageContext';

import GameOverScreen from './components/GameOverScreen';
import WinScreen from './components/WinScreen';
import StartScreen from './components/StartScreen';
import MainScreen from './components/MainScreen';
import GameLayout from './components/GameLayout';

function GameContent() {
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext not found');

  const {
    gameState,
    setGameState,
    metaState,
    setMetaState,
  } = context;

  const startGame = (playerName: string, playerShip: PlayerShipState) => {
    const initialState = initGameState(playerName, playerShip);
    setGameState(initialState);
  };

  const restartGame = () => {
    if (!gameState) return;
    const originalTemplate = allPlayerShips.find(tpl => tpl.name === gameState.player_ship.name)!;
    setGameState(initGameState(gameState.player_name, originalTemplate));
    setMetaState(initGameMetaState());
    MessageBus.clear();
  };

  if (gameState === null) return <StartScreen onStartGame={startGame} />;
  if (metaState.gameOver) return <GameOverScreen onRestart={restartGame} />;
  if (metaState.gameWin) return <WinScreen onRestart={restartGame} />;

  return <MainScreen />;
}

export default function GameContainer() {
  return (
    <MessageProvider>
      <GameProvider>
        <GameLayout>
          <GameContent />
        </GameLayout>
      </GameProvider>
    </MessageProvider>
  );
}
