// src/libs/logic/combat/StageManager.ts

import type { GameState } from '../../state/GameState';
import type { GameMetaState } from '../../state/MetaGameState';
import { generateEnemiesForStage } from '../../models/Ships/EnemyFactory';
import { MessageBus } from '../../../contexts/MessageContext';

import { isShipDead } from '../../state/Ships/ShipState';

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

/**
 * Synchronise les statuts des ennemis et du boss selon leur HP.
 */
export function syncStatusesWithHp(gameState: GameState): GameState {
  return {
    ...gameState,
    stage_enemy_ships: gameState.stage_enemy_ships.map(enemy => ({
      ...enemy,
      status: enemy.ship.currentHp <= 0 ? 'dead' : enemy.status,
    })),
    stage_boss_ship: gameState.stage_boss_ship
      ? {
          ...gameState.stage_boss_ship,
          status: gameState.stage_boss_ship.ship.currentHp <= 0 ? 'dead' : gameState.stage_boss_ship.status,
        }
      : null,
  };
}


export function updateStageOutcome(
  gameState: GameState,
  metaState: GameMetaState
): GameMetaState {
  const player = gameState.player_ship;
  const enemies = gameState.stage_enemy_ships;
  const boss = gameState.stage_boss_ship;


  if (isShipDead(player.ship)) return { ...metaState, gameOver: true };


  const allEnemiesDead = enemies.every(e => e.status !== 'alive');
  const bossDead = !boss || boss.status !== 'alive';

  if (allEnemiesDead && bossDead) {
    if (metaState.currentStage >= LAST_STAGE_INDEX) {
      return { ...metaState, gameWin: true };
    }
  }

  return metaState;
}


export function handleStageProgression(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const syncedState = syncStatusesWithHp(gameState);
  const updatedMeta = updateStageOutcome(syncedState, metaState);

  const allEnemiesDead = syncedState.stage_enemy_ships.every(e => e.status === 'dead');
  const bossDead = !syncedState.stage_boss_ship || syncedState.stage_boss_ship.status === 'dead';
  const gameEnded = updatedMeta.gameOver || updatedMeta.gameWin;

  if (allEnemiesDead && bossDead && !gameEnded) {
    return advanceStage(syncedState, updatedMeta);
  }

  return [syncedState, updatedMeta];
}
