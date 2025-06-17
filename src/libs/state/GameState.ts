// src/libs/state/GameState.ts

import type { EconomyState } from './EconomyState'
import type { EnemyShipState } from './Ships/EnemyShipState'
import type { PlayerShipState } from './Ships/PlayerShipState'

import { initPlayerShipState } from './Ships/PlayerShipState';
import { initEconomyState } from './EconomyState';
import { generateEnemiesForStage } from '../models/Ships/EnemyFactory';

export type GameState = {
  player_name: string;
  player_ship: PlayerShipState;
  economy: EconomyState;
  stage_enemy_ships: EnemyShipState[];
  stage_boss_ship: EnemyShipState | null;
};

export const initGameState = (
  player_name: string,
  player_ship: PlayerShipState
): GameState => {
  const { enemies, boss } = generateEnemiesForStage(0);
  return {
    player_name,
    player_ship,
    economy: initEconomyState(),
    stage_enemy_ships: enemies,
    stage_boss_ship: boss,
  };
};
