// src/libs/state/Ships/ShipBaseState.ts

export type ShipBaseState = {
  baseHp: number;
  baseShield: number;
  baseArmor: number;
  baseGlobalDamage: number;
  basePrecision: number;
  baseEvasion: number;
};

export const initShipBaseState = (): ShipBaseState => ({
  baseHp: 0,
  baseShield: 0,
  baseArmor: 0,
  baseGlobalDamage: 0,
  basePrecision: 0,
  baseEvasion: 0,
});