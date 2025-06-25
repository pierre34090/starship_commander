// src/libs/state/Ships/ShipBaseState.ts

export type ShipBaseState = {
  baseHp: number;
  baseShield: number;
  baseArmor: number;
  baseGlobalDamage: number;
  basePrecision: number;
  baseEvasion: number;
};

export function createShipBaseState(
  overrides: Partial<ShipBaseState> = {}
): ShipBaseState {
  return {
    baseHp: overrides.baseHp ?? 0,
    baseShield: overrides.baseShield ?? 0,
    baseArmor: overrides.baseArmor ?? 0,
    baseGlobalDamage: overrides.baseGlobalDamage ?? 0,
    basePrecision: overrides.basePrecision ?? 0,
    baseEvasion: overrides.baseEvasion ?? 0,
  };
}