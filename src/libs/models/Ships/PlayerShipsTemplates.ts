// src/libs/models/Ships/PlayerShipsStats.ts

import type { PlayerShipState } from '../../state/Ships/PlayerShipState';
import { energyCore } from '../Items/ModulesTemplates';
import { laserBlaster } from '../Items/WeaponsTemplates';

export const kestrel: PlayerShipState = {
  name: "Kestrel",
  description: "Classic fighter.",
  sprite: "/sprites/vessels/kestrel.png",
  baseStats: {
    baseHp: 300,
    baseShield: 50,
    baseArmor: 10,
    baseGlobalDamage: 0,
    basePrecision: 0.1,
    baseEvasion: 0.05,
  },
  currentHp: 300,
  currentShield: 50,
  currentArmor: 10,
  weapons: [laserBlaster],
  modules: [energyCore],
  xp: 0,
  level: 1,
};

export const falcon: PlayerShipState = {
  name: "Falcon",
  description: "Fast and fragile.",
  sprite: "/sprites/vessels/player_ship.png",
  baseStats: {
    baseHp: 150,
    baseShield: 30,
    baseArmor: 3,
    baseGlobalDamage: 0,
    basePrecision: 0.2,
    baseEvasion: 0.2,
  },
  currentHp: 150,
  currentShield: 30,
  currentArmor: 3,
  weapons: [laserBlaster],
  modules: [energyCore],
  xp: 0,
  level: 1,
};

export const allPlayerShips: PlayerShipState[] = [kestrel, falcon];
