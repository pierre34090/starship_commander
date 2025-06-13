// src/hooks/useGame.ts
import { useState, useEffect, useCallback } from "react";
import { Player_ship } from "../models/ships/playable_ship/Player_ship";
import type { Ship } from "../models/ships/Ship";
import { generateEnemy as generateEnemyLogic} from "../logic/generate_enemy";
import { resolveFight } from "../logic/fight_manager";

export interface UseGameReturn {
  playerShip: Ship;
  money: number;
  scrap: number;
  income: number;
  ecoCost: number;
  forceCost: number;
  repairCost: number;
  repairValue: number;
  enemy: Ship | null;
  gameOver: boolean;
  lastResult: string | null;
  shipMessage: string | null;

  // actions
  upgradeEconomy: () => void;
  upgradeForce: () => void;
  generateEnemy: () => void;
  fight: () => void;
  skip: () => void;
  repair: () => void;
  restartGame: () => void;
}

export function useGame(): UseGameReturn {
  // États
  const [playerShip, setPlayerShip] = useState<Ship>(() => new Player_ship());
  const [money, setMoney] = useState(500);
  const [scrap, setScrap] = useState(0);
  const [income, setIncome] = useState(1);
  const [ecoCost, setEcoCost] = useState(15);
  const [forceCost, setForceCost] = useState(20);
  const [repairCost, setRepairCost] = useState(10);
  const [repairValue, setRepairValue] = useState(10);
  const [enemy, setEnemy] = useState<Ship | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [shipMessage, setShipMessage] = useState<string | null>(null);

  // passive income
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((m) => m + income * 0.25);
    }, 250);
    return () => clearInterval(interval);
  }, [income]);

  // actions stables via useCallback pour éviter de recréer à chaque rendu
  const upgradeEconomy = useCallback(() => {
    if (money >= ecoCost) {
      setMoney((m) => m - ecoCost);
      setIncome((i) => Math.round(i * 1.5));
      setEcoCost((c) => Math.round(c * 2));
    } else {
      // éventuellement message d’erreur, ou pas
    }
    // on peut aussi effacer shipMessage ou lastResult si besoin
    setShipMessage(null);
  }, [money, ecoCost]);

  const upgradeForce = useCallback(() => {
    if (money >= forceCost) {
      setMoney((m) => m - forceCost);
      setPlayerShip((ps) => ps.updateStats({ attack: ps.stats.attack + 1 }));
      setForceCost((c) => Math.round(c * 1.8));
      setShipMessage("Attack increased");
      // on pourrait clear message après délai si on veut
    } else {
      setShipMessage("Not enough money to upgrade attack");
    }
  }, [money, forceCost]);

  const generateEnemy = useCallback(() => {
    const newEnemy = generateEnemyLogic();
    setEnemy(newEnemy);
    setLastResult(null);
    setGameOver(false);
    setShipMessage(null);
  }, []);

  const fight = useCallback(() => {
    if (!enemy || gameOver) return;
    const { newPlayer, newEnemy, lastResult: resultMsg, scrapGain } = resolveFight(playerShip, enemy);
    setPlayerShip(newPlayer);
    if (scrapGain) setScrap((s) => s + scrapGain);
    setEnemy(newEnemy);
    // détection gameOver : on peut améliorer la logique dans resolveFight pour renvoyer playerDead
    const playerDead = resultMsg.startsWith("☠️ Defeat") || resultMsg === "☠️ Both you and the enemy were destroyed";
    if (playerDead) {
      setGameOver(true);
    }
    setLastResult(resultMsg || null);
    setShipMessage(null);
  }, [enemy, gameOver, playerShip]);

  const skip = useCallback(() => {
    if (!enemy) return;
    const enemyName = enemy.constructor.name;
    setLastResult(`⏭ You fled from ${enemyName}`);
    setEnemy(null);
    setShipMessage(null);
  }, [enemy]);

  const repair = useCallback(() => {
    // Exemple minimal : si on veut activer plus tard
    if (!playerShip) return;
    if (playerShip.stats.hp >= playerShip.stats.maxHp) {
      setShipMessage("Already at full HP");
      return;
    }
    if (money < repairCost) {
      setShipMessage("Not enough money to repair");
      return;
    }
    setMoney((m) => m - repairCost);
    setRepairCost((r) => Math.round(r * 1.5));
    const missing = playerShip.stats.maxHp - playerShip.stats.hp;
    const heal = repairValue > missing ? missing : repairValue;
    const repairedShip = playerShip.repair(heal);
    setPlayerShip(repairedShip);
    setShipMessage(`Repaired ${heal} HP`);
    // on peut clear après délai si besoin
  }, [playerShip, money, repairCost, repairValue]);

  const restartGame = useCallback(() => {
    setPlayerShip(new Player_ship());
    setMoney(500);
    setScrap(0);
    setIncome(1);
    setEcoCost(15);
    setForceCost(20);
    setRepairCost(10);
    setRepairValue(10);
    setEnemy(null);
    setGameOver(false);
    setLastResult(null);
    setShipMessage(null);
  }, []);

  return {
    playerShip,
    money,
    scrap,
    income,
    ecoCost,
    forceCost,
    repairCost,
    repairValue,
    enemy,
    gameOver,
    lastResult,
    shipMessage,
    upgradeEconomy,
    upgradeForce,
    generateEnemy,
    fight,
    skip,
    repair,
    restartGame,
  };
}
