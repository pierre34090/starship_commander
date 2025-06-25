// src/libs/state/Ships/EnemyShipState.ts

import { type ShipState, createShipState } from './ShipState';

export type EnemyStatus = 'alive' | 'dead' | 'skipped';

export type EnemyShipState = {
  ship: ShipState;
  behavior: 'aggressive' | 'defensive' | 'random';
  bounty: number;
  xp: number;
  status: EnemyStatus;
};

/**
 * Factory to create an EnemyShipState with optional overrides.
 * Same pattern as createPlayerShipState.
 */
export function createEnemyShipState(
  overrides: {
    ship?: Partial<ShipState>;
    behavior?: 'aggressive' | 'defensive' | 'random';
    bounty?: number;
    xp?: number;
    status?: EnemyStatus;
  } = {}
): EnemyShipState {
  return {
    ship: createShipState(overrides.ship ?? {}),
    behavior: overrides.behavior ?? 'random',
    bounty: overrides.bounty ?? 0,
    xp: overrides.xp ?? 0,
    status: overrides.status ?? 'alive',
  };
}
