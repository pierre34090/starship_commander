import { createWeaponInstance } from '../factories/WeaponFactory';
import { laserBlaster, plasmaBomb } from '../Items/WeaponsTemplates';
import { energyCore } from '../Items/ModulesTemplates';
import { defaultSubsystems } from '../../state/Ships/ShipSystems';

export const scout: EnemyShipState = {
  ship: {
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
    currentAmmo: 0,
    weapons: [
      createWeaponInstance(laserBlaster),
      createWeaponInstance(plasmaBomb),
    ],
    modules: [energyCore], // À faire aussi si tu veux id unique pour modules
    subsystems: defaultSubsystems(),
    statusEffects: [],
  },
  behavior: 'random',
  bounty: 30,
  xp: 2,
  status: 'alive',
};
