// src/libs/state/Ships/ShipState.ts

import { v4 as uuidv4 } from 'uuid';
import { createShipBaseState, ShipBaseState } from './ShipBaseState';
import type { WeaponState } from '../Items/WeaponState';
import type { ModuleState } from '../Items/ModuleState';
import type { Subsystems } from './ShipSystems';
import type { ElementalEffect } from '../../logic/combat/DamageType';

import { createSubsystems } from './ShipSystems';

export type ShipState = {
  id: string;             // Unique identifier
  name: string;
  description: string;
  sprite: string;

  baseStats: ShipBaseState;

  currentHp: number;
  currentShield: number;
  currentArmor: number;

  currentAmmo: number;

  weapons: WeaponState[];
  modules: ModuleState[];
  subsystems: Subsystems;

  statusEffects: ElementalEffect[];
};

/**
 * Factory to create a ShipState with optional overrides.
 * Generates a new unique id on each call.
 */
export function createShipState(
  overrides: Partial<ShipState> = {}
): ShipState {
  return {
    id: overrides.id ?? uuidv4(),
    name: overrides.name ?? '',
    description: overrides.description ?? '',
    sprite: overrides.sprite ?? '',
    baseStats: createShipBaseState(overrides.baseStats ?? {}),
    currentHp: overrides.currentHp ?? 0,
    currentShield: overrides.currentShield ?? 0,
    currentArmor: overrides.currentArmor ?? 0,
    currentAmmo: overrides.currentAmmo ?? 0,
    weapons: overrides.weapons ?? [],
    modules: overrides.modules ?? [],
    subsystems: createSubsystems(overrides.subsystems ?? {}),
    statusEffects: overrides.statusEffects ?? [],
  };
}
