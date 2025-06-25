// src/libs/state/Ships/PlayerShipState.ts

import type { ShipState } from './ShipState';
import { createShipState } from './ShipState';

export type PlayerShipState = {
  ship: ShipState;
  xp: number;
  level: number;
};

/**
 * Factory to create a PlayerShipState with optional overrides and defaults.
 */
export function createPlayerShipState(
  overrides: {
    ship?: Partial<ShipState>;
    xp?: number;
    level?: number;
  } = {}
): PlayerShipState {
  return {
    ship: createShipState(overrides.ship ?? {}),
    xp: overrides.xp ?? 0,
    level: overrides.level ?? 1,
  };
}