// src/libs/state/Ships/ShipState.ts

import { v4 as uuidv4 } from 'uuid';
import { createShipBaseState, ShipBaseState } from './ShipBaseState';
import type { WeaponState } from '../Items/WeaponState';
import type { ModuleState } from '../Items/ModuleState';
import type { Subsystems } from './ShipSubsystems';
import { createSubsystems } from './ShipSubsystems';
import type { ElementalEffect } from '../../logic/combat/DamageType';

export type ShipRole = 'player' | 'enemy' | 'boss';
export type EnemyStatus = 'alive' | 'dead' | 'skipped';

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

  subsystems: Subsystems;

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
    subsystems: createSubsystems(overrides.subsystems ?? {}),
    statusEffects: overrides.statusEffects ?? [],

    xp: overrides.xp,
    level: overrides.level,

    status: overrides.status,
    behavior: overrides.behavior,
    xpBounty: overrides.xpBounty,
    creditsBounty: overrides.creditsBounty,
  };
}
