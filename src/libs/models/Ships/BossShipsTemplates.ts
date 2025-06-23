// src/libs/models/Ships/BossShipStats.ts

import type { BossShipState } from '../../state/Ships/BossShipState';
import { energyCore } from '../Items/ModulesTemplates';
import { laserBlaster } from '../Items/WeaponsTemplates';

export const dreadnought: BossShipState = {
  name: "Dreadnought",
  description: "Massive heavily armored boss",
  sprite: "/sprites/vessels/dreadnought.png",
  baseStats: {
    baseHp: 500,
    baseShield: 100,
    baseArmor: 15,
    baseGlobalDamage: 0,
    basePrecision: 0.1,
    baseEvasion: 0.05,
  },
  currentHp: 500,
  currentShield: 100,
  currentArmor: 15,
  weapons: [laserBlaster],
  modules: [energyCore],
  behavior: 'aggressive',
  bounty: 500,
  xp: 10,
  status: 'alive',
};

export const judge: BossShipState = {
  name: "Judge",
  description: "The power of justice",
  sprite: "/sprites/vessels/judge.png",
  baseStats: {
    baseHp: 500,
    baseShield: 100,
    baseArmor: 15,
    baseGlobalDamage: 0,
    basePrecision: 0.15,
    baseEvasion: 0.05,
  },
  currentHp: 500,
  currentShield: 100,
  currentArmor: 15,
  weapons: [laserBlaster],
  modules: [energyCore],
  behavior: 'aggressive',
  bounty: 500,
  xp: 15,
  status: 'alive',
};

export const herald: BossShipState = {
  name: "Herald",
  description: "It will be a problem",
  sprite: "/sprites/vessels/herald.png",
  baseStats: {
    baseHp: 500,
    baseShield: 100,
    baseArmor: 15,
    baseGlobalDamage: 0,
    basePrecision: 0.12,
    baseEvasion: 0.07,
  },
  currentHp: 500,
  currentShield: 100,
  currentArmor: 15,
  weapons: [laserBlaster],
  modules: [energyCore],
  behavior: 'aggressive',
  bounty: 500,
  xp: 20,
  status: 'alive',
};

export const allBossShips: BossShipState[] = [dreadnought, judge, herald];
