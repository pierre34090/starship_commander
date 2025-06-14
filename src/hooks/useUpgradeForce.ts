// src/hooks/useUpgradeForce.ts
import { useState, useCallback } from "react";

export interface UseUpgradeForceParams {
  /**
   * Fonction pour déduire l'argent.
   * Doit retourner true si la dépense est validée (et déduire l'argent), false sinon.
   */
  spendMoney: (amount: number) => boolean;
}

export interface UseUpgradeForceReturn {
  /**
   * Coût actuel pour la prochaine upgrade d'attaque.
   */
  forceCost: number;
  /**
   * Tente d'upgrader l'attaque : 
   * - si spendMoney(forceCost) renvoie true, incrémente le coût pour la prochaine fois et retourne "Attack increased"
   * - sinon retourne "Pas assez d'argent pour augmenter l'attaque"
   */
  upgradeForce: () => string;
  /**
   * Remet le coût à la valeur initiale (20).
   */
  resetUpgradeForce: () => void;
}

/**
 * Hook gérant uniquement le coût d'upgrade d'attaque.
 * Ne met pas à jour playerShip directement, mais retourne un message et a déduit l'argent via spendMoney.
 */
export function useUpgradeForce({
  spendMoney,
}: UseUpgradeForceParams): UseUpgradeForceReturn {
  const [forceCost, setForceCost] = useState<number>(20);

  const upgradeForce = useCallback((): string => {
    if (spendMoney(forceCost)) {
      // la dépense a réussi, on augmente le coût pour la prochaine fois
      setForceCost((c) => Math.round(c * 1.8));
      return "Attack increased";
    } else {
      return "Pas assez d'argent pour augmenter l'attaque";
    }
  }, [spendMoney, forceCost]);

  const resetUpgradeForce = useCallback(() => {
    setForceCost(20);
  }, []);

  return { forceCost, upgradeForce, resetUpgradeForce };
}
