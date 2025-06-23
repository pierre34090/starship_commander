// src/libs/state/Ships/EnemyShipState.ts

import type { ShipState } from './ShipState';

export type EnemyStatus = 'alive' | 'dead' | 'skipped';

export type EnemyShipState = ShipState & {
  behavior: 'aggressive' | 'defensive' | 'random';
  bounty: number;
  xp: number;
  status: EnemyStatus;
};

export const initEnemyShipState = (): EnemyShipState => ({
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
  behavior: 'random',
  bounty: 0,
  xp: 0,
  status: 'alive',
});
