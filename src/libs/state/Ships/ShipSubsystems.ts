// src/libs/state/Ships/ShipSystems.ts


// Sous-systèmes pouvant être ciblés
export type SubsystemType =
  | 'shields'
  | 'weapons'
  | 'engines'
  | 'targeting';

export type ShipSubsystemState = {
  level: number;
  currentHp: number;
  maxHp: number;
  isDisabled: boolean;
  hpPerLevel: number;
  bonusPerLevel: number;
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
  const perPoint = overrides.hpPerLevel ?? 20;
  return {
    level: overrides.level ?? 1,
    currentHp: overrides.currentHp ?? perPoint,
    maxHp: overrides.maxHp ?? perPoint,
    isDisabled: overrides.isDisabled ?? false,
    hpPerLevel: perPoint,
    bonusPerLevel: overrides.bonusPerLevel ?? 0.1,
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
  };
}



