// src/libs/models/Items/ModulesTemplates.ts

import type { ModuleState } from '../../state/Items/ModuleState';

export const energyCore: ModuleState = {
  name: "Energy Core Mk.II",
  description: "Increases energy production and capacity.",
  sprite: "/sprites/modules/energyCore.png",
  price: 120,
  isActive: true,
  energyConsumption: 0,

  bonuses: {
    maxEnergy: { flat: 10 },
    regenAmmo: { flat: 2 },

    elementalDamage: {
      ion: { flat: 5 },
      corrosive: {},
      explosive: { flat: 5},
    },
    elementalEffectDuration: {
      ion: { flat: 3 },
      corrosive: {},
      explosive: {flat: 6},
    },
  },
};