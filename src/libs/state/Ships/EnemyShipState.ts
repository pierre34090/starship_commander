//src/libs/state/Ships/EnemyShipState.ts

import type { ShipState } from './ShipState';

export type EnemyStatus = 'alive' | 'dead' | 'skipped';

export type EnemyShipState = ShipState & {
  behavior: 'aggressive' | 'defensive' | 'random';
  bounty: number;
  xp: number;
  status: EnemyStatus
};

export const initEnemyShipState = (): EnemyShipState => ({
  name: '',
  description: '',
  sprite: '',
  status: 'alive' as EnemyStatus,
  hp: 0,
  maxHp: 0,
  attack: 0,
  defense: 0,
  weapons: [],
  behavior: 'random',
  bounty: 0,
  xp: 0,
});