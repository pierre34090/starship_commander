// src/libs/combat/CombatRound.ts

import type { PlayerShipState } from '../state/Ships/PlayerShipState';
import type { EnemyShipState } from '../state/Ships/EnemyShipState';

/**
 * Execute one combat round between player and a single enemy.
 * Damage calculation = max(attack - defense, 0).
 * Both attack simultaneously.
 */
export function playRound(
  player: PlayerShipState,
  enemy: EnemyShipState
): [PlayerShipState, EnemyShipState] {
  const playerDamage = Math.max(player.attack - enemy.defense, 0);
  const enemyDamage = Math.max(enemy.attack - player.defense, 0);

  const newPlayerHp = Math.max(player.hp - enemyDamage, 0);
  const newEnemyHp = Math.max(enemy.hp - playerDamage, 0);

  return [
    { ...player, hp: newPlayerHp },
    { ...enemy, hp: newEnemyHp },
  ];
}
