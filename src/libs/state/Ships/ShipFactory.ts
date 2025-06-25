// ShipFactory.ts

import { createShipState, type ShipState } from './ShipState';

export function createPlayerShipState(overrides: Partial<ShipState> = {}): ShipState {
  return createShipState({
    ...overrides,
    role: 'player',
    xp: overrides.xp ?? 0,
    level: overrides.level ?? 1,
  });
}

export function createEnemyShipState(overrides: Partial<ShipState> = {}): ShipState {
  return createShipState({
    ...overrides,
    role: 'enemy',
    behavior: overrides.behavior ?? 'random',
    status: overrides.status ?? 'alive',
    xpBounty: overrides.xpBounty ?? 0,
    creditsBounty: overrides.creditsBounty ?? 0,
  });
}

export function createBossShipState(overrides: Partial<ShipState> = {}): ShipState {
  return createEnemyShipState({
    ...overrides,
    role: 'boss',
  });
}
