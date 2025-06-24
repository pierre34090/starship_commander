// src/libs/state/Ships/EnemyShipState.ts

// src/libs/state/Ships/EnemyShipState.ts

import { type ShipState, initShipState } from './ShipState';

export type EnemyStatus = 'alive' | 'dead' | 'skipped';

export type EnemyShipState = {
  ship: ShipState;
  behavior: 'aggressive' | 'defensive' | 'random';
  bounty: number;
  xp: number;
  status: EnemyStatus;
};


export const initEnemyShipState = (): EnemyShipState => ({
  ship: initShipState(),
  behavior: 'random',
  bounty: 0,
  xp: 0,
  status: 'alive',
});
