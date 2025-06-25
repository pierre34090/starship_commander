import type { ShipState } from '../../state/Ships/ShipState';
import { createEnemyShipState } from '../../state/Ships/ShipFactory';

import { createWeaponInstance } from '../Items/WeaponFactory';
import { createModuleInstance } from '../Items/ModuleFactory';
import { energyCore } from '../Items/ModulesTemplates';
import { laserBlaster, plasmaBomb } from '../Items/WeaponsTemplates';
import { createSubsystems } from '../../state/Ships/ShipSubsystems';
import { createShipBaseState } from '../../state/Ships/ShipBaseState';

export const scout: ShipState = createEnemyShipState({
  name: "Scout",
  description: "Fast but squishy",
  sprite: "/sprites/vessels/scout.png",
  baseStats: createShipBaseState({
    baseHp: 60,
    baseShield: 15,
    baseArmor: 2,
    baseGlobalDamage: 0,
    basePrecision: 0.9,
    baseEvasion: 0.2,
  }),
  currentHp: 60,
  currentShield: 15,
  currentArmor: 2,
  currentAmmo: 100,
  weapons: [
    createWeaponInstance(laserBlaster),
    createWeaponInstance(plasmaBomb),
  ],
  modules: [
    createModuleInstance(energyCore),
  ],
  subsystems: createSubsystems(),
  statusEffects: [],
  behavior: 'random',
  creditsBounty: 30,
  xpBounty: 2,
  status: 'alive',
});

export const bomber: ShipState = createEnemyShipState({
  name: "Bomber",
  description: "Slow but tanky",
  sprite: "/sprites/vessels/bomber.png",
  baseStats: createShipBaseState({
    baseHp: 150,
    baseShield: 40,
    baseArmor: 8,
    baseGlobalDamage: 0,
    basePrecision: 0.05,
    baseEvasion: 0.05,
  }),
  currentHp: 150,
  currentShield: 40,
  currentArmor: 8,
  currentAmmo: 100,
  weapons: [
    createWeaponInstance(laserBlaster),
  ],
  modules: [
    createModuleInstance(energyCore),
  ],
  subsystems: createSubsystems(),
  statusEffects: [],
  behavior: 'defensive',
  creditsBounty: 60,
  xpBounty: 4,
  status: 'alive',
});

export const raider: ShipState = createEnemyShipState({
  name: "Raider",
  description: "Balanced",
  sprite: "/sprites/vessels/raider.png",
  baseStats: createShipBaseState({
    baseHp: 100,
    baseShield: 25,
    baseArmor: 5,
    baseGlobalDamage: 0,
    basePrecision: 0.1,
    baseEvasion: 0.1,
  }),
  currentHp: 100,
  currentShield: 25,
  currentArmor: 5,
  currentAmmo: 0,
  weapons: [
    createWeaponInstance(laserBlaster),
  ],
  modules: [
    createModuleInstance(energyCore),
  ],
  subsystems: createSubsystems(),
  statusEffects: [],
  behavior: 'aggressive',
  creditsBounty: 50,
  xpBounty: 3,
  status: 'alive',
});

export const allEnemyShips: ShipState[] = [scout, bomber, raider];
