// src/libs/models/Items/ModulesTemplates.ts

import type { ModuleState } from '../../state/Items/ModuleState';

export const energyCore: ModuleState = {
  name: "Energy Core Mk.II",
  description: "Increases energy production and capacity.",
  sprite: "/sprites/modules/energyCore.png",
  price: 120,
  isActive: true,
  energyConsumption: 0,
  energyGenerationFlat: 2,
  energyCapacityFlat: 10,
};

export const deflectorShield: ModuleState = {
  name: "Deflector Shield",
  description: "Adds flat and % defense bonus. Requires energy to operate.",
  sprite: "/sprites/modules/energyCore.png",
  price: 180,
  isActive: true,
  energyConsumption: 2,
  armorFlat: 4,
  armorMult: 0.2,
};

export const nanoHull: ModuleState = {
  name: "Nanofiber Hull",
  description: "Improves HP and armor passively.",
  sprite: "/sprites/modules/energyCore.png",
  price: 200,
  isActive: false,
  energyConsumption: 0,
  hpFlat: 15,
  armorFlat: 3,
};

export const targetingAI: ModuleState = {
  name: "Targeting AI",
  description: "Improves attack precision and elemental effect chance.",
  sprite: "/sprites/modules/energyCore.png",
  price: 100,
  isActive: true,
  energyConsumption: 1,
  precisionMult: 0.25,
  elementalEffectProbabilityFlat: 0.1,
};

export const recyclingUnit: ModuleState = {
  name: "Recycling Unit",
  description: "Boosts income and reduces repair cost.",
  sprite: "/sprites/modules/energyCore.png",
  price: 150,
  isActive: true,
  energyConsumption: 1,
};
