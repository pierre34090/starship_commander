// src/hooks/useWeapons.ts
import { useState, useCallback } from "react";
import { generateRandomWeapon } from "../logic/generate_weapon";
import type { Weapon } from "../models/weapons/Weapon";

export interface UseWeaponsParams {
  money: number;
  spendMoney: (amount: number) => boolean;
}

export interface UseWeaponsReturn {
  weapons: Array<Weapon | null>;
  weaponCost: number;
  buyWeapon: (
    onSuccess?: (weapon: Weapon) => void,
    onFailure?: (reason: string) => void
  ) => void;
  resetWeapons: () => void;
}

export function useWeapons({
  money,
  spendMoney,
}: UseWeaponsParams): UseWeaponsReturn {
  const [weapons, setWeapons] = useState<Array<Weapon | null>>([null, null, null]);
  const [weaponCost, setWeaponCost] = useState<number>(100);

  const buyWeapon = useCallback(
    (onSuccess, onFailure) => {
      const firstEmptyIndex = weapons.findIndex((w) => w === null);
      if (firstEmptyIndex === -1) {
        onFailure?.("Tous les emplacements d'armes sont pleins");
        return;
      }
      if (!spendMoney(weaponCost)) {
        onFailure?.("Pas assez d'argent pour acheter une arme");
        return;
      }
      setWeaponCost((c) => Math.round(c * 1.5));
      const newWeapon = generateRandomWeapon();
      setWeapons((prev) => {
        const copy = [...prev];
        copy[firstEmptyIndex] = newWeapon;
        return copy;
      });
      onSuccess?.(newWeapon);
    },
    [weapons, weaponCost, spendMoney]
  );

  const resetWeapons = useCallback(() => {
    setWeapons([null, null, null]);
    setWeaponCost(100);
  }, []);

  return { weapons, weaponCost, buyWeapon, resetWeapons };
}
