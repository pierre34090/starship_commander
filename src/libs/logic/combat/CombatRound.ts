// src/libs/combat/CombatRound.ts

import type { PlayerShipState } from '../state/Ships/PlayerShipState';
import type { EnemyShipState } from '../state/Ships/EnemyShipState';
import type { GameState } from '../state/GameState';
import type { GameMetaState } from '../state/MetaGameState';

/**
 * Applies one combat round against the next active enemy (normal or boss).
 * Does not handle gameOver/gameWin logic.
 */
export function runCombatStep(
  gameState: GameState,
  metaState: GameMetaState,
): [GameState, GameMetaState, EnemyShipState | undefined] {
  const player = gameState.player_ship;
  const enemies = [...gameState.stage_enemy_ships];
  const boss = gameState.stage_boss_ship;

  const nextEnemy = findNextEnemy(enemies, boss);
  if (!nextEnemy) return [gameState, metaState, undefined];

  const [updatedPlayer, updatedEnemy, defeatedEnemy] = applyCombatRound(player, nextEnemy);

  const updatedEnemies = enemies.map(e => e === nextEnemy ? updatedEnemy : e);
  const updatedBoss = boss === nextEnemy ? updatedEnemy : boss;

  const updatedGameState: GameState = {
    ...gameState,
    player_ship: updatedPlayer,
    stage_enemy_ships: updatedEnemies,
    stage_boss_ship: updatedBoss,
  };

  return [updatedGameState, metaState, defeatedEnemy];
}

function findNextEnemy(
  enemies: EnemyShipState[],
  boss: EnemyShipState | null
): EnemyShipState | null {
  const next = enemies.find(e => e.status === 'alive');
  if (next) return next;
  if (boss && boss.status === 'alive') return boss;
  return null;
}

function applyCombatRound(
  player: PlayerShipState,
  enemy: EnemyShipState
): [PlayerShipState, EnemyShipState, EnemyShipState | undefined] {
  const playerDamage = Math.max(player.attack - enemy.defense, 0);
  const enemyDamage = Math.max(enemy.attack - player.defense, 0);

  const newEnemyHp = Math.max(enemy.hp - playerDamage, 0);
  const enemyIsDead = newEnemyHp === 0;

  const updatedPlayer = { ...player, hp: Math.max(player.hp - enemyDamage, 0) };
  const updatedEnemy: EnemyShipState = {
    ...enemy,
    hp: newEnemyHp,
    status: enemyIsDead ? 'dead' : enemy.status,
  };

  const defeatedEnemy = enemyIsDead ? updatedEnemy : undefined;

  return [updatedPlayer, updatedEnemy, defeatedEnemy];
}