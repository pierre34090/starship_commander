// src/libs/state/Ships/ShipState.ts

import type { WeaponState } from '../Items/WeaponState';
import type { ModuleState } from '../Items/ModuleState';
import type { Subsystems, SubsystemType } from './ShipSubsystems';
import type { ElementalEffect } from '../../logic/combat/DamageType';

import { v4 as uuidv4 } from 'uuid';
import { createShipBaseState, ShipBaseState } from './ShipBaseState';
import { createSubsystems } from './ShipSubsystems';


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

/**
 * Generic ShipState creator with optional overrides.
 */
export function createShipState(overrides: Partial<ShipState> = {}): ShipState {
  return {
    id: overrides.id ?? uuidv4(),
    role: overrides.role ?? 'enemy',

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

    maxEnergy: overrides.maxEnergy ?? 5,
    subsystems: createSubsystems(overrides.subsystems ?? {}),
    energyAllocation: {
      shields: 0,
      weapons: 0,
      engines: 0,
      targeting: 0,
    },

    statusEffects: overrides.statusEffects ?? [],

    xp: overrides.xp,
    level: overrides.level,

    status: overrides.status,
    behavior: overrides.behavior,
    xpBounty: overrides.xpBounty,
    creditsBounty: overrides.creditsBounty,
  };
}
