// src/hooks/useGame.ts
import { useState, useEffect, useCallback } from "react";
import { Player_ship } from "../models/ships/playable_ship/Player_ship";
import type { Ship } from "../models/ships/Ship";
import { generateEnemy as generateEnemyLogic } from "../logic/generate_enemy";
import { resolveFight } from "../logic/fight_manager";
import { generateRandomWeapon } from "../logic/generate_weapon";
import { Weapon } from "../models/weapons/Weapon";

export interface UseGameReturn {
  playerShip: Ship;
  money: number;
  scrap: number;
  income: number;
  ecoCost: number;
  forceCost: number;
  repairCost: number;
  repairValue: number;

  // Nouveaux états pour les armes
  weapons: Array<Weapon | null>;
  weaponCost: number;

  enemy: Ship | null;
  gameOver: boolean;
  lastResult: string | null;
  shipMessage: string | null;
  generalMessage: string | null;

  // actions
  upgradeEconomy: () => void;
  upgradeForce: () => void;
  handleGenerateEnemy: () => void;
  fight: () => void;
  skip: () => void;
  repair: () => void;
  restartGame: () => void;

  // nouvelle action pour acheter une arme
  handleBuyWeapon: () => void;
}

export function useGame(): UseGameReturn {
  // États existants...
  const [playerShip, setPlayerShip] = useState<Ship>(() => new Player_ship());
  const [money, setMoney] = useState(500);
  const [scrap, setScrap] = useState(0);
  const [income, setIncome] = useState(1);
  const [ecoCost, setEcoCost] = useState(15);
  const [forceCost, setForceCost] = useState(20);
  const [repairCost, setRepairCost] = useState(10);
  const [repairValue, setRepairValue] = useState(10);

  // États pour les armes
  const [weapons, setWeapons] = useState<Array<Weapon | null>>([null, null, null]);
  const [weaponCost, setWeaponCost] = useState(100); // coût initial, à ajuster

  const [enemy, setEnemy] = useState<Ship | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [shipMessage, setShipMessage] = useState<string | null>(null);
  const [generalMessage, setGeneralMessage] = useState<string | null>(null);

  // Passive income...
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((m) => m + income * 0.25);
    }, 250);
    return () => clearInterval(interval);
  }, [income]);


  

  // Modifie restartGame pour remettre à zéro les armes aussi
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
    setGeneralMessage(null);

    // Remise à zéro des armes
    setWeapons([null, null, null]);
    setWeaponCost(100);
  }, []);

  // ... le reste de useGame (upgradeEconomy, upgradeForce, handleGenerateEnemy, fight, skip, repair) ...

  // Exemple placeholder pour upgradeEconomy, etc. (à copier depuis la version précédente)...

  const upgradeEconomy = useCallback(() => {
    if (money >= ecoCost) {
      setMoney((m) => m - ecoCost);
      setIncome((i) => Math.round(i * 1.5));
      setEcoCost((c) => Math.round(c * 2));
      setShipMessage(null);
    } else {
      setShipMessage("Pas assez d'argent pour l'économie");
    }
  }, [money, ecoCost]);

  const upgradeForce = useCallback(() => {
    if (money >= forceCost) {
      setMoney((m) => m - forceCost);
      setPlayerShip((ps) => ps.updateStats({ attack: ps.stats.attack + 1 }));
      setForceCost((c) => Math.round(c * 1.8));
      setShipMessage("Attack increased");
    } else {
      setShipMessage("Pas assez d'argent pour augmenter l'attaque");
    }
  }, [money, forceCost]);

  const handleGenerateEnemy = useCallback(() => {
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
    const playerDead =
      resultMsg.startsWith("☠️ Defeat") ||
      resultMsg === "☠️ Both you and the enemy were destroyed";
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

  const handleBuyWeapon = useCallback(() => {
    // 1. Vérifier un slot vide
    const firstEmptyIndex = weapons.findIndex((w) => w === null);
    if (firstEmptyIndex === -1) {
      setGeneralMessage("Tous les emplacements d'armes sont pleins");
      return;
    }
    // 2. Vérifier l’argent
    if (money < weaponCost) {
      setGeneralMessage("Pas assez d'argent pour acheter une arme");
      return;
    }
    // 3. Dépenser
    setMoney((m) => m - weaponCost);
    // (Optionnel) augmenter le coût pour la prochaine arme
    setWeaponCost((c) => Math.round(c * 1.5));
    // 4. Générer arme aléatoire
    const newWeapon = generateRandomWeapon();
    // 5. Mettre à jour l’état weapons : immuable
    setWeapons((prev) => {
      const copy = [...prev];
      copy[firstEmptyIndex] = newWeapon;
      return copy;
    });
    // 6. Message de feedback
    setGeneralMessage(`Vous avez obtenu : ${newWeapon.name}`);
  }, [weapons, money, weaponCost]);

  const repair = useCallback(() => {
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
  }, [playerShip, money, repairCost, repairValue]);

  return {
    playerShip,
    money,
    scrap,
    income,
    ecoCost,
    forceCost,
    repairCost,
    repairValue,

    // Exposer le tableau d’armes et le coût
    weapons,
    weaponCost,

    enemy,
    gameOver,
    lastResult,
    shipMessage,
    generalMessage,

    upgradeEconomy,
    upgradeForce,
    handleGenerateEnemy,
    fight,
    skip,
    repair,
    restartGame,
    handleBuyWeapon,
  };
}
