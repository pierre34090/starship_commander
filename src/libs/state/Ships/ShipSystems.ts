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
 * Initialise les sous-systèmes avec des valeurs par défaut.
 */
export function defaultSubsystems(): Subsystems {
  const defaultHp = 3;

  const create = (): ShipSubsystemState => ({
    currentHp: defaultHp,
    maxHp: defaultHp,
    isDisabled: false,
  });

  return {
    shields: create(),
    weapons: create(),
    engines: create(),
    targeting: create(),
    hull: create(),
  };
}
