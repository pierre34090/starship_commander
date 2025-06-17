// src/libs/state/Ships/BossShipState.ts

import { initEnemyShipState, type EnemyShipState } from './EnemyShipState';

export type BossShipState = EnemyShipState & {
  // champs spécifiques au boss si besoin (ex: attaques spéciales)
};

export const initBossShipState = (): BossShipState => ({
  ...initEnemyShipState(),
  // initialisation spécifique au boss, si besoin
});
