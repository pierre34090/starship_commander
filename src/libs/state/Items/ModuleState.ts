import { v4 as uuidv4 } from 'uuid';
import type { BaseModuleBonuses } from './ModuleBonuses';

export type ModuleState = {
  id: string;                 // Identifiant unique
  name: string;
  description: string;
  sprite: string;

  price: number;
  isActive: boolean;
  energyConsumption: number;

  bonuses?: BaseModuleBonuses;
};

/**
 * Factory pour créer un ModuleState avec valeurs par défaut et id généré.
 */
export function createModuleState(
  overrides: Partial<ModuleState> = {}
): ModuleState {
  return {
    id: overrides.id ?? uuidv4(),
    name: overrides.name ?? '',
    description: overrides.description ?? '',
    sprite: overrides.sprite ?? '',
    price: overrides.price ?? 0,
    isActive: overrides.isActive ?? false,
    energyConsumption: overrides.energyConsumption ?? 0,
    bonuses: overrides.bonuses,
  };
}
