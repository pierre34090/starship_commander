// src/libs/logic/combat/CombatOrchestrator.ts

import { runCombatRound } from './RoundManager';
import { handleStageProgression } from './StageManager';
import { applyEndOfCombatEffects } from './EndOfCombatManager';
import { applyEndOfRoundEffects } from './EndOfRoundManager';

import { MessageBus } from '../../../contexts/MessageContext';

import type { GameState } from '../../state/GameState';
import type { GameMetaState } from '../../state/MetaGameState';
import type { EnemyStatus, EnemyShipState } from '../../state/Ships/EnemyShipState';



export function resolveCombatStep(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const [afterCombatState, afterCombatMeta, targetEnemy] = runCombatRound(gameState, metaState);

  const afterEffects = applyEndOfRoundEffects(afterCombatState);

  // Délègue au stage manager la gestion complète de la progression du stage
  const [finalGameState, finalMetaState] = handleStageProgression(afterEffects, afterCombatMeta);

  const withRewards = targetEnemy
    ? collectCombatReward(finalGameState, targetEnemy)
    : finalGameState;

  return [withRewards, finalMetaState];
}


export function collectCombatReward(
  state: GameState,
  enemy: EnemyShipState
): GameState {
  const moneyReward = enemy.bounty ?? 0;
  const xpReward = enemy.xp ?? 0;
  const incomeBonus = state.economy.income;
  const totalCredits = moneyReward + incomeBonus;

  MessageBus.send({
    type: 'success',
    text: `Defeated ${enemy.ship.name}! +${xpReward} XP, +${totalCredits} credits.`,
  });

  return applyEndOfCombatEffects({
    ...state,
    economy: {
      ...state.economy,
      credits: state.economy.credits + totalCredits,
    },
    player_ship: {
      ...state.player_ship,
      xp: state.player_ship.xp + xpReward,
    },
  });
}


/**
 * Applies a skip to the next non-boss enemy in the list.
 * Returns the updated GameState.
 */
export function resolveSkipEnemy(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const boss = gameState.stage_boss_ship;
  const nextEnemy =
    gameState.stage_enemy_ships.find((e) => e.status === 'alive') ??
    (boss?.status === 'alive' ? boss : null);

  if (!nextEnemy || nextEnemy === boss) {
    // Rien à skip, mais on s'assure que la progression de stage est appliquée
    return handleStageProgression(gameState, metaState);
  }

  const skippedEnemies = gameState.stage_enemy_ships.map((e) =>
    e === nextEnemy ? { ...e, status: 'skipped' as EnemyStatus } : e
  );

  const skippedState: GameState = {
    ...gameState,
    stage_enemy_ships: skippedEnemies,
  };

  // Applique les effets de fin de combat (ammo regen, etc.) avant progression
  const afterEffects = applyEndOfCombatEffects(skippedState);

  // Délègue tout à handleStageProgression (sync status, update meta, avancer stage)
  return handleStageProgression(afterEffects, metaState);
}

