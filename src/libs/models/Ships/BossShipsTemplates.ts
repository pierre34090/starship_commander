// src/libs/models/Ships/BossShipStats.ts

import type { BossShipState } from '../../state/Ships/BossShipState';
import type { EnemyStatus } from '../../state/Ships/EnemyShipState';

export const dreadnought: BossShipState = {
  name: "Dreadnought",
  description: "Massive heavily armored boss",
  sprite: "/sprites/vessels/dreadnought.png",
  status: 'alive' as EnemyStatus,
  hp: 500,
  maxHp: 500,
  attack: 25,
  defense: 15,
  weapons: [],
  behavior: 'aggressive',
  bounty: 500,
  xp: 10,
};

export const judge: BossShipState = {
  name: "Judge",
  description: "The power of justice",
  sprite: "/sprites/vessels/judge.png",
  status: 'alive' as EnemyStatus,
  hp: 500,
  maxHp: 500,
  attack: 25,
  defense: 15,
  weapons: [],
  behavior: 'aggressive',
  bounty: 500,
  xp: 15,
};

export const herald: BossShipState = {
  name: "Herald",
  description: "It will be a problem",
  sprite: "/sprites/vessels/herald.png",
  status: 'alive' as EnemyStatus,
  hp: 500,
  maxHp: 500,
  attack: 25,
  defense: 15,
  weapons: [],
  behavior: 'aggressive',
  bounty: 500,
  xp: 20,
};

export const allBossShips: BossShipState[] = [dreadnought, judge, herald];

