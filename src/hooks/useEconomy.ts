// src/hooks/useEconomy.ts
import { useState, useEffect, useCallback } from "react";

export interface UseEconomyReturn {
  money: number;
  scrap: number;
  income: number;
  ecoCost: number;

  upgradeEconomy: () => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  addScrap: (amount: number) => void;
  resetEconomy: () => void;
}

export function useEconomy(initialMoney = 500): UseEconomyReturn {
  const [money, setMoney] = useState<number>(initialMoney);
  const [scrap, setScrap] = useState<number>(0);
  const [income, setIncome] = useState<number>(1);
  const [ecoCost, setEcoCost] = useState<number>(15);

  // Revenu passif : 0.25 * income toutes les 250ms
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
    if (money >= amount) {
      setMoney(money - amount);
      return true;
    } else {
      return false;
    }
  }, [money]);

  const addScrap = useCallback((amount: number) => {
    setScrap((s) => s + amount);
  }, []);

  const upgradeEconomy = useCallback(() => {
    // La vérification de l'argent est faite dans useGame wrapper
    setIncome((i) => Math.round(i * 1.5));
    setEcoCost((c) => Math.round(c * 2));
  }, []);

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
