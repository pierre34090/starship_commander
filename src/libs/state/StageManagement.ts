// src/libs/state/StageManagement.ts

import type { GameState } from './GameState';
import type { GameMetaState } from './MetaGameState';
import { generateEnemiesForStage } from '../models/Ships/EnemyFactory';
import { MessageBus } from '../../contexts/MessageContext';

const LAST_STAGE_INDEX = 2;

export function advanceStage(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const nextStage = metaState.currentStage + 1;
  const { enemies, boss } = generateEnemiesForStage(nextStage);

  MessageBus.send({
    type: 'success',
    text: `Stage ${nextStage + 1} begins!`,
  });

  return [
    {
      ...gameState,
      stage_enemy_ships: enemies,
      stage_boss_ship: boss,
    },
    {
      ...metaState,
      currentStage: nextStage,
      gameOver: false,
      gameWin: false,
    },
  ];
}

export function checkStageOutcome(
  gameState: GameState,
  metaState: GameMetaState
): GameMetaState {
  const player = gameState.player_ship;
  const enemies = gameState.stage_enemy_ships;
  const boss = gameState.stage_boss_ship;

  if (player.hp <= 0) {
    return { ...metaState, gameOver: true };
  }

  const allEnemiesDead = enemies.every(e => e.status !== 'alive');
  const bossDead = !boss || boss.status !== 'alive';

  if (allEnemiesDead && bossDead) {
    if (metaState.currentStage >= LAST_STAGE_INDEX) {
      return { ...metaState, gameWin: true };
    }
  }

  return metaState;
}
