// src/hooks/useEconomy.ts
import { useState, useEffect, useCallback } from "react";

export interface UseEconomyReturn {
  money: number;
  scrap: number;
  income: number;
  ecoCost: number;
  // actions
  upgradeEconomy: () => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean; // retourne vrai si dépense possible
  addScrap: (amount: number) => void;
  resetEconomy: () => void;
}

export function useEconomy(initialMoney = 500): UseEconomyReturn {
  const [money, setMoney] = useState<number>(initialMoney);
  const [scrap, setScrap] = useState<number>(0);
  const [income, setIncome] = useState<number>(1);
  const [ecoCost, setEcoCost] = useState<number>(15);

  // Revenu passif toutes les 250ms : on peut garder ici, ou modifier intervalle
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((m) => m + income * 0.25);
    }, 250);
    return () => clearInterval(interval);
  }, [income]);

  const addMoney = useCallback((amount: number) => {
    setMoney((m) => m + amount);
  }, []);

  const spendMoney = useCallback((amount: number): boolean => {
    let ok = false;
    setMoney((m) => {
      if (m >= amount) {
        ok = true;
        return m - amount;
      } else {
        ok = false;
        return m;
      }
    });
    return ok;
  }, []);

  const addScrap = useCallback((amount: number) => {
    setScrap((s) => s + amount);
  }, []);

  const upgradeEconomy = useCallback(() => {
    // Si la logique veut vérifier money >= ecoCost, on peut :
    setMoney((m) => {
      if (m >= ecoCost) {
        // On fait la dépense
        setIncome((i) => Math.round(i * 1.5));
        setEcoCost((c) => Math.round(c * 2));
        return m - ecoCost;
      } else {
        // Pas assez, on ne change pas money
        return m;
      }
    });
  }, [ecoCost]);

  const resetEconomy = useCallback(() => {
    setMoney(initialMoney);
    setScrap(0);
    setIncome(1);
    setEcoCost(15);
  }, [initialMoney]);

  return {
    money,
    scrap,
    income,
    ecoCost,
    upgradeEconomy,
    addMoney,
    spendMoney,
    addScrap,
    resetEconomy,
  };
}
