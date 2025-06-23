// src/libs/state/Ships/PlayerShipState.ts

import type { ShipState } from './ShipState';

export type PlayerShipState = ShipState & {
  xp: number;
  level: number;
};

export const initPlayerShipState = (): PlayerShipState => ({
  name: '',
  description: '',
  sprite: '',
  baseStats: {
    baseHp: 0,
    baseShield: 0,
    baseArmor: 0,
    baseGlobalDamage: 0,
    basePrecision: 0,
    baseEvasion: 0,
  },
  currentHp: 0,
  currentShield: 0,
  currentArmor: 0,
  weapons: [],
  modules: [],
  xp: 0,
  level: 1,
});