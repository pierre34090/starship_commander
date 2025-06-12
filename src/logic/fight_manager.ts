import type { Ship } from "../models/ships/Ship";

export interface FightResult {
  newPlayer: Ship;
  newEnemy: Ship | null;
  playerDead: boolean;
  enemyDead: boolean;
  lastResult: string;
  scrapGain: number;
}

/**
 * Résout un combat entre playerShip et enemyShip de façon immuable.
 * Retourne les nouvelles instances et le message de résultat.
 */
export function resolveFight(playerShip: Ship, enemyShip: Ship): FightResult {
  const newEnemy = playerShip.attack(enemyShip);
  const newPlayer = enemyShip.attack(playerShip);

  const enemyHp = newEnemy.stats.hp;
  const playerHp = newPlayer.stats.hp;
  const enemyDead = enemyHp <= 0;
  const playerDead = playerHp <= 0;
  const enemyName = enemyShip.constructor.name;

  let resultMessage = "";
  let scrapGain = 0;
  let finalEnemy: Ship | null = newEnemy;

  if (enemyDead && playerDead) {
    resultMessage = "☠️ Both you and the enemy were destroyed";
    finalEnemy = null;
  } else if (enemyDead) {
    resultMessage = `✅ Victory! You destroyed ${enemyName} and collected 5 scrap.`;
    scrapGain = 5;
    finalEnemy = null;
  } else if (playerDead) {
    resultMessage = `☠️ Defeat! You were destroyed by ${enemyName}`;
    // enemy remains? could keep or not; here we keep finalEnemy as newEnemy
  } else {
    // neither dead
    resultMessage = "";
  }

  return {
    newPlayer,
    newEnemy: finalEnemy,
    playerDead,
    enemyDead,
    lastResult: resultMessage,
    scrapGain,
  };
}
