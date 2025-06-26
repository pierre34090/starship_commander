// src/libs/state/Items/WeaponState.ts

import type { DamageType } from '../../logic/combat/DamageType';
import type { SubsystemType } from '../Ships/ShipSubsystems';

export type WeaponState = {
  id: string;
  name: string;
  description: string;
  sprite: string;

  price: number;

  isActive: boolean;
  target?: {
    shipId: string;
    subsystem: SubsystemType;
  };

  damage: number;
  cooldown: number;              // cooldown duration (in rounds)
  cooldownRemaining: number;    // turns left before this weapon can fire

  type: DamageType;
  ammoConsumption: number;
  energyConsumption: number;
  elementalEffectProbability: number;
};

/**
 * Factory pour créer un WeaponState avec valeurs par défaut
 */
export function createWeaponState(
  overrides: Partial<WeaponState> = {}
): WeaponState {
  return {
    id: overrides.id ?? '',
    name: overrides.name ?? '',
    description: overrides.description ?? '',
    sprite: overrides.sprite ?? '',
    price: overrides.price ?? 0,
    isActive: overrides.isActive ?? false,
    damage: overrides.damage ?? 0,
    cooldown: overrides.cooldown ?? 0,
    cooldownRemaining: overrides.cooldownRemaining ?? 0,
    type: overrides.type ?? 'normal',
    ammoConsumption: overrides.ammoConsumption ?? 0,
    energyConsumption: overrides.energyConsumption ?? 0,
    elementalEffectProbability: overrides.elementalEffectProbability ?? 0,
  };
}
