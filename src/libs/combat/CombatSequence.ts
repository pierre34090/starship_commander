// src/libs/combat/CombatSequence.ts

import type { PlayerShipState } from '../state/Ships/PlayerShipState';
import type { EnemyShipState } from '../state/Ships/EnemyShipState';
import { playRound } from './CombatRound';


/**
 * Simulate sequential fights against all enemies and a boss.
 * - Enemies in `enemies` can be skipped via `skipIndices`.
 * - Boss is fought last and is mandatory.
 *
 * @param player Current player ship state
 * @param enemies Array of normal enemies
 * @param boss Boss enemy or null if none
 * @param skipIndices Set of indices of enemies to skip
 * @returns Updated player, enemies, and boss states after combat
 */

export function fightAllEnemies(
  player: PlayerShipState,
  enemies: EnemyShipState[],
  boss: EnemyShipState | null,
  skipIndices: Set<number> = new Set()
): [PlayerShipState, EnemyShipState[], EnemyShipState | null] {
  let currentPlayer = player;
  const updatedEnemies: EnemyShipState[] = [];

  // Loop over each enemy
  for (let i = 0; i < enemies.length; i++) {
    // If enemy is skipped, add as is and continue
    if (skipIndices.has(i)) {
      updatedEnemies.push(enemies[i]);
      continue;
    }

    // Fight enemy until either it or player dies
    let enemy = enemies[i];
    while (enemy.hp > 0 && currentPlayer.hp > 0) {
      [currentPlayer, enemy] = playRound(currentPlayer, enemy);
    }
    updatedEnemies.push(enemy);

    // If player died, stop combat immediately
    if (currentPlayer.hp <= 0) break;
  }

  // Fight boss if player still alive and boss exists
  let updatedBoss = boss;
  if (currentPlayer.hp > 0 && updatedBoss !== null) {
    while (updatedBoss.hp > 0 && currentPlayer.hp > 0) {
      [currentPlayer, updatedBoss] = playRound(currentPlayer, updatedBoss);
    }
  }

  // Return final states after combat
  return [currentPlayer, updatedEnemies, updatedBoss];
}
