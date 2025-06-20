// src/libs/models/Ships/PlayerShipsStats.ts

import type { PlayerShipState } from '../../state/Ships/PlayerShipState';

export const kestrel: PlayerShipState = {
  name: "Kestrel",
  description: "Inspiration isn't copying",
  sprite: "/sprites/vessels/kestrel.png",
  hp: 300,
  maxHp: 300,
  attack: 20,
  defense: 10,
  weapons: [],
  xp: 0,
  level: 1,
};

export const falcon: PlayerShipState = {
  name: "Falcon",
  description: "Fast and fragile.",
  sprite: "/sprites/vessels/player_ship.png",
  hp: 150,
  maxHp: 150,
  attack: 2000,
  defense: 3,
  weapons: [],
  xp: 0,
  level: 1,
};


export const allPlayerShips: PlayerShipState[] = [kestrel, falcon];
