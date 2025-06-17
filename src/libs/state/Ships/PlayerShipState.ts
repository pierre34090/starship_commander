//src/libs/state/Ships/PlayerShipState.ts

import { ShipState } from './ShipState';

export type PlayerShipState = ShipState & {
  xp: number;
  level: number;
};

export const initPlayerShipState = (): PlayerShipState => ({
  name: '',
  description: '',
  sprite: '',
  hp: 0,
  maxHp: 0,
  attack: 0,
  defense: 0,
  weapons: [],
  xp: 0,
  level: 0,
});