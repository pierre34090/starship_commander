import { allEnemyShips } from './EnemyShipsTemplates';
import { allBossShips } from './BossShipsTemplates';
import type { ShipState } from '../../state/Ships/ShipState';

/**
 * Génère une séquence d'ennemis pour un stage donné.
 * - 5 ennemis aléatoires
 * - 1 boss si disponible (sinon rien)
 */
export function generateEnemiesForStage(stage: number): ShipState[] {
  const enemies = Array.from({ length: 5 }, () => {
    const index = Math.floor(Math.random() * allEnemyShips.length);
    return { ...allEnemyShips[index] }; // shallow clone
  });

  const boss = allBossShips[stage];
  if (boss) enemies.push({ ...boss });

  return enemies;
}
