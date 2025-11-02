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


export const defaultWeapon: WeaponState = {
  id: '',
  name: '',
  description: '',
  sprite: '',
  price: 0,
  isActive: false,
  damage: 0,
  cooldown: 0,
  cooldownRemaining: 0,
  type: 'normal',
  ammoConsumption: 0,
  energyConsumption: 0,
  elementalEffectProbability: 0,
};

/**
 * Factory to create a WeaponState with optional overrides.
 */
export function createWeaponState(
  overrides: Partial<WeaponState> = {}
): WeaponState {
  return {
    ...defaultWeapon,
    ...overrides,
  };
}
