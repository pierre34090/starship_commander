/// <reference types="vite/client" />
import type { Ship } from '../models/ships/Ship';
// Manual imports to debug dynamic import issues
import { Bomber } from '../models/ships/enemies/Bomber';
import { Scout } from '../models/ships/enemies/Scout';
import { Raider } from '../models/ships/enemies/Raider';

// Temporary hardcoded list of enemy classes
const enemyClasses: Array<new () => Ship> = [Bomber, Scout, Raider];

/**
 * Generates a random enemy instance from the hardcoded enemy classes.
 */
export function generateEnemy(): Ship {
  const idx = Math.floor(Math.random() * enemyClasses.length);
  const EnemyCtor = enemyClasses[idx];
  return new EnemyCtor();
}
