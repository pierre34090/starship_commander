// src/libs/models/Ships/EnemyShipsStats.ts

import type { EnemyShipState } from '../../state/Ships/EnemyShipState';
import { energyCore } from '../Items/ModulesTemplates';
import { laserBlaster } from '../Items/WeaponsTemplates';

export const scout: EnemyShipState = {
  name: "Scout",
  description: "Fast but squishy",
  sprite: "/sprites/vessels/scout.png",
  baseStats: {
    baseHp: 60,
    baseShield: 15,
    baseArmor: 2,
    baseGlobalDamage: 0,
    basePrecision: 0.15,
    baseEvasion: 0.2,
  },
  currentHp: 60,
  currentShield: 15,
  currentArmor: 2,
  weapons: [laserBlaster],
  modules: [energyCore],
  behavior: 'random',
  bounty: 30,
  xp: 2,
  status: 'alive',
};

export const bomber: EnemyShipState = {
  name: "Bomber",
  description: "Slow but tanky",
  sprite: "/sprites/vessels/bomber.png",
  baseStats: {
    baseHp: 150,
    baseShield: 40,
    baseArmor: 8,
    baseGlobalDamage: 0,
    basePrecision: 0.05,
    baseEvasion: 0.05,
  },
  currentHp: 150,
  currentShield: 40,
  currentArmor: 8,
  weapons: [laserBlaster],
  modules: [energyCore],
  behavior: 'defensive',
  bounty: 60,
  xp: 4,
  status: 'alive',
};

export const raider: EnemyShipState = {
  name: "Raider",
  description: "Balanced",
  sprite: "/sprites/vessels/raider.png",
  baseStats: {
    baseHp: 100,
    baseShield: 25,
    baseArmor: 5,
    baseGlobalDamage: 0,
    basePrecision: 0.1,
    baseEvasion: 0.1,
  },
  currentHp: 100,
  currentShield: 25,
  currentArmor: 5,
  weapons: [laserBlaster],
  modules: [energyCore],
  behavior: 'aggressive',
  bounty: 50,
  xp: 3,
  status: 'alive',
};

export const allEnemyShips: EnemyShipState[] = [scout, bomber, raider];
