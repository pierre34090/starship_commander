// src/libs/models/Ships/PlayerShipsStats.ts

import type { PlayerShipState } from '../../state/Ships/PlayerShipState';
import { createWeaponInstance } from '../factories/WeaponFactory';
import { energyCore } from '../Items/ModulesTemplates';
import { laserBlaster, plasmaBomb } from '../Items/WeaponsTemplates';
import { defaultSubsystems } from '../../state/Ships/ShipSystems';

export const kestrel: PlayerShipState = {
  ship: {
    name: "Kestrel",
    description: "Classic fighter.",
    sprite: "/sprites/vessels/kestrel.png",
    baseStats: {
      baseHp: 300,
      baseShield: 50,
      baseArmor: 10,
      baseGlobalDamage: 0,
      basePrecision: 0.9,
      baseEvasion: 0.05,
    },
    currentHp: 300,
    currentShield: 50,
    currentArmor: 10,
    currentAmmo: 10,
    weapons: [
      createWeaponInstance(laserBlaster),
      createWeaponInstance(plasmaBomb),
    ],
    modules: [energyCore], // idem, factory possible pour modules si besoin
    subsystems: defaultSubsystems(),
    statusEffects: [],
  },
  xp: 0,
  level: 1,
};

export const falcon: PlayerShipState = {
  ship: {
    name: "Falcon",
    description: "Fast and fragile.",
    sprite: "/sprites/vessels/player_ship.png",
    baseStats: {
      baseHp: 150,
      baseShield: 30,
      baseArmor: 3,
      baseGlobalDamage: 0,
      basePrecision: 0.2,
      baseEvasion: 0.2,
    },
    currentHp: 150,
    currentShield: 30,
    currentArmor: 3,
    currentAmmo: 0,
    weapons: [
      createWeaponInstance(laserBlaster),
    ],
    modules: [energyCore],
    subsystems: defaultSubsystems(),
    statusEffects: [],
  },
  xp: 0,
  level: 1,
};

export const allPlayerShips: PlayerShipState[] = [kestrel, falcon];
