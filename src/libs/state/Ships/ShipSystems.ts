// src/libs/state/Ships/ShipSystems.ts

import type { DamageType } from '../../logic/combat/DamageType';

// Sous-systèmes pouvant être ciblés
export type SubsystemType =
  | 'shields'
  | 'weapons'
  | 'engines'
  | 'targeting'
  | 'hull'; // la coque, i.e. les HP globaux

export type ShipSubsystemState = {
  currentHp: number;
  maxHp: number;
  isDisabled: boolean;
};

export type Subsystems = Record<SubsystemType, ShipSubsystemState>;

// Priorité de ciblage choisie par le joueur
export type TargetingPriority = SubsystemType | null;

/**
 * Factory pour créer un ShipSubsystemState avec valeurs par défaut
 */
export function createShipSubsystemState(
  overrides: Partial<ShipSubsystemState> = {}
): ShipSubsystemState {
  return {
    currentHp: overrides.currentHp !== undefined ? overrides.currentHp : 3,
    maxHp: overrides.maxHp !== undefined ? overrides.maxHp : 3,
    isDisabled: overrides.isDisabled !== undefined ? overrides.isDisabled : false,
  };
}

/**
 * Factory pour créer un ensemble complet de sous-systèmes,
 * avec possibilité d’overrides partiels par sous-système.
 */
export function createSubsystems(
  overrides: Partial<Record<SubsystemType, Partial<ShipSubsystemState>>> = {}
): Subsystems {
  return {
    shields: createShipSubsystemState(overrides.shields ?? {}),
    weapons: createShipSubsystemState(overrides.weapons ?? {}),
    engines: createShipSubsystemState(overrides.engines ?? {}),
    targeting: createShipSubsystemState(overrides.targeting ?? {}),
    hull: createShipSubsystemState(overrides.hull ?? {}),
  };
}
