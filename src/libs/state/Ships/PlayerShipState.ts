// src/libs/state/Ships/PlayerShipState.ts

import type { ShipState } from './ShipState';
import { initShipState } from './ShipState';

export type PlayerShipState = {
  ship: ShipState;
  xp: number;
  level: number;
};

export const initPlayerShipState = (): PlayerShipState => ({
  ship: initShipState(),
  xp: 0,
  level: 1,
});