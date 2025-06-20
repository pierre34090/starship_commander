// src/controllers/combatController.ts

import { runCombatStep as runCombatRound } from './CombatRound';
import { checkStageOutcome, advanceStage } from '../../state/StageManagement';
import { MessageBus } from '../../../contexts/MessageContext';

import type { GameState } from '../../state/GameState';
import type { GameMetaState } from '../../state/MetaGameState';
import type { EnemyStatus, EnemyShipState } from '../../state/Ships/EnemyShipState';


/**
 * Executes one round of combat, then checks for game over or game win conditions.
 */
export function resolveCombatStep(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const [afterCombatState, afterCombatMeta, defeatedEnemy] = runCombatRound(gameState, metaState);
  const checkedMeta = checkStageOutcome(afterCombatState, afterCombatMeta);
  const rewardedState = defeatedEnemy ? collectCombatReward(afterCombatState, defeatedEnemy) : afterCombatState;

  const allEnemiesDead = afterCombatState.stage_enemy_ships.every(e => e.status !== 'alive');
  const bossDead = !afterCombatState.stage_boss_ship || afterCombatState.stage_boss_ship.status !== 'alive';
  const gameEnded = checkedMeta.gameOver || checkedMeta.gameWin;

  if (allEnemiesDead && bossDead && !gameEnded) {
    return advanceStage(rewardedState, checkedMeta);
  }

  return [rewardedState, checkedMeta];
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
    text: `Defeated ${enemy.name}! +${xpReward} XP, +${totalCredits} credits.`,
  });

  return {
    ...state,
    economy: {
      ...state.economy,
      credits: state.economy.credits + totalCredits,
    },
    player_ship: {
      ...state.player_ship,
      xp: state.player_ship.xp + xpReward,
    },
  };
}


/**
 * Applies a skip to the next non-boss enemy in the list.
 * Returns the updated GameState.
 */
function applySkipToGameState(gameState: GameState): GameState {
  const boss = gameState.stage_boss_ship;
  const nextEnemy =
    gameState.stage_enemy_ships.find((e) => e.status === 'alive') ??
    (boss?.status === 'alive' ? boss : null);

  if (!nextEnemy || nextEnemy === boss) return gameState;

  const skippedEnemies = gameState.stage_enemy_ships.map((e) =>
    e === nextEnemy ? { ...e, status: 'skipped' as EnemyStatus } : e
  );

  return {
    ...gameState,
    stage_enemy_ships: skippedEnemies,
  };
}

/**
 * Skips the current non-boss enemy (if any), then checks for game outcome.
 */
export function resolveSkipEnemy(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const skippedState = applySkipToGameState(gameState);
  const checkedMeta = checkStageOutcome(skippedState, metaState);
  return [skippedState, checkedMeta];
}

/**
 * Advances to the next stage with new enemies and boss.
 */
export function resolveAdvanceStage(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  return advanceStage(gameState, metaState);
}


