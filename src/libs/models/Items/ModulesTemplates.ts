// src/libs/models/Items/ModulesTemplates.ts

import { createModuleInstance } from '../Items/ModuleFactory';

export const energyCore = createModuleInstance({
  name: "Energy Core Mk.II",
  description: "Increases energy production and capacity.",
  sprite: "/sprites/modules/energyCore.png",
  price: 120,
  isActive: true,
  energyConsumption: 0,

  bonuses: {
    maxEnergy: { flat: 10, mult: 0 },
    regenAmmo: { flat: 2, mult: 0 },
    maxAmmo: { flat: 300, mult: 0 },

    elementalDamage: {
      ion: { flat: 5, mult: 0 },
      corrosive: { flat: 0, mult: 0 },
      fire: { flat: 5, mult: 0 },
    },
    elementalEffectDuration: {
      ion: { flat: 6, mult: 0 },
      corrosive: { flat: 0, mult: 0 },
      fire: { flat: 6, mult: 0 },
    },
  },
});