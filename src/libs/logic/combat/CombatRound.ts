// src/libs/logic/Combat/CombatRound.ts

import { computeEffectiveAttributes } from '../../state/Ships/ShipLogic';
import { processWeaponRound } from './CombatEngine';

import type { GameState } from '../../state/GameState';
import type { GameMetaState } from '../../state/MetaGameState';
import type { PlayerShipState } from '../../state/Ships/PlayerShipState';
import type { EnemyShipState } from '../../state/Ships/EnemyShipState';

function findNextEnemy(
  enemies: EnemyShipState[],
  boss: EnemyShipState | null
): EnemyShipState | null {
  const aliveEnemy = enemies.find((e) => e.status === 'alive');
  if (aliveEnemy) return aliveEnemy;
  if (boss && boss.status === 'alive') return boss;
  return null;
}

/**
 * Applies one combat round between the player and the next alive enemy (or boss).
 */
export function runCombatStep(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState, EnemyShipState | undefined] {
  const player = gameState.player_ship;
  const enemies = gameState.stage_enemy_ships;
  const boss = gameState.stage_boss_ship;

  const nextEnemy = findNextEnemy(enemies, boss);
  if (!nextEnemy) return [gameState, metaState, undefined];

  const [newPlayer, updatedEnemy] = runCombatRoundBetween(player, nextEnemy);

  const defeated =
    updatedEnemy.currentHp <= 0 && updatedEnemy.status === 'alive'
      ? { ...updatedEnemy, status: 'dead' as const }
      : undefined;

  const trulyUpdatedEnemy = defeated ?? updatedEnemy;

  const updatedEnemies = enemies.map(e =>
    e === nextEnemy ? trulyUpdatedEnemy : e
  );
  const updatedBoss = boss === nextEnemy ? trulyUpdatedEnemy : boss;

  return [
    {
      ...gameState,
      player_ship: newPlayer,
      stage_enemy_ships: updatedEnemies,
      stage_boss_ship: updatedBoss,
    },
    metaState,
    defeated,
  ];
}

export function runCombatRoundBetween(
  player: PlayerShipState,
  enemy: EnemyShipState
): [PlayerShipState, EnemyShipState] {
  const playerAttrs = computeEffectiveAttributes(player);
  const enemyAttrs = computeEffectiveAttributes(enemy);

  // Le joueur attaque l'ennemi
  const [enemyAfterAttack, , ] = processWeaponRound(player, playerAttrs, enemy, enemyAttrs);

  // L'ennemi attaque le joueur 
  const [playerAfterAttack, , ] = processWeaponRound(enemy, enemyAttrs, player, playerAttrs);

  const newPlayer: PlayerShipState = {
    ...player,
    ...playerAfterAttack,
  };

  const newEnemy: EnemyShipState = {
    ...enemy,
    ...enemyAfterAttack,
  };

  return [newPlayer, newEnemy];
}