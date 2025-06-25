// src/libs/state/GameState.ts

import type { EconomyState } from './EconomyState';
import type { ShipState } from './Ships/ShipState';
import type { TargetingPriority } from './Ships/ShipSystems';

import { initEconomyState } from './EconomyState';
import { generateEnemiesForStage } from '../models/Ships/EnemyFactory';

export type GameState = {
  player_name: string;
  player_ship: ShipState;
  economy: EconomyState;
  stageEnemies: ShipState[];
  targetingPriority: TargetingPriority;
};

export const initGameState = (
  player_name: string,
  player_ship: ShipState
): GameState => {
  return {
    player_name,
    player_ship,
    economy: initEconomyState(),
    stageEnemies: generateEnemiesForStage(0),
    targetingPriority: null,
  };
};
