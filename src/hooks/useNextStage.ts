// src/hooks/useNextStage.ts

import { useContext, useCallback } from 'react';
import { GameContext } from '../contexts/GameContext';
import { generateEnemiesForStage } from '../libs/models/Ships/EnemyFactory';

export function useNextStage() {
  const context = useContext(GameContext);
  if (!context) return { nextStage: () => {} };

  const { gameState, setGameState, metaState, setMetaState } = context;

  const nextStage = useCallback(() => {
    if (!gameState) return;

    const next = metaState.currentStage + 1;
    const { enemies, boss } = generateEnemiesForStage(next);

    setGameState({
      ...gameState,
      stage_enemy_ships: enemies,
      stage_boss_ship: boss,
    });

    setMetaState({
      ...metaState,
      currentStage: next,
      gameWin: false,
    });
  }, [gameState, metaState, setGameState, setMetaState]);

  return { nextStage };
}
