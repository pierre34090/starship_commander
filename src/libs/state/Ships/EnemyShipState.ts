//src/libs/state/Ships/EnemyShipState.ts

import type { ShipState } from './ShipState';

export type EnemyShipState = ShipState & {
  behavior: 'aggressive' | 'defensive' | 'random';
  bounty: number;
};

export const initEnemyShipState = (): EnemyShipState => ({
  name: '',
  description: '',
  sprite: '',
  hp: 0,
  maxHp: 0,
  attack: 0,
  defense: 0,
  weapons: [],
  behavior: 'random',
  bounty: 0,
});