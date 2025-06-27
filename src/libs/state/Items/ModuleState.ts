// src/libs/state/Items/ModuleState.ts

import { v4 as uuidv4 } from 'uuid';
import type { BaseModuleBonuses } from './ModuleBonuses';

export type ModuleState = {
  id: string;
  name: string;
  description: string;
  sprite: string;

  price: number;
  isActive: boolean;
  energyConsumption: number;

  bonuses?: BaseModuleBonuses;
};

export const defaultModule: Omit<ModuleState, 'id'> = {
  name: '',
  description: '',
  sprite: '',
  price: 0,
  isActive: false,
  energyConsumption: 0,
  bonuses: undefined,
};

/**
 * Factory to create a ModuleState with optional overrides and auto-generated ID.
 */
export function createModuleState(
  overrides: Partial<ModuleState> = {}
): ModuleState {
  return {
    id: overrides.id ?? uuidv4(),
    ...defaultModule,
    ...overrides,
  };
}