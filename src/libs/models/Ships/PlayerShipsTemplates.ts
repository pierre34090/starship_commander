// src/libs/models/Ships/PlayerShipsTemplates.ts

import { type PlayerShipState, createPlayerShipState } from '../../state/Ships/PlayerShipState';
import { createWeaponInstance } from '../Items/WeaponFactory';
import { createModuleInstance } from '../Items/ModuleFactory';
import { energyCore } from '../Items/ModulesTemplates';
import { laserBlaster, plasmaBomb } from '../Items/WeaponsTemplates';
import { createSubsystems } from '../../state/Ships/ShipSystems';
import { createShipBaseState } from '../../state/Ships/ShipBaseState';

export const kestrel: PlayerShipState = createPlayerShipState({
  ship: {
    name: "Kestrel",
    description: "Classic fighter.",
    sprite: "/sprites/vessels/kestrel.png",
    baseStats: createShipBaseState({
      baseHp: 300,
      baseShield: 50,
      baseArmor: 10,
      baseGlobalDamage: 0,
      basePrecision: 0.9,
      baseEvasion: 0.05,
    }),
    currentHp: 300,
    currentShield: 50,
    currentArmor: 10,
    currentAmmo: 1000,
    weapons: [
      createWeaponInstance(laserBlaster),
      createWeaponInstance(plasmaBomb),
    ],
    modules: [
      createModuleInstance(energyCore),
    ],
    subsystems: createSubsystems(),
    statusEffects: [],
  },
  xp: 0,
  level: 1,
});

export const falcon: PlayerShipState = createPlayerShipState({
  ship: {
    name: "Falcon",
    description: "Fast and fragile.",
    sprite: "/sprites/vessels/player_ship.png",
    baseStats: createShipBaseState({
      baseHp: 150,
      baseShield: 30,
      baseArmor: 3,
      baseGlobalDamage: 0,
      basePrecision: 0.2,
      baseEvasion: 0.2,
    }),
    currentHp: 150,
    currentShield: 30,
    currentArmor: 3,
    currentAmmo: 100,
    weapons: [
      createWeaponInstance(laserBlaster),
    ],
    modules: [
      createModuleInstance(energyCore),
    ],
    subsystems: createSubsystems(),
    statusEffects: [],
  },
  xp: 0,
  level: 1,
});

export const allPlayerShips: PlayerShipState[] = [kestrel, falcon];