// src/hooks/useShip.ts
import { useState, useCallback } from "react";
import { Player_ship } from "../models/ships/playable_ship/Player_ship";
import type { Ship } from "../models/ships/Ship";

export interface UseShipReturn {
  playerShip: Ship;
  setPlayerShip: React.Dispatch<React.SetStateAction<Ship>>;
  resetShip: () => void;
}

export function useShip(): UseShipReturn {
  const [playerShip, setPlayerShip] = useState<Ship>(() => new Player_ship());

  const resetShip = useCallback(() => {
    setPlayerShip(new Player_ship());
  }, []);

  return { playerShip, setPlayerShip, resetShip };
}
