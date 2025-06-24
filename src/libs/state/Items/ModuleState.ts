// src/libs/state/Items/ModuleState.ts

import type { BaseModuleBonuses } from './ModuleBonuses';

export type ModuleState = {
  name: string;
  description: string;
  sprite: string;

  price: number;
  isActive: boolean;
  energyConsumption: number;

  bonuses?: BaseModuleBonuses;
};

export const initModuleState = (): ModuleState => ({
  name: '',
  description: '',
  sprite: '',
  price: 0,
  isActive: false,
  energyConsumption: 0,
});
