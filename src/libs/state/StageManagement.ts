// src/libs/state/StageManagement.ts

import type { GameState } from './GameState';
import type { GameMetaState } from './MetaGameState';
import { generateEnemiesForStage } from '../models/Ships/EnemyFactory';

export function advanceStage(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const nextStage = metaState.currentStage + 1;
  const { enemies, boss } = generateEnemiesForStage(nextStage);

  return [
    {
      ...gameState,
      stage_enemy_ships: enemies,
      stage_boss_ship: boss,
    },
    {
      ...metaState,
      currentStage: nextStage,
      generalMessages: [...metaState.generalMessages, `Stage ${nextStage + 1} begins!`],
      gameOver: false,
      gameWin: false,
    },
  ];
}
