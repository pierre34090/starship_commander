//src/libs/models/Ships/EnemyShipsStats.ts

import type { EnemyShipState } from '../../state/Ships/EnemyShipState';

export const scout: EnemyShipState = {
  name: "Scout",
  description: "Fast but squishy",
  sprite: "/sprites/vessels/scout.png",
  hp: 60,
  maxHp: 60,
  attack: 8,
  defense: 2,
  weapons: [],
  behavior: 'random',
  bounty: 30,
};

export const bomber: EnemyShipState = {
  name: "Bomber",
  description: "Slow but tanky",
  sprite: "/sprites/vessels/bomber.png",
  hp: 150,
  maxHp: 150,
  attack: 4,
  defense: 8,
  weapons: [],
  behavior: 'defensive',
  bounty: 60,
};

export const raider: EnemyShipState = {
  name: "Raider",
  description: "Balanced",
  sprite: "/sprites/vessels/raider.png",
  hp: 100,
  maxHp: 100,
  attack: 6,
  defense: 5,
  weapons: [],
  behavior: 'aggressive',
  bounty: 50,
};

export const allEnemyShips: EnemyShipState[] = [scout, bomber, raider];
