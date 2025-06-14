// src/hooks/useRepair.ts
import { useState, useCallback } from "react";
import type { Ship } from "../models/ships/Ship";

export interface UseRepairParams {
  playerShip: Ship;
  setPlayerShip: React.Dispatch<React.SetStateAction<Ship>>;
  money: number;
  spendMoney: (amount: number) => boolean;
}

export interface RepairResult {
  healed: number | null;
  message: string;
}

export interface UseRepairReturn {
  repairCost: number;
  repairValue: number;
  /**
   * Tente de réparer le vaisseau :
   * - Si full HP : returned.healed = null, message = "Already at full HP"
   * - Si pas assez d'argent : healed = null, message = "Not enough money to repair"
   * - Sinon : dépense, met à jour playerShip, incrémente repairCost, et returned.healed > 0, message = "Repaired X HP"
   */
  repair: () => RepairResult;
  resetRepair: () => void;
}

export function useRepair({
  playerShip,
  setPlayerShip,
  money,
  spendMoney,
}: UseRepairParams): UseRepairReturn {
  const [repairCost, setRepairCost] = useState<number>(10);
  const [repairValue, setRepairValue] = useState<number>(10);

  const repair = useCallback((): RepairResult => {
    const currentHp = playerShip.stats.hp;
    const maxHp = playerShip.stats.maxHp;

    if (currentHp >= maxHp) {
      return { healed: null, message: "Already at full HP" };
    }
    if (money < repairCost) {
      return { healed: null, message: "Not enough money to repair" };
    }
    const ok = spendMoney(repairCost);
    if (!ok) {
      return { healed: null, message: "Not enough money to repair" };
    }
    // Dépense acceptée → incrémente le coût
    setRepairCost((r) => Math.round(r * 1.5));

    // Calcul du heal
    const missing = maxHp - currentHp;
    const heal = repairValue > missing ? missing : repairValue;

    // Appliquer la réparation : on suppose que playerShip.repair(heal) renvoie nouvelle instance immutable
    const repairedShip = playerShip.repair(heal);
    // Si la méthode mute in-place, il faudrait cloner manuellement ici avant d’appeler setPlayerShip.
    setPlayerShip(repairedShip);

    return { healed: heal, message: `Repaired ${heal} HP` };
  }, [playerShip, money, repairCost, repairValue, spendMoney, setPlayerShip]);

  const resetRepair = useCallback(() => {
    setRepairCost(10);
    setRepairValue(10);
  }, []);

  return { repairCost, repairValue, repair, resetRepair };
}
