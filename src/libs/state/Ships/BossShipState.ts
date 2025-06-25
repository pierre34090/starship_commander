import { createEnemyShipState, type EnemyShipState } from './EnemyShipState';

export type BossShipState = EnemyShipState & {
  // Champs spécifiques au boss à ajouter ici si nécessaire
};

/**
 * Factory to create a BossShipState with optional overrides.
 * Suit strictement le même pattern que createEnemyShipState.
 */
export function createBossShipState(
  overrides: Partial<BossShipState> = {}
): BossShipState {
  // On traite overrides comme Partial<EnemyShipState> pour createEnemyShipState
  const base = createEnemyShipState(overrides as Partial<EnemyShipState>);
  return {
    ...base,
    ...overrides, // Priorité aux overrides boss spécifiques
  };
}
