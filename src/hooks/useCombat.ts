// src/hooks/useCombat.ts

import { useState, useContext, useCallback } from 'react';
import { GameContext } from '../contexts/GameContext';
import type { GameState } from '../libs/state/GameState';
import type { GameMetaState } from '../libs/state/MetaGameState';
import { fightAllEnemies } from '../libs/combat/CombatSequence';

type GameContextType = {
  gameState: GameState | null;
  setGameState: (state: GameState) => void;
  metaState: GameMetaState;
  setMetaState: (state: GameMetaState) => void;
};

export function useCombat() {
  // Type assertion to ensure correct typing
  const { gameState, setGameState, metaState, setMetaState } = useContext(GameContext) as GameContextType;

  const [combatInProgress, setCombatInProgress] = useState(false);
  const [combatResult, setCombatResult] = useState<'win' | 'lose' | null>(null);

  const startCombat = useCallback(() => {
    if (!gameState) return;
    setCombatInProgress(true);
    setCombatResult(null);

    const [newPlayer, newEnemies, newBoss] = fightAllEnemies(
      gameState.player_ship,
      gameState.stage_enemy_ships,
      gameState.stage_boss_ship,
      new Set()
    );

    setGameState({
      ...gameState,
      player_ship: newPlayer,
      stage_enemy_ships: newEnemies,
      stage_boss_ship: newBoss,
    });

    if (newPlayer.hp <= 0) {
      setCombatResult('lose');
      setMetaState({ ...metaState, gameOver: true });
    } else if (
      newEnemies.every((e) => e.hp <= 0) &&
      (newBoss === null || newBoss.hp <= 0)
    ) {
      setCombatResult('win');
      setMetaState({ ...metaState, gameWin: true });
    } else {
      setCombatResult(null);
    }

    setCombatInProgress(false);
  }, [gameState, metaState, setGameState, setMetaState]);

  return {
    combatInProgress,
    combatResult,
    startCombat,
  };
}
