// src/hooks/useCombat.ts
import { useState, useCallback } from "react";
import { generateEnemy as generateEnemyLogic } from "../logic/generate_enemy";
import { resolveFight } from "../logic/fight_manager";
import type { Ship } from "../models/ships/Ship";
import type { UseCombatReturn, FightResult } from "../types/combat";

export function useCombat(): UseCombatReturn {
  const [enemy, setEnemy] = useState<Ship | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Générer un nouvel ennemi
  const generateEnemy = useCallback(() => {
    const newEnemy = generateEnemyLogic();
    setEnemy(newEnemy);
    setLastResult(null);
    setGameOver(false);
  }, []);

  // Lancer le combat : prend en argument le playerShip actuel,
  // renvoie un FightResult ou null si pas d'ennemi / déjà gameOver.
  const fight = useCallback(
    (playerShip: Ship): FightResult | null => {
      if (!enemy || gameOver) {
        return null;
      }
      // Appeler la logique existante
      const result = resolveFight(playerShip, enemy);
      // On suppose que resolveFight renvoie { newPlayer, newEnemy, lastResult, scrapGain? }
      const { newPlayer, newEnemy, lastResult: resultMsg, scrapGain } = result;
      // Mettre à jour l'état local
      setEnemy(newEnemy);
      // Déterminer si le joueur est mort
      const playerDead =
        resultMsg.startsWith("☠️ Defeat") ||
        resultMsg === "☠️ Both you and the enemy were destroyed";
      if (playerDead) {
        setGameOver(true);
      }
      setLastResult(resultMsg || null);
      return {
        newPlayer,
        newEnemy,
        lastResult: resultMsg,
        scrapGain,
      };
    },
    [enemy, gameOver]
  );

  // Fuite / skip
  const skip = useCallback((): string | null => {
    if (!enemy) {
      return null;
    }
    const enemyName = enemy.constructor.name;
    const msg = `⏭ You fled from ${enemyName}`;
    setLastResult(msg);
    setEnemy(null);
    setGameOver(false);
    return msg;
  }, [enemy]);

  // Réinitialiser entièrement l'état du combat
  const resetCombat = useCallback(() => {
    setEnemy(null);
    setLastResult(null);
    setGameOver(false);
  }, []);

  return {
    enemy,
    lastResult,
    gameOver,
    generateEnemy,
    fight,
    skip,
    resetCombat,
  };
}
