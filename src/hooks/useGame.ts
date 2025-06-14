// src/hooks/useGame.ts
import { useState, useEffect, useCallback } from "react";
import { Player_ship } from "../models/ships/playable_ship/Player_ship";
import type { Ship } from "../models/ships/Ship";
import { generateRandomWeapon } from "../logic/generate_weapon";
import { Weapon } from "../models/weapons/Weapon";

import { useCombat } from "./useCombat";
import type { FightResult } from "../types/combat";

export interface UseGameReturn {
  playerShip: Ship;
  money: number;
  scrap: number;
  income: number;
  ecoCost: number;
  forceCost: number;
  repairCost: number;
  repairValue: number;

  // États pour les armes
  weapons: Array<Weapon | null>;
  weaponCost: number;

  // Combat : exposé depuis useCombat
  enemy: Ship | null;
  gameOver: boolean;
  lastResult: string | null;

  // Messages UI
  shipMessage: string | null;
  generalMessage: string | null;

  // actions globales
  upgradeEconomy: () => void;
  upgradeForce: () => void;
  handleGenerateEnemy: () => void;
  fight: () => void;
  skip: () => void;
  repair: () => void;
  restartGame: () => void;

  // arme
  handleBuyWeapon: () => void;
}

export function useGame(): UseGameReturn {
  // ----- États globaux -----
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
  const [weaponCost, setWeaponCost] = useState(100);

  // Messages pour l'UI (upgrade, achat arme, réparation, etc.)
  const [shipMessage, setShipMessage] = useState<string | null>(null);
  const [generalMessage, setGeneralMessage] = useState<string | null>(null);

  // ----- Intégration useCombat -----
  const {
    enemy,
    lastResult,
    gameOver,
    generateEnemy,
    fight: combatFight,
    skip: combatSkip,
    resetCombat, // Assure-toi que useCombat exporte bien ceci.
  } = useCombat();

  // ----- Effet de revenu passif -----
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((m) => m + income * 0.25);
    }, 250);
    return () => clearInterval(interval);
  }, [income]);

  // ----- restartGame -----
  const restartGame = useCallback(() => {
    // Réinitialiser état global
    setPlayerShip(new Player_ship());
    setMoney(500);
    setScrap(0);
    setIncome(1);
    setEcoCost(15);
    setForceCost(20);
    setRepairCost(10);
    setRepairValue(10);

    // Réinitialiser messages
    setShipMessage(null);
    setGeneralMessage(null);

    // Réinitialiser armes
    setWeapons([null, null, null]);
    setWeaponCost(100);

    
      resetCombat();
    
  }, [resetCombat]);

  // ----- upgradeEconomy -----
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

  // ----- upgradeForce -----
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

  // ----- handleGenerateEnemy -----
  const handleGenerateEnemy = useCallback(() => {
    generateEnemy();
    // on peut réinitialiser certains messages globaux
    setGeneralMessage(null);
    setShipMessage(null);
  }, [generateEnemy]);

  // ----- fight -----
  const fight = useCallback(() => {
    // Appelle la logique de useCombat en lui passant playerShip
    const result: FightResult | null = combatFight(playerShip);
    if (!result) {
      // pas d'ennemi ou déjà gameOver
      return;
    }
    // Met à jour playerShip selon résultat du combat
    const { newPlayer, scrapGain } = result;
    setPlayerShip(newPlayer);
    if (scrapGain) {
      setScrap((s) => s + scrapGain);
    }
    // Les états enemy, lastResult, gameOver sont mis à jour à l'intérieur de useCombat
    // On réinitialise éventuellement les messages globaux
    setGeneralMessage(null);
    setShipMessage(null);
  }, [combatFight, playerShip]);

  // ----- skip -----
  const skip = useCallback(() => {
    const msg = combatSkip();
    if (msg) {
      // Comme lastResult vit dans useCombat, tu peux l'afficher directement depuis useCombat.
      // Ici, tu peux aussi remettre à null shipMessage/generalMessage si besoin.
      setGeneralMessage(null);
      setShipMessage(null);
    }
  }, [combatSkip]);

  // ----- repair -----
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

  // ----- handleBuyWeapon -----
  const handleBuyWeapon = useCallback(() => {
    const firstEmptyIndex = weapons.findIndex((w) => w === null);
    if (firstEmptyIndex === -1) {
      setGeneralMessage("Tous les emplacements d'armes sont pleins");
      return;
    }
    if (money < weaponCost) {
      setGeneralMessage("Pas assez d'argent pour acheter une arme");
      return;
    }
    setMoney((m) => m - weaponCost);
    setWeaponCost((c) => Math.round(c * 1.5));
    const newWeapon = generateRandomWeapon();
    setWeapons((prev) => {
      const copy = [...prev];
      copy[firstEmptyIndex] = newWeapon;
      return copy;
    });
    setGeneralMessage(`Vous avez obtenu : ${newWeapon.name}`);
    setShipMessage(null);
  }, [weapons, money, weaponCost]);

  // ----- Retour du hook -----
  return {
    playerShip,
    money,
    scrap,
    income,
    ecoCost,
    forceCost,
    repairCost,
    repairValue,

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
