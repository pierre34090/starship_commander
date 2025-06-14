// src/hooks/useGame.ts
import { useState, useCallback } from "react";
import type { Ship } from "../models/ships/Ship";
import type { Weapon } from "../models/weapons/Weapon";

import { useCombat } from "./useCombat";
import type { FightResult } from "../types/combat";

import { useShip } from "./useShip";
import { useEconomy } from "./useEconomy";
import { useUpgradeForce } from "./useUpgradeForce";
import { useRepair, RepairResult } from "./useRepair";
import { useWeapons } from "./useWeapons";

export interface UseGameReturn {
  playerShip: Ship;
  money: number;
  scrap: number;
  income: number;
  ecoCost: number;
  forceCost: number;
  repairCost: number;
  repairValue: number;

  weapons: Array<Weapon | null>;
  weaponCost: number;

  enemy: Ship | null;
  gameOver: boolean;
  lastResult: string | null;

  shipMessage: string | null;
  generalMessage: string | null;

  upgradeEconomy: () => void;
  upgradeForce: () => void;
  handleGenerateEnemy: () => void;
  fight: () => void;
  skip: () => void;
  repair: () => void;
  handleBuyWeapon: () => void;
  restartGame: () => void;
}

export function useGame(): UseGameReturn {
  // ----- Messages UI -----
  const [shipMessage, setShipMessage] = useState<string | null>(null);
  const [generalMessage, setGeneralMessage] = useState<string | null>(null);

  // ----- Ship -----
  const { playerShip, setPlayerShip, resetShip } = useShip();

  // ----- Économie -----
  const {
    money,
    scrap,
    income,
    ecoCost,
    upgradeEconomy: upgradeEconomyRaw,
    spendMoney,
    addScrap,
    resetEconomy,
  } = useEconomy(500);

  const upgradeEconomy = useCallback(() => {
    if (money >= ecoCost) {
      upgradeEconomyRaw();
      setShipMessage(null);
      setGeneralMessage(null);
    } else {
      setShipMessage("Pas assez d'argent pour l'économie");
    }
  }, [money, ecoCost, upgradeEconomyRaw]);

  // ----- Upgrade Force -----
  const { forceCost, upgradeForce: upgradeForceRaw, resetUpgradeForce } = useUpgradeForce({
    spendMoney,
  });
  const upgradeForce = useCallback(() => {
    const msg = upgradeForceRaw();
    if (msg === "Attack increased") {
      setPlayerShip((ps) => ps.updateStats({ attack: ps.stats.attack + 1 }));
    }
    setShipMessage(msg);
    setGeneralMessage(null);
  }, [upgradeForceRaw, setPlayerShip]);

  // ----- Réparation -----
  
  const { repairCost, repairValue, repair: repairRaw, resetRepair } = useRepair({
    playerShip,
    setPlayerShip,
    money,
    spendMoney,
  });
  const repair = useCallback(() => {
    const result: RepairResult = repairRaw();
    setShipMessage(result.message);
    setGeneralMessage(null);
  }, [repairRaw]);

  // ----- Armes -----
  const { weapons, weaponCost, buyWeapon: buyWeaponRaw, resetWeapons } = useWeapons({
    money,
    spendMoney,
  });
  const handleBuyWeapon = useCallback(() => {
    buyWeaponRaw(
      (weapon) => {
        setGeneralMessage(`Vous avez obtenu : ${weapon.name}`);
        setShipMessage(null);
      },
      (reason) => {
        setGeneralMessage(reason);
        setShipMessage(null);
      }
    );
  }, [buyWeaponRaw]);

  // ----- Combat -----
  const {
    enemy,
    lastResult,
    gameOver,
    generateEnemy,
    fight: combatFight,
    skip: combatSkip,
    resetCombat,
  } = useCombat();

  const handleGenerateEnemy = useCallback(() => {
    generateEnemy();
    setGeneralMessage(null);
    setShipMessage(null);
  }, [generateEnemy]);

  const fight = useCallback(() => {
    const result: FightResult | null = combatFight(playerShip);
    if (!result) {
      return;
    }
    const { newPlayer, scrapGain } = result;
    setPlayerShip(newPlayer);
    if (scrapGain) {
      addScrap(scrapGain);
    }
    setGeneralMessage(null);
    setShipMessage(null);
  }, [combatFight, playerShip, addScrap, setPlayerShip]);

  const skip = useCallback(() => {
    const msg = combatSkip();
    if (msg) {
      setGeneralMessage(null);
      setShipMessage(null);
    }
  }, [combatSkip]);

  // ----- restartGame -----
  const restartGame = useCallback(() => {
    resetShip();
    resetEconomy();
    resetUpgradeForce();
    resetRepair();
    resetWeapons();
    resetCombat();
    setShipMessage(null);
    setGeneralMessage(null);
  }, [
    resetShip,
    resetEconomy,
    resetUpgradeForce,
    resetRepair,
    resetWeapons,
    resetCombat,
  ]);

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
