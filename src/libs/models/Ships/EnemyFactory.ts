// src/libs/models/Ships/EnemyFactory.ts

import { allEnemyShips } from './EnemyShipsTemplates';
import { allBossShips } from './BossShipsTemplates';
import type { EnemyShipState } from '../../state/Ships/EnemyShipState';

export function generateEnemiesForStage(stage: number): {
  enemies: EnemyShipState[];
  boss: EnemyShipState | null;
} {
  // Générer 5 ennemis normaux aléatoires
  const enemies = Array.from({ length: 5 }, () => {
    const index = Math.floor(Math.random() * allEnemyShips.length);
    return { ...allEnemyShips[index] };
  });

  // Récupérer le boss correspondant au stage, ou null
  const boss = allBossShips[stage] || null;

  return { enemies, boss };
}
