// src/libs/state/Ships/ShipState.ts

import { v4 as uuidv4 } from 'uuid';
import type { WeaponState } from '../Items/WeaponState';
import type { ModuleState } from '../Items/ModuleState';
import type { Subsystems, SubsystemType } from './ShipSubsystems';
import type { ElementalEffect } from '../../logic/combat/DamageType';
import { createSubsystems } from './ShipSubsystems';
import { createShipBaseState, ShipBaseState } from './ShipBaseState';

export type ShipRole = 'player' | 'enemy' | 'boss';
export type EnemyStatus = 'alive' | 'dead' | 'skipped';
export type EnergyAllocation = Record<SubsystemType, number>;

export type ShipState = {
  id: string;
  role: ShipRole;

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

  maxEnergy: number;
  subsystems: Subsystems;
  energyAllocation: EnergyAllocation;

  statusEffects: ElementalEffect[];

  // Specific to player
  xp?: number;
  level?: number;

  // Specific to enemies
  status?: EnemyStatus;
  behavior?: 'aggressive' | 'defensive' | 'random';
  xpBounty?: number;
  creditsBounty?: number;
};

// Valeurs par défaut hors id, baseStats et subsystems (qui restent créés dynamiquement)
export const defaultShip: Omit<ShipState, 'id' | 'baseStats' | 'subsystems'> = {
  role: 'enemy',
  name: '',
  description: '',
  sprite: '',
  currentHp: 0,
  currentShield: 0,
  currentArmor: 0,
  currentAmmo: 0,
  weapons: [],
  modules: [],
  maxEnergy: 5,
  energyAllocation: {
    shields: 0,
    weapons: 0,
    engines: 0,
    targeting: 0,
  },
  statusEffects: [],
  // les autres champs optionnels sont laissés undefined par défaut
};

/**
 * Generic ShipState creator with optional overrides.
 */
export function createShipState(overrides: Partial<ShipState> = {}): ShipState {
  const {
    baseStats,
    subsystems,
    id,
    ...restOverrides
  } = overrides;

  return {
    id: id ?? uuidv4(),
    baseStats: createShipBaseState(baseStats ?? {}),
    subsystems: createSubsystems(subsystems ?? {}),
    ...defaultShip,
    ...restOverrides,
  };
}