// src/hooks/useShip.ts
import { useState, useCallback } from "react";
import { Player_ship } from "../models/ships/playable_ship/Player_ship";
import type { Ship } from "../models/ships/Ship";

export interface UseShipReturn {
  playerShip: Ship;
  setPlayerShip: React.Dispatch<React.SetStateAction<Ship>>;
  upgradeForce: () => void;
  resetShip: () => void;
}

export function useShip(): UseShipReturn {
  const [playerShip, setPlayerShip] = useState<Ship>(() => new Player_ship());

  // Upgrade de l’attaque (force)
  const upgradeForce = useCallback(() => {
    // Hypothèse : on voudrait peut-être vérifier de l’argent ailleurs
    setPlayerShip((ps) => ps.updateStats({ attack: ps.stats.attack + 1 }));
  }, []);

  const resetShip = useCallback(() => {
    setPlayerShip(new Player_ship());
  }, []);

  return { playerShip, setPlayerShip, upgradeForce, resetShip };
}
