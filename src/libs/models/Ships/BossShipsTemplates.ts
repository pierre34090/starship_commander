// src/libs/models/Ships/BossShipStats.ts

import type { BossShipState } from '../../state/Ships/BossShipState';

export const finalBoss: BossShipState = {
  name: "Dreadnought",
  description: "Massive heavily armored boss",
  sprite: "/sprites/vessels/dreadnought.png",
  hp: 500,
  maxHp: 500,
  attack: 25,
  defense: 15,
  weapons: [],
  behavior: 'aggressive',
  bounty: 500,
};

export const allBossShips: BossShipState[] = [finalBoss];

