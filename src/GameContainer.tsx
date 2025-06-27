import React, { useContext } from 'react';

import { GameContext, GameProvider } from './contexts/GameContext';
import { MessageProvider } from './contexts/MessageContext';

import { initGameState } from './libs/state/GameState';
import { initGameMetaState } from './libs/state/MetaGameState';
import type { ShipState } from './libs/state/Ships/ShipState';
import { allPlayerShips } from './libs/models/Ships/PlayerShipsTemplates';
import { MessageBus } from './contexts/MessageContext';

import GameOverScreen from './components/display/GameOverScreen';
import WinScreen from './components/display/WinScreen';
import StartScreen from './components/display/StartScreen';
import GameLayout from './components/display/GameLayout';
import GameScreen from './components/display/GameScreen';

function GameContent() {
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext not found');

  const {
    gameState,
    setGameState,
    metaState,
    setMetaState,
  } = context;

  const startGame = (playerName: string, playerShip: ShipState) => {
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

  return <GameScreen />;
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
